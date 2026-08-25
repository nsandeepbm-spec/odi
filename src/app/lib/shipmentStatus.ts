import type { ShipmentTracking, UserOrder, UserOrderStatus } from './api';

/** Canonical shipment phase — single source of truth for chip, stepper, and route. */
export type ShipmentPhase =
  | 'confirmed'
  | 'preparing'
  | 'ready_to_ship'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

/** Customer-facing copy — never show raw Delhivery terms like "Manifested". */
export function friendlyCourierStatus(raw: string | null | undefined): string {
  if (!raw?.trim()) return 'Updating delivery status';
  const s = raw.toLowerCase();

  if (s.includes('deliver') && !s.includes('out for')) return 'Delivered';
  if (s.includes('out for delivery')) return 'Out for delivery';
  if (s.includes('in transit') || s === 'in-transit') return 'In transit';
  if (s.includes('dispatched')) return 'On the way';
  if (s.includes('picked') || s.includes('pick up')) return 'Picked up by courier';
  if (s.includes('pickup') && s.includes('schedul')) return 'Pickup scheduled';
  if (s.includes('manifest')) return 'Getting ready to ship';
  if (s.includes('pending')) return 'Processing at warehouse';
  if (s.includes('rto')) return 'Return in progress';

  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function friendlyOrderStatus(status: UserOrderStatus): string {
  switch (status) {
    case 'paid':
      return 'Order confirmed';
    case 'processing':
      return 'Preparing your order';
    case 'shipped':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    case 'pending':
      return 'Awaiting payment';
    case 'cancelled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    default:
      return status;
  }
}

export function trackingIsDelivered(tracking: ShipmentTracking | null | undefined): boolean {
  if (!tracking?.status) return false;
  const s = tracking.status.toLowerCase();
  return s.includes('deliver') && !s.includes('out for');
}

export function trackingIsOutForDelivery(tracking: ShipmentTracking | null | undefined): boolean {
  if (!tracking?.status) return false;
  return tracking.status.toLowerCase().includes('out for');
}

export function trackingIsInTransit(tracking: ShipmentTracking | null | undefined): boolean {
  if (!tracking?.status) return false;
  const s = tracking.status.toLowerCase();
  return (
    s.includes('transit') ||
    s.includes('dispatched') ||
    s.includes('out for') ||
    s.includes('picked')
  );
}

/** Delhivery pre-pickup statuses — waybill exists but parcel not moving yet. */
export function isPreShipmentStatus(raw: string | null | undefined): boolean {
  if (!raw?.trim()) return true;
  const s = raw.toLowerCase();
  return (
    s.includes('manifest') ||
    s.includes('pending') ||
    (s.includes('pickup') && s.includes('schedul'))
  );
}

export function trackingIsPreShipment(tracking: ShipmentTracking | null | undefined): boolean {
  return isPreShipmentStatus(tracking?.status);
}

type OrderForPhase = Pick<UserOrder, 'status' | 'delhivery_waybill' | 'delhivery_status'>;

function phaseFromCourierText(raw: string | null | undefined): ShipmentPhase | null {
  if (!raw?.trim()) return null;
  const fake = { status: raw } as ShipmentTracking;
  if (trackingIsDelivered(fake)) return 'delivered';
  if (trackingIsOutForDelivery(fake)) return 'out_for_delivery';
  if (trackingIsInTransit(fake)) return 'in_transit';
  if (isPreShipmentStatus(raw)) return 'ready_to_ship';
  return null;
}

/** Delhivery scans are newest-first — prefer latest scan, then top-level Status. */
function phaseFromTracking(tracking?: ShipmentTracking | null): ShipmentPhase | null {
  if (!tracking) return null;

  const newestScan = tracking.scans?.[0]?.scan;
  if (newestScan) {
    const fromNewest = phaseFromCourierText(newestScan);
    if (fromNewest) return fromNewest;
  }

  return phaseFromCourierText(tracking.status);
}

/**
 * Merge app order status + live Delhivery tracking into one phase.
 *
 * Note: `order.status === 'shipped'` is set when pickup is *scheduled*, not necessarily in transit.
 * Live Delhivery scans/status take priority when a waybill exists.
 */
export function resolveShipmentPhase(
  order: OrderForPhase,
  tracking?: ShipmentTracking | null,
): ShipmentPhase {
  if (order.status === 'delivered' || trackingIsDelivered(tracking)) return 'delivered';

  const fromLive = phaseFromTracking(tracking);
  if (fromLive === 'delivered' || fromLive === 'out_for_delivery' || fromLive === 'in_transit') {
    return fromLive;
  }

  const courierStatus = tracking?.status ?? order.delhivery_status ?? null;
  if (courierStatus && !isPreShipmentStatus(courierStatus)) return 'in_transit';

  const hasWaybill = Boolean(order.delhivery_waybill?.trim());
  if (hasWaybill || courierStatus || fromLive === 'ready_to_ship') return 'ready_to_ship';

  if (order.status === 'processing') return 'preparing';
  if (order.status === 'shipped') return 'ready_to_ship';
  if (order.status === 'paid') return 'confirmed';
  return 'confirmed';
}

export function headlineShipmentStatus(
  order: OrderForPhase,
  tracking?: ShipmentTracking | null,
): string {
  const phase = resolveShipmentPhase(order, tracking);

  switch (phase) {
    case 'delivered':
      return 'Delivered';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'in_transit':
      return tracking?.status ? friendlyCourierStatus(tracking.status) : 'On the way';
    case 'ready_to_ship':
      if (tracking?.status) return friendlyCourierStatus(tracking.status);
      if (order.delhivery_status) return friendlyCourierStatus(order.delhivery_status);
      return 'Getting ready to ship';
    case 'preparing':
      return 'Preparing your order';
    case 'confirmed':
      return 'Order confirmed';
  }
}

/** 0=Confirmed … 3=Delivered for the 4-step progress UI. */
export function shipmentProgressStep(
  order: OrderForPhase,
  tracking?: ShipmentTracking | null,
): number {
  const phase = resolveShipmentPhase(order, tracking);
  switch (phase) {
    case 'delivered':
      return 3;
    case 'in_transit':
    case 'out_for_delivery':
      return 2;
    case 'ready_to_ship':
      return order.status === 'shipped' ? 2 : 1;
    case 'preparing':
      return 1;
    case 'confirmed':
      return 0;
  }
}

export function isInTransitPhase(phase: ShipmentPhase): boolean {
  return phase === 'in_transit' || phase === 'out_for_delivery';
}

export const SHIPMENT_PROGRESS_STEPS = [
  { key: 'paid', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
] as const;

function shortPlace(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const beforeParen = trimmed.split('(')[0].trim();
  const token = beforeParen.split(/[_\s]/)[0];
  if (token && token.length > 2) {
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  }
  return beforeParen.slice(0, 32);
}

/** e.g. "Punjab – 160074" for bookings / overview. */
export function deliveryLocationLine(
  order: Pick<UserOrder, 'shipping_address'>,
  tracking?: ShipmentTracking | null,
): string | null {
  const addr = order.shipping_address;
  const pin = addr?.postal_code?.trim();
  const city = addr?.city?.trim();

  if (tracking?.statusLocation) {
    const place = shortPlace(tracking.statusLocation);
    if (place && pin) return `${place} – ${pin}`;
    if (place) return place;
  }

  if (tracking?.destination) {
    const dest = shortPlace(tracking.destination);
    if (dest && pin) return `${dest} – ${pin}`;
    if (dest) return dest;
  }

  if (city && pin) return `${city} – ${pin}`;
  if (city) return city;
  return pin ?? null;
}

export function friendlyScanLabel(scan: string): string {
  return friendlyCourierStatus(scan);
}

export function friendlyRouteStepTitle(
  kind: 'origin' | 'destination' | 'scan',
  raw: string,
  delivered?: boolean,
): string {
  if (kind === 'origin') return 'Shipped from';
  if (kind === 'destination') return delivered ? 'Delivered to you' : 'Delivering to you';
  return friendlyScanLabel(raw);
}
