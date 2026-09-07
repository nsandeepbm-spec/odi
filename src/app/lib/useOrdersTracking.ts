import { useEffect, useMemo, useState } from 'react';
import { getMyOrderTracking, type ShipmentTracking, type UserOrder } from './api';

/** Fetch Delhivery tracking for orders that have a waybill. */
export function useOrdersTracking(orders: UserOrder[]) {
  const [trackingMap, setTrackingMap] = useState<Record<string, ShipmentTracking>>({});
  const [loading, setLoading] = useState(false);

  const waybillIds = useMemo(
    () =>
      orders
        .filter((o) => typeof o.delhivery_waybill === 'string' && o.delhivery_waybill.trim())
        .map((o) => o.id),
    [orders]
  );

  const idsKey = waybillIds.join(',');

  useEffect(() => {
    if (!idsKey) {
      setTrackingMap({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    void Promise.all(
      waybillIds.map((id) =>
        getMyOrderTracking(id)
          .then((tracking) => ({ id, tracking }))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, ShipmentTracking> = {};
      for (const row of results) {
        if (row) next[row.id] = row.tracking;
      }
      setTrackingMap(next);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, waybillIds]);

  return { trackingMap, trackingLoading: loading };
}
