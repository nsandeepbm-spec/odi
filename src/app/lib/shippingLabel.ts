export type { DelhiveryLabelPdfSize } from './renderShippingLabelPdf';
export { renderShippingLabelPdf } from './renderShippingLabelPdf';

import { getAdminPackingSlip } from './api';
import { renderShippingLabelPdf } from './renderShippingLabelPdf';
import type { AdminOrder } from './api';

/**
 * Download Delhivery shipping label at standard **4R (4×6″)**.
 * Uses packing-slip JSON + CODE128 render (docs: pdf=false custom label path).
 * @see https://one.delhivery.com/developer-portal/document/b2c/detail/generate-shipping-label
 */
export async function downloadShippingLabelForOrder(
  orderId: string,
  order?: Pick<AdminOrder, 'delhivery_waybill' | 'order_number'> | null,
) {
  const slip = await getAdminPackingSlip(orderId);
  const blob = renderShippingLabelPdf(slip, '4R');

  const waybill =
    order?.delhivery_waybill?.trim() || slip.waybill || order?.order_number || orderId.slice(0, 8);
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `Delhivery-Label-4R-${waybill}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadShippingLabel(order: AdminOrder) {
  if (!order.delhivery_waybill?.trim()) {
    throw new Error('No waybill yet — create the shipment first');
  }
  await downloadShippingLabelForOrder(order.id, order);
}
