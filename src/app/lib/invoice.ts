import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LEGAL_COMPANY } from '../data/legalCompany';
import { getAdminStoreSettings } from './adminSettings';
import type { AdminOrderDetail } from './api';

const GST_RATE = 18;
const GST_LABEL = 'IGST';

function pdfMoney(paise: number): string {
  const rupees = (Number(paise) || 0) / 100;
  return `Rs ${Math.abs(rupees).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function placeOfSupply(addr?: { state?: string; country?: string } | null) {
  const state = addr?.state?.trim();
  let country = (addr?.country || 'India').trim();
  if (/^in$/i.test(country)) country = 'India';
  return state ? `${state}, ${country}` : country;
}

function gstInclusivePaise(totalPaise: number) {
  return Math.round(((Number(totalPaise) || 0) * GST_RATE) / (100 + GST_RATE));
}

function humanPaymentMethod(provider: string, method?: string | null) {
  const p = (provider ?? '').toLowerCase();
  const m = (method ?? '').toLowerCase();
  const isCod = p === 'cod' || m === 'cod';
  // Keep labels short so they fit one line in the payment column (no bad wrap).
  if (isCod) return { lines: ['Cash on Delivery'], mode: 'COD', isCod: true };

  const instruments: Record<string, string> = {
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    emi: 'EMI',
    cardless_emi: 'EMI',
    paylater: 'Pay Later',
  };
  if (m && instruments[m]) return { lines: [instruments[m]], mode: 'Prepaid', isCod: false };
  if (p === 'stripe') return { lines: ['Card'], mode: 'Prepaid', isCod: false };
  return { lines: ['Online'], mode: 'Prepaid', isCod: false };
}

export type InvoiceDetail = {
  order: {
    order_number: string;
    status: string;
    created_at: string;
    subtotal_paise: number;
    discount_paise: number;
    total_paise: number;
    coupon_code?: string | null;
    shipping_paise?: number;
    shipping_address?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
      gstin?: string;
    } | null;
  };
  items: Array<{
    snapshot_name: string;
    quantity: number;
    unit_price_paise: number;
    line_total_paise?: number;
  }>;
  payments: Array<{
    provider: string;
    status: string;
    provider_payment_id?: string | null;
    provider_order_id?: string | null;
    method?: string | null;
  }>;
  user?: {
    full_name?: string | null;
    email?: string;
    phone?: string | null;
  } | null;
};

function drawCard(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.roundedRect(x, y, w, h, 8, 8, 'FD');
}

function drawVLine(doc: jsPDF, x: number, y1: number, y2: number) {
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.7);
  doc.line(x, y1, x, y2);
}

/** Official ODI mark in Supabase product-images/brand (same asset as email). */
const INVOICE_LOGO_URL =
  'https://joiezvghtlyeyhuyvnwl.supabase.co/storage/v1/object/public/product-images/brand/odi-email-logo.png';

let invoiceLogoPngCache: string | null | undefined;

/**
 * Load the storage logo and invert it: black ODI on white (no black box).
 */
async function getInvoiceLogoPng(): Promise<string | null> {
  if (invoiceLogoPngCache !== undefined) return invoiceLogoPngCache;
  try {
    const res = await fetch(INVOICE_LOGO_URL, { mode: 'cors' });
    if (!res.ok) throw new Error(`logo ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const png = await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 320;
        const h = img.naturalHeight || 120;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const image = ctx.getImageData(0, 0, w, h);
        const d = image.data;
        // Invert RGB so white ODI on black → black ODI on white
        for (let i = 0; i < d.length; i += 4) {
          d[i] = 255 - d[i];
          d[i + 1] = 255 - d[i + 1];
          d[i + 2] = 255 - d[i + 2];
        }
        ctx.putImageData(image, 0, 0);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      img.src = objectUrl;
    });
    invoiceLogoPngCache = png;
    return png;
  } catch {
    invoiceLogoPngCache = null;
    return null;
  }
}

function drawOdiMarkFallback(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.7);
  doc.roundedRect(x, y, w, h, 6, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(Math.min(13, h * 0.55));
  doc.setTextColor(17, 17, 17);
  doc.text('ODI', x + w / 2, y + h / 2 + h * 0.18, { align: 'center' });
}

