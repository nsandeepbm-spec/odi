/** Same rules as the backend Delhivery → order stage map. */

export type DeliveryStage = 'processing' | 'shipped' | 'delivered';

export function deliveryStageFromDelhivery(input: {
  status?: string | null;
  statusType?: string | null;
}): DeliveryStage | null {
  const type = (input.statusType ?? '').trim().toUpperCase();
  const status = (input.status ?? '').trim().toLowerCase();
  if (!type && !status) return null;

  if (type === 'DL' || status === 'delivered' || /\bdelivered\b/.test(status)) {
    return 'delivered';
  }

  if (
    type === 'PU' ||
    status.includes('in transit') ||
    status.includes('dispatched') ||
    status.includes('out for delivery') ||
    status.includes('picked up') ||
    status === 'pickedup'
  ) {
    return 'shipped';
  }

  if (
    type === 'PP' ||
    type === 'UD' ||
    status.includes('manifest') ||
    status.includes('pickup') ||
    status.includes('not picked') ||
    status === 'pending'
  ) {
    return 'processing';
  }

  return null;
}

export function isDeliveredShipment(order: {
  status?: string | null;
  delhivery_status?: string | null;
}): boolean {
  if (order.status === 'delivered') return true;
  return deliveryStageFromDelhivery({ status: order.delhivery_status }) === 'delivered';
}
