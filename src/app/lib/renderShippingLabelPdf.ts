/**
 * Delhivery shipping label — custom render from packing-slip JSON.
 *
 * Docs: https://one.delhivery.com/developer-portal/document/b2c/detail/generate-shipping-label
 *
 * Official sizes:
 *   - pdf_size=4R → 4×6″ thermal (this renderer’s only page size)
 *   - pdf_size=A4 → 8×11″ (Delhivery default when pdf=true)
 *
 * We use pdf=false JSON + CODE128 (docs: “rendered into HTML using encoding 128”)
 * because Delhivery’s S3 PDF (pdf=true) overlaps return address on the order barcode.
 */
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import type { AdminPackingSlip } from './api';

/** Delhivery docs: only `4R` (4×6) and `A4` (8×11). We print thermal 4R. */
export type DelhiveryLabelPdfSize = '4R';

/** 4R = 4 inch × 6 inch (Delhivery Generate Shipping Label). */
const PAGE_W = 4;
const PAGE_H = 6;
const M = 0.08;
const LINE = 0.01;

function money(paise: number | null | undefined): string {
  const rupees = (Number(paise) || 0) / 100;
  return `Rs ${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function slipRaw(slip: AdminPackingSlip): Record<string, unknown> | null {
  return asRecord(slip.delhiveryPackage?.raw) ?? asRecord(slip.delhiveryRaw);
}

/** CODE128 barcode as PNG; `heightIn` is the drawn height in inches. */
function drawBarcode(
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  heightIn: number,
): number {
  const code = value.trim();
  if (!code) return y;

  const canvas = document.createElement('canvas');
  JsBarcode(canvas, code, {
    format: 'CODE128',
    width: 2,
    height: Math.round(heightIn * 96),
    displayValue: false,
    margin: 0,
    background: '#ffffff',
    lineColor: '#000000',
  });

  const aspect = canvas.width / Math.max(1, canvas.height);
  let drawW = maxWidth;
  let drawH = heightIn;
  if (drawW / drawH > aspect) {
    drawW = drawH * aspect;
  } else {
    drawH = drawW / aspect;
  }
  const drawX = x + (maxWidth - drawW) / 2;
  doc.addImage(canvas.toDataURL('image/png'), 'PNG', drawX, y, drawW, drawH);
  return y + drawH;
}

function box(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setDrawColor(0);
  doc.setLineWidth(LINE);
  doc.rect(x, y, w, h);
}

function wrap(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  maxLines?: number,
): number {
  const lines = (doc.splitTextToSize(text, maxW) as string[]).slice(0, maxLines ?? 99);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

function clientName(slip: AdminPackingSlip): string {
  const raw = slipRaw(slip);
  return (typeof raw?.cl === 'string' && raw.cl.trim()) || slip.seller.name || 'ODI';
}

function paymentInfo(slip: AdminPackingSlip): { mode: string; amount: string } {
  const raw = slipRaw(slip);
  const pt = (typeof raw?.pt === 'string' ? raw.pt : slip.payment ?? '').toUpperCase();
  const isCod = pt.includes('COD');
  const rupees =
    typeof raw?.cod === 'number'
      ? raw.cod
      : typeof raw?.cod === 'string' && raw.cod.trim()
        ? Number(raw.cod)
        : (slip.codAmountPaise ?? slip.totalPaise) / 100;
  return {
    mode: isCod ? 'COD' : 'Prepaid',
    amount: money(Math.round(rupees * 100)),
  };
}

function returnAddressLine(slip: AdminPackingSlip): string {
  const raw = slipRaw(slip);
  const street =
    (typeof raw?.radd === 'string' && raw.radd.trim()) ||
    slip.seller.address?.split(',')[0]?.trim() ||
    slip.seller.address ||
    'ODI';
  const city =
    (typeof raw?.rcty === 'string' && raw.rcty.trim()) || slip.seller.city || '';
  const state =
    (typeof raw?.rst === 'string' && raw.rst.trim()) || slip.seller.state || '';
  const pin = raw?.rpin != null ? String(raw.rpin) : slip.seller.pin || '';
  const parts = [street, city, state, pin].filter(Boolean);
  return `Return Address: ${parts.join(', ')}`;
}

/**
 * Single standard Delhivery label: 4R (4×6″).
 * Layout follows Delhivery packing-slip sample; footer = barcode then return text below (never beside).
 */
export function renderShippingLabelPdf(
  slip: AdminPackingSlip,
  _pdfSize: DelhiveryLabelPdfSize = '4R',
): Blob {
  const doc = new jsPDF({ unit: 'in', format: [PAGE_W, PAGE_H], orientation: 'portrait' });
  const raw = slipRaw(slip);
  const x0 = M;
  const innerW = PAGE_W - M * 2;
  let y = M;

  doc.setDrawColor(0);
  doc.setTextColor(0);
  box(doc, 0, 0, PAGE_W, PAGE_H);

  // —— Header ——
  const headerH = 0.28;
  box(doc, x0, y, innerW, headerH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(clientName(slip), x0 + 0.06, y + 0.18);
  doc.setTextColor(200, 16, 46);
  doc.setFontSize(10);
  doc.text('DELHIVERY', x0 + innerW - 0.06, y + 0.18, { align: 'right' });
  doc.setTextColor(0);
  y += headerH;

  // —— Waybill CODE128 ——
  const waybillH = 0.85;
  box(doc, x0, y, innerW, waybillH);
  const pin =
    raw?.pin != null ? String(raw.pin) : slip.consignee.pin ? String(slip.consignee.pin) : '';
  if (pin) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(pin, x0 + 0.05, y + 0.14);
    doc.setTextColor(0);
  }
  const wbTop = y + 0.08;
  const wbBottom = drawBarcode(doc, slip.waybill, x0 + 0.2, wbTop, innerW - 0.4, 0.48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(slip.waybill, x0 + innerW / 2, Math.min(wbBottom + 0.12, y + waybillH - 0.06), {
    align: 'center',
  });
  y += waybillH;

  // —— Shipping address | payment ——
  const shipH = 0.95;
  const payW = 0.9;
  const addrW = innerW - payW;
  box(doc, x0, y, addrW, shipH);
  box(doc, x0 + addrW, y, payW, shipH);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Shipping Address:', x0 + 0.05, y + 0.12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let ay = y + 0.26;
  doc.setFont('helvetica', 'bold');
  doc.text((slip.consignee.name || 'Customer').toUpperCase(), x0 + 0.05, ay);
  ay += 0.12;
  doc.setFont('helvetica', 'normal');
  if (slip.consignee.phone) {
    doc.text(String(slip.consignee.phone), x0 + 0.05, ay);
    ay += 0.12;
  }
  const dest =
    typeof raw?.destination === 'string' && raw.destination.trim()
      ? raw.destination
      : [slip.consignee.address, slip.consignee.city, slip.consignee.state]
          .filter(Boolean)
          .join(', ');
  ay = wrap(doc, dest, x0 + 0.05, ay, addrW - 0.1, 0.11, 3);
  doc.text(`PIN: ${slip.consignee.pin || ''}`, x0 + 0.05, Math.min(ay + 0.02, y + shipH - 0.06));

  const pay = paymentInfo(slip);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(pay.mode, x0 + addrW + payW / 2, y + 0.32, { align: 'center' });
  doc.setFontSize(9);
  doc.text(pay.amount, x0 + addrW + payW / 2, y + 0.55, { align: 'center' });
  y += shipH;

  // —— Seller ——
  const sellerH = 0.2;
  box(doc, x0, y, innerW, sellerH);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const sellerLine = `Seller: ${slip.seller.name || 'ODI'}   Address: ${slip.seller.address || ''}`;
  doc.text(sellerLine.slice(0, 90), x0 + 0.05, y + 0.13);
  y += sellerH;

  // —— Products ——
  const items =
    slip.items.length > 0
      ? slip.items.map((i) => ({
          name: i.snapshot_name,
          price: i.unit_price_paise,
          total: i.line_total_paise ?? i.unit_price_paise * i.quantity,
        }))
      : [
          {
            name: slip.productsDesc || 'Item',
            price: slip.totalPaise,
            total: slip.totalPaise,
          },
        ];

  const rowH = 0.16;
  const tableH = 0.2 + rowH * (Math.min(items.length, 4) + 1);
  box(doc, x0, y, innerW, tableH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Product', x0 + 0.05, y + 0.13);
  doc.text('Price', x0 + innerW * 0.58, y + 0.13);
  doc.text('Total', x0 + innerW * 0.78, y + 0.13);
  doc.line(x0, y + 0.17, x0 + innerW, y + 0.17);
  doc.setFont('helvetica', 'normal');
  let ty = y + 0.3;
  for (const item of items.slice(0, 4)) {
    doc.text(item.name.slice(0, 26), x0 + 0.05, ty);
    doc.text(money(item.price), x0 + innerW * 0.58, ty);
    doc.text(money(item.total), x0 + innerW * 0.78, ty);
    ty += rowH;
  }
  doc.setFont('helvetica', 'bold');
  doc.text('Total', x0 + 0.05, ty);
  doc.text(money(slip.totalPaise), x0 + innerW * 0.78, ty);
  y += tableH;

  // —— Footer: order CODE128, then return address UNDER it (never beside) ——
  const footerTop = y;
  const footerH = PAGE_H - M - footerTop;
  box(doc, x0, footerTop, innerW, footerH);

  const orderId = slip.orderNumber || '';
  let fy = footerTop + 0.08;
  fy = drawBarcode(doc, orderId, x0 + 0.35, fy, innerW - 0.7, 0.35);
  fy += 0.1;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(orderId, x0 + innerW / 2, fy, { align: 'center' });
  fy += 0.16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  wrap(doc, returnAddressLine(slip), x0 + 0.05, fy, innerW - 0.1, 0.1, 3);

  return doc.output('blob');
}
