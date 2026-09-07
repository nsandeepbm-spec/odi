/** Delhivery One / tracking links for admin fulfillment UI. */

export function delhiveryTrackUrl(waybill: string): string {
  return `https://www.delhivery.com/track/package/${encodeURIComponent(waybill.trim())}`;
}

/** Delhivery One portal — official label PDF print (same as courier dashboard). */
export function delhiveryOnePortalUrl(): string {
  return 'https://one.delhivery.com';
}

export function delhiveryOneReadyForPickupUrl(): string {
  return 'https://one.delhivery.com/shipments/forward/ready-for-pickup';
}