export async function downloadOrderInvoice(detail: InvoiceDetail | AdminOrderDetail) {
  const settings = getAdminStoreSettings();
  const supportEmail =
    settings.supportEmail && settings.supportEmail !== 'support@odi.com'
      ? settings.supportEmail
      : LEGAL_COMPANY.email;
  const website = LEGAL_COMPANY.websiteLabel;

  const { order, items, payments, user } = detail;
  const addr = order.shipping_address;

  const customerName =
    [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') ||
    user?.full_name ||
    user?.email ||
    'Customer';
  const customerEmail = addr?.email || user?.email || '';
  const customerPhone = addr?.phone || (user?.phone ? String(user.phone) : '') || '';
  const shipCountry = !addr?.country || /^in$/i.test(addr.country) ? 'India' : addr.country;
  const shipParts = [
    addr?.street,
    addr?.city && addr?.state && addr.city.trim().toLowerCase() === addr.state.trim().toLowerCase()
      ? null
      : addr?.city,
    addr?.state,
    addr?.postal_code,
    shipCountry,
  ];
  const shipLine = shipParts.filter(Boolean).join(', ');
  const buyerGstin = (addr as { gstin?: string } | null | undefined)?.gstin?.trim() || '';

  const payment =
    payments.find((row) =>
      ['captured', 'paid', 'authorized'].includes((row.status || '').toLowerCase()),
    ) || payments[0];
  const payKind = humanPaymentMethod(payment?.provider || '', payment?.method);
  const isCod = payKind.isCod;
  const payStatus = (payment?.status || '').toLowerCase();
  const isPaid = isCod
    ? ['captured', 'paid'].includes(payStatus) || order.status === 'delivered'
    : ['captured', 'paid', 'authorized'].includes(payStatus) ||
      ['paid', 'delivered', 'shipped', 'processing'].includes(order.status);

  const txnId = payment?.provider_payment_id || payment?.provider_order_id || '—';
  const displayTxn = txnId.length > 24 ? `${txnId.slice(0, 11)}…${txnId.slice(-8)}` : txnId;

  const gstPaise = gstInclusivePaise(order.total_paise);
  const shippingPaise = order.shipping_paise ?? 0;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const mX = 40;
  const contentW = pageW - mX * 2;
  const GAP = 18;
  const FOOTER_RESERVE = 46;

  // ── Header: Supabase brand logo (black on white) LEFT + TAX INVOICE RIGHT
  const headerTop = 34;
  const logoW = 64;
  const logoH = 28;
  const logoPng = await getInvoiceLogoPng();
  if (logoPng) {
    doc.addImage(logoPng, 'PNG', mX, headerTop, logoW, logoH);
  } else {
    drawOdiMarkFallback(doc, mX, headerTop, logoW, logoH);
  }

  const brandX = mX + logoW + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('ODI STUDIO KIDS STORE', brandX, headerTop + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Spatial Media & Kids Learning Kits', brandX, headerTop + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39);
  doc.text('TAX INVOICE', pageW - mX, headerTop + 18, { align: 'right' });

  // ── Sold by (left) + invoice meta (right) ───────────────────────────────
  const metaColW = 210;
  const soldW = contentW - metaColW - 16;
  let y = headerTop + logoH + 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const soldAddress = LEGAL_COMPANY.address.replace(/^ODI Studio,\s*/i, '');
  const soldBy = doc.splitTextToSize(
    `Sold By: ODI Studio Kids Store, ${soldAddress}`,
    soldW,
  ) as string[];
  doc.text(soldBy, mX, y);

  const metaRows: Array<[string, string]> = [
    ['Invoice Number', `#${order.order_number}`],
    ['Invoice Date', formatDate(order.created_at)],
    ['Place of Supply', placeOfSupply(addr)],
  ];
  let metaY = y;
  for (const [label, value] of metaRows) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${label}:`, pageW - mX - metaColW, metaY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(17, 24, 39);
    const lines = doc.splitTextToSize(value, metaColW - 88) as string[];
    doc.text(lines, pageW - mX, metaY, { align: 'right' });
    metaY += Math.max(13, lines.length * 11);
  }

  y = Math.max(y + soldBy.length * 10.5, metaY) + 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Seller GSTIN: ${LEGAL_COMPANY.gstin}   ·   State: Punjab   ·   Support: ${supportEmail}   ·   ${website}`,
    mX,
    y,
  );

  y += 14;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.8);
  doc.line(mX, y, pageW - mX, y);
  y += GAP + 4;

  // ── Customer & shipping ─────────────────────────────────────────────────
  const leftPad = 16;
  const midX = mX + contentW / 2;
  const rightPad = midX + 16;
  const nameMaxW = contentW / 2 - 36;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const nameLines = doc.splitTextToSize(customerName, nameMaxW) as string[];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const shipLines = doc.splitTextToSize(shipLine || '—', nameMaxW) as string[];

  const leftBodyH =
    18 + // BILLED TO
    nameLines.length * 14 +
    (customerEmail ? 12 : 0) +
    (customerPhone ? 12 : 0) +
    (buyerGstin ? 16 : 0) +
    8;
  const rightBodyH = 18 + nameLines.length * 14 + shipLines.length * 11 + 8;
  const custH = Math.max(108, 34 + Math.max(leftBodyH, rightBodyH));

  drawCard(doc, mX, y, contentW, custH);

  // soft header strip
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(mX + 0.5, y + 0.5, contentW - 1, 26, 8, 8, 'F');
  doc.setFillColor(248, 250, 252);
  doc.rect(mX + 0.5, y + 12, contentW - 1, 14, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CUSTOMER & SHIPPING DETAILS', mX + leftPad, y + 17);
  doc.text(
    buyerGstin ? 'B2B / Registered' : 'B2C / Unregistered',
    pageW - mX - leftPad,
    y + 17,
    { align: 'right' },
  );

  drawVLine(doc, midX, y + 32, y + custH - 10);

  // Billed to
  let cy = y + 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('BILLED TO', mX + leftPad, cy);
  cy += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(nameLines, mX + leftPad, cy);
  cy += nameLines.length * 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  if (customerEmail) {
    doc.text(customerEmail, mX + leftPad, cy);
    cy += 12;
  }
  if (customerPhone) {
    doc.text(
      customerPhone.startsWith('+') ? customerPhone : `+91 ${customerPhone}`,
      mX + leftPad,
      cy,
    );
    cy += 12;
  }
  if (buyerGstin) {
    cy += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(17, 24, 39);
    doc.text(`BUYER GSTIN: ${buyerGstin}`, mX + leftPad, cy);
  }

  // Shipping
  let sy = y + 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('DELIVERY / SHIPPING ADDRESS', rightPad, sy);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(pageW - mX - 108, y + 32, 92, 15, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Standard Delivery', pageW - mX - 62, y + 42, { align: 'center' });

  sy += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(nameLines, rightPad, sy);
  sy += nameLines.length * 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(shipLines, rightPad, sy);

  y += custH + GAP;

  // ── Payment details ─────────────────────────────────────────────────────
  const payH = 64;
  drawCard(doc, mX, y, contentW, payH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('PAYMENT DETAILS', mX + leftPad, y + 15);

  const payCols = [
    { label: 'PAYMENT METHOD', lines: payKind.lines, color: [17, 24, 39] as const },
    { label: 'PAYMENT MODE', lines: [payKind.mode], color: [17, 24, 39] as const },
    {
      label: 'PAYMENT STATUS',
      lines: [isPaid ? 'Paid in Full' : isCod ? 'Pay on delivery' : 'Awaiting payment'],
      color: (isPaid
        ? [16, 185, 129]
        : isCod
          ? [217, 119, 6]
          : [100, 116, 139]) as [number, number, number],
    },
    { label: 'TRANSACTION ID', lines: [displayTxn], color: [17, 24, 39] as const },
  ];
  const colW = contentW / 4;
  payCols.forEach((col, i) => {
    const cx = mX + colW * i + 14;
    if (i > 0) drawVLine(doc, mX + colW * i, y + 24, y + payH - 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(col.label, cx, y + 34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(col.color[0], col.color[1], col.color[2]);
    // Single-line values only — never wrap mid-phrase in the payment row
    const line = col.lines[0] || '—';
    const fitted =
      doc.getTextWidth(line) <= colW - 22
        ? line
        : `${line.slice(0, Math.max(8, Math.floor((colW - 22) / 5)))}…`;
    doc.text(fitted, cx, y + 50);
  });

  y += payH + GAP;

  // ── Items table ─────────────────────────────────────────────────────────
  const tablePad = 6;
  const tableTop = y + tablePad;
  const tableRows = items.map((item, i) => {
    const lineTotal = item.line_total_paise ?? item.unit_price_paise * item.quantity;
    return [
      String(i + 1).padStart(2, '0'),
      item.snapshot_name,
      String(item.quantity),
      pdfMoney(item.unit_price_paise),
      pdfMoney(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: tableTop,
    head: [['#', 'ITEM DESCRIPTION', 'QTY', 'RATE (INCL. GST)', 'AMOUNT (INR)']],
    body: tableRows.length ? tableRows : [['—', 'No items', '0', pdfMoney(0), pdfMoney(0)]],
    theme: 'plain',
    margin: { left: mX + 4, right: mX + 4 },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: [17, 24, 39],
      cellPadding: { top: 10, bottom: 16, left: 8, right: 8 },
      valign: 'middle',
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [148, 163, 184],
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: { top: 10, bottom: 10, left: 8, right: 8 },
    },
    columnStyles: {
      0: { cellWidth: 32, textColor: [148, 163, 184], fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontStyle: 'bold', fontSize: 10 },
      2: { halign: 'center', cellWidth: 48, fontStyle: 'bold' },
      3: { halign: 'right', cellWidth: 112, fontStyle: 'bold', fontSize: 9 },
      4: { halign: 'right', cellWidth: 100, fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `(Incl. ${GST_RATE}% ${GST_LABEL})`,
          data.cell.x + data.cell.width - 8,
          data.cell.y + data.cell.height - 6,
          { align: 'right' },
        );
      }
    },
  });

  const tableBottom =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? tableTop + 48;
  const itemsCardH = Math.max(tableBottom - y + tablePad, 64);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.roundedRect(mX, y, contentW, itemsCardH, 8, 8, 'S');

  // ── Notes + totals (anchored above footer when space allows) ────────────
  type TotalRow = {
    label: string;
    value: string;
    kind: 'muted' | 'green' | 'total' | 'paid' | 'gst';
  };
  const totalRows: TotalRow[] = [
    { label: 'Subtotal (MRP)', value: pdfMoney(order.subtotal_paise), kind: 'muted' },
  ];
  if (order.discount_paise > 0) {
    totalRows.push({
      label: order.coupon_code ? `Discount (${order.coupon_code})` : 'Discount',
      value: `- ${pdfMoney(order.discount_paise)}`,
      kind: 'muted',
    });
  }
  totalRows.push({
    label: 'Shipping & Handling',
    value: shippingPaise > 0 ? pdfMoney(shippingPaise) : 'Free',
    kind: shippingPaise > 0 ? 'muted' : 'green',
  });
  totalRows.push({
    label: `Included ${GST_LABEL} (${GST_RATE}%)`,
    value: pdfMoney(gstPaise),
    kind: 'gst',
  });
  totalRows.push({
    label: 'TOTAL INVOICE AMOUNT',
    value: pdfMoney(order.total_paise),
    kind: 'total',
  });
  if (isPaid) {
    totalRows.push({
      label: 'Total Paid (Full Settlement)',
      value: pdfMoney(order.total_paise),
      kind: 'paid',
    });
  }

  const bottomH = Math.max(100, 22 + totalRows.length * 18 + 14);
  let blockY = y + itemsCardH + GAP;
  // Keep original mock spacing: sit near the footer when the page has room,
  // but do not leave a huge empty gap in the middle.
  const preferredY = pageH - FOOTER_RESERVE - bottomH;
  if (preferredY - blockY > 40 && preferredY - blockY < 160) {
    blockY = preferredY;
  }
  if (blockY + bottomH > pageH - FOOTER_RESERVE) {
    doc.addPage();
    blockY = 40;
  }

  const gapMid = 16;
  const notesW = contentW * 0.44;
  const totalsX = mX + notesW + gapMid;

  drawCard(doc, mX, blockY, notesW, bottomH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('TERMS & NOTES', mX + 14, blockY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const thanks = doc.splitTextToSize(
    'Thank you for shopping with ODI Studio Kids Store!',
    notesW - 28,
  ) as string[];
  doc.text(thanks, mX + 14, blockY + 38);

  // Totals — right-aligned like the original PDF
  let ty = blockY + 20;
  const labelX = totalsX + 8;
  const valueX = pageW - mX;
  for (const row of totalRows) {
    if (row.kind === 'total') {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.7);
      doc.line(labelX, ty - 8, valueX, ty - 8);
      ty += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(row.label, labelX, ty);
      doc.setFontSize(13);
      doc.text(row.value, valueX, ty, { align: 'right' });
      ty += 22;
    } else if (row.kind === 'paid') {
      doc.setFillColor(16, 185, 129);
      doc.circle(labelX + 3.5, ty - 2.5, 3.2, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1.05);
      doc.line(labelX + 2, ty - 2.5, labelX + 3.2, ty - 1.1);
      doc.line(labelX + 3.2, ty - 1.1, labelX + 5.6, ty - 3.8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(16, 185, 129);
      doc.text(row.label, labelX + 12, ty);
      doc.setFontSize(10.5);
      doc.text(row.value, valueX, ty, { align: 'right' });
      ty += 17;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(row.label, labelX, ty);
      if (row.kind === 'green') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
      } else if (row.kind === 'gst') {
        doc.setTextColor(148, 163, 184);
      } else {
        doc.setTextColor(17, 24, 39);
      }
      doc.text(row.value, valueX, ty, { align: 'right' });
      ty += 17;
    }
  }

  // ── Footer ──────────────────────────────────────────────────────────────
  const footerY = pageH - 24;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.75);
  doc.line(mX, footerY - 12, pageW - mX, footerY - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `ODI Studio Kids Store   ·   ${supportEmail}   ·   ${website}`,
    pageW / 2,
    footerY,
    { align: 'center' },
  );

  const safeName = order.order_number.replace(/[^\w.-]+/g, '_');
  doc.save(`ODI-Invoice-${safeName}.pdf`);
}
