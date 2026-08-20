import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAdminStoreSettings } from './adminSettings';
import type { AdminOrderDetail } from './api';

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

function humanPaymentMethod(provider: string): string {
  const p = (provider ?? '').toLowerCase();
  if (p === 'razorpay') return 'Online Payment (UPI / Card / Net Banking)';
  if (p === 'cod') return 'Cash on Delivery';
  if (p === 'stripe') return 'Online Payment (Card)';
  return provider || 'Online Payment';
}

function humanPaymentStatus(status: string): string {
  const s = (status ?? '').toLowerCase();
  if (s === 'captured' || s === 'paid' || s === 'authorized') return 'Payment confirmed';
  if (s === 'created' || s === 'pending') return 'Awaiting payment';
  if (s === 'refunded') return 'Refunded';
  if (s === 'failed') return 'Payment failed';
  return status;
}

function humanOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Order placed — awaiting payment',
    paid: 'Paid',
    processing: 'Processing your order',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return map[status] ?? status.replace(/_/g, ' ');
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
  }>;
  user?: {
    full_name?: string | null;
    email?: string;
    phone?: string | null;
  } | null;
};

export function downloadOrderInvoice(detail: InvoiceDetail | AdminOrderDetail) {
  const settings = getAdminStoreSettings();
  const supportEmail = settings.supportEmail || 'odistudio24@gmail.com';
  const storeName    = settings.storeName    || 'ODI Kids Store';

  const { order, items, payments, user } = detail;
  const addr = order.shipping_address;

  const customerName =
    [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') ||
    user?.full_name || user?.email || 'Customer';
  const customerEmail = addr?.email || user?.email || '';
  const customerPhone = addr?.phone || (user?.phone ? String(user.phone) : '') || '';
  const addrLine = [addr?.street, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean).join(', ');

  const payment = payments[0];
  const isPaid  = ['captured', 'paid', 'authorized'].includes((payment?.status || '').toLowerCase())
    || ['paid', 'delivered', 'shipped', 'processing'].includes(order.status);

  const doc   = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const mX    = 52;
  const contentW = pageW - mX * 2;

  // ─── TOP HEADER BAND ────────────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 96, 'F');

  // Cyan–indigo stripe
  doc.setFillColor(8, 145, 178);
  doc.rect(0, 96, pageW * 0.5, 5, 'F');
  doc.setFillColor(79, 70, 229);
  doc.rect(pageW * 0.5, 96, pageW * 0.5, 5, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('ODI', mX, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(165, 243, 252);
  doc.text(storeName.toUpperCase(), mX, 60);

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.text(supportEmail, mX, 76);

  // Invoice label + number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(163, 163, 163);
  doc.text('INVOICE', pageW - mX, 34, { align: 'right' });

  doc.setFontSize(14);
  doc.setTextColor(34, 211, 238);
  doc.text(order.order_number, pageW - mX, 52, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(formatDate(order.created_at), pageW - mX, 68, { align: 'right' });

  // ─── STATUS BADGE ───────────────────────────────────────────────────────
  const badgeText = humanOrderStatus(order.status).toUpperCase();
  const badgeW    = doc.getStringUnitWidth(badgeText) * 9 + 24;
  const badgeX    = pageW - mX - badgeW;

  doc.setFillColor(isPaid ? 16 : 120, isPaid ? 185 : 100, isPaid ? 129 : 60, isPaid ? 0.15 : 0.15);
  doc.roundedRect(badgeX, 75, badgeW, 16, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(isPaid ? 34 : 180, isPaid ? 197 : 140, isPaid ? 94 : 60);
  doc.text(badgeText, badgeX + 12, 86);

  // ─── BILL TO / PAYMENT CARDS ────────────────────────────────────────────
  let y = 120;
  const colW = (contentW - 20) / 2;

  // Card backgrounds
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.roundedRect(mX,          y, colW, 110, 7, 7, 'FD');
  doc.roundedRect(mX + colW + 20, y, colW, 110, 7, 7, 'FD');

  // Bill to
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('BILL TO', mX + 14, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(customerName, mX + 14, y + 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let cy = y + 54;
  if (customerEmail) { doc.text(customerEmail, mX + 14, cy); cy += 14; }
  if (customerPhone) { doc.text(String(customerPhone), mX + 14, cy); cy += 14; }
  if (addrLine) {
    const wrapped = doc.splitTextToSize(addrLine, colW - 28);
    doc.text(wrapped, mX + 14, cy);
  }

  // Payment details — human-readable only
  const rx = mX + colW + 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PAYMENT DETAILS', rx + 14, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(
    payment ? humanPaymentMethod(payment.provider) : 'Online Payment',
    rx + 14, y + 38
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const statusLabel = humanPaymentStatus(payment?.status || '');
  doc.setTextColor(isPaid ? 16 : 100, isPaid ? 185 : 100, isPaid ? 129 : 100);
  doc.text(statusLabel, rx + 14, y + 54);

  doc.setTextColor(100, 116, 139);
  doc.text(`Mode: ${isPaid ? 'Prepaid' : 'Pending'}`, rx + 14, y + 70);

  y += 130;

  // ─── ITEMS TABLE ────────────────────────────────────────────────────────
  const tableRows = items.map((item) => {
    const lineTotal = item.line_total_paise ?? item.unit_price_paise * item.quantity;
    return [
      item.snapshot_name,
      '1 kit',
      String(item.quantity),
      pdfMoney(item.unit_price_paise),
      pdfMoney(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Type', 'Qty', 'Unit Price', 'Amount']],
    body: tableRows.length ? tableRows : [['No items', '', '', '', '']],
    theme: 'grid',
    margin: { left: mX, right: mX },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: [23, 23, 23],
      cellPadding: { top: 10, bottom: 10, left: 10, right: 10 },
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: { top: 11, bottom: 11, left: 10, right: 10 },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 70, textColor: [100, 116, 139] },
      2: { halign: 'center', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 90 },
      4: { halign: 'right', cellWidth: 90, fontStyle: 'bold' },
    },
  });

  // ─── TOTALS BOX ─────────────────────────────────────────────────────────
  type TotalLine = { label: string; value: string; highlight?: boolean; deduct?: boolean };
  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 40;

  const totalLines: TotalLine[] = [
    { label: 'Subtotal', value: pdfMoney(order.subtotal_paise) },
  ];
  if (order.discount_paise > 0) {
    totalLines.push({
      label: order.coupon_code ? `Promo discount (${order.coupon_code})` : 'Discount',
      value: pdfMoney(order.discount_paise),
      deduct: true,
    });
  }
  totalLines.push({
    label: 'Shipping',
    value: (order.shipping_paise ?? 0) > 0 ? pdfMoney(order.shipping_paise ?? 0) : 'FREE',
  });
  totalLines.push({ label: 'Total Amount Paid', value: pdfMoney(order.total_paise), highlight: true });

  const boxW = 240;
  const boxX = pageW - mX - boxW;
  let boxY   = finalY + 24;
  const rowH = 24;
  const boxH = totalLines.length * rowH + 20;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(boxX, boxY, boxW, boxH, 7, 7, 'FD');

  let rowY = boxY + 20;
  for (const line of totalLines) {
    if (line.highlight) {
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(boxX + 8, rowY - 14, boxW - 16, 26, 5, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(line.label, boxX + 18, rowY + 4);
      doc.setTextColor(34, 211, 238);
      doc.text(line.value, boxX + boxW - 18, rowY + 4, { align: 'right' });
    } else {
      doc.setFont('helvetica', line.deduct ? 'italic' : 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(line.label, boxX + 18, rowY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(line.deduct ? 22 : 15, line.deduct ? 163 : 23, line.deduct ? 74 : 42);
      doc.text(line.deduct ? `- ${line.value}` : line.value, boxX + boxW - 18, rowY, { align: 'right' });
    }
    rowY += rowH;
  }

  // ─── NOTE UNDER TOTALS ──────────────────────────────────────────────────
  const noteY = boxY + boxH + 14;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('This is a computer-generated invoice and does not require a signature.', mX, noteY);

  // ─── FOOTER ─────────────────────────────────────────────────────────────
  const footerY = pageH - 44;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(mX, footerY - 16, pageW - mX, footerY - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Questions about your order? Contact us at ${supportEmail}`,
    mX, footerY
  );
  doc.setTextColor(8, 145, 178);
  doc.text('ODI - Spatial Media & Kids Learning Kits', pageW - mX, footerY, { align: 'right' });

  const safeName = order.order_number.replace(/[^\w.-]+/g, '_');
  doc.save(`ODI-Invoice-${safeName}.pdf`);
}
