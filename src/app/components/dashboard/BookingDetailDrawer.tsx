import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, RefreshCw, MapPin } from 'lucide-react';
import type { ShipmentTracking, UserOrder } from '../../lib/api';
import { getMyOrderTracking } from '../../lib/api';
import { headlineShipmentStatus } from '../../lib/shipmentStatus';
import { ShipmentMilestoneTimeline } from './ShipmentMilestoneTimeline';

function formatDeliveryAddress(order: UserOrder): string | null {
  const addr = order.shipping_address;
  if (!addr) return null;
  const name = [addr.first_name, addr.last_name].filter(Boolean).join(' ');
  const line = [addr.street, addr.city, addr.state, addr.postal_code].filter(Boolean).join(', ');
  if (name && line) return `${name} · ${line}`;
  return line || name || null;
}

type Props = {
  order: UserOrder;
  tracking?: ShipmentTracking | null;
  trackingLoading?: boolean;
  trackingError?: string | null;
  onClose: () => void;
  onTrackingUpdated?: (tracking: ShipmentTracking | null) => void;
};

/** Right drawer — Flipkart-style milestone tracking for bookings. */
export function BookingDetailDrawer({
  order,
  tracking: trackingProp,
  trackingLoading: trackingLoadingProp,
  trackingError: trackingErrorProp,
  onClose,
  onTrackingUpdated,
}: Props) {
  const [tracking, setTracking] = useState<ShipmentTracking | null>(trackingProp ?? null);
  const [trackingLoading, setTrackingLoading] = useState(trackingLoadingProp ?? false);
  const [trackingError, setTrackingError] = useState<string | null>(trackingErrorProp ?? null);

  const deliveryAddress = useMemo(() => formatDeliveryAddress(order), [order]);
  const headline = headlineShipmentStatus(order, tracking);

  useEffect(() => {
    setTracking(trackingProp ?? null);
    setTrackingLoading(trackingLoadingProp ?? false);
    setTrackingError(trackingErrorProp ?? null);
  }, [trackingProp, trackingLoadingProp, trackingErrorProp, order.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock page scroll while drawer is open (only the drawer content may scroll).
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    const preventBackgroundScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as Node | null;
      const drawer = document.getElementById('booking-detail-drawer');
      if (drawer && target && drawer.contains(target)) return;
      e.preventDefault();
    };

    window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
      window.removeEventListener('wheel', preventBackgroundScroll);
      window.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, []);

  const loadTracking = (silent = false) => {
    if (!order.delhivery_waybill) return;
    if (!silent || !tracking) {
      setTrackingLoading(true);
      setTrackingError(null);
    }
    getMyOrderTracking(order.id)
      .then((t) => {
        setTracking(t);
        onTrackingUpdated?.(t);
      })
      .catch((e) => {
        setTrackingError(e instanceof Error ? e.message : 'Could not load tracking');
      })
      .finally(() => setTrackingLoading(false));
  };

  useEffect(() => {
    if (order.delhivery_waybill && !trackingProp) {
      loadTracking(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once per order open
  }, [order.id, order.delhivery_waybill]);

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        id="booking-detail-drawer"
        className="fixed inset-y-0 right-0 z-[70] h-dvh w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-route-title"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-5 border-b border-white/[0.06] bg-[#0d0d0d] shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
              Track order
            </p>
            <h2 id="booking-route-title" className="text-lg font-black text-white truncate">
              {order.order_number}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">{headline}</p>
            {tracking?.statusLocation && (
              <p className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                {tracking.statusLocation}
              </p>
            )}
            {trackingLoading && (
              <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating…
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {order.delhivery_waybill && (
              <button
                type="button"
                onClick={() => loadTracking()}
                disabled={trackingLoading}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                aria-label="Refresh tracking"
              >
                {trackingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-6">
          {trackingError && (
            <p className="text-xs text-amber-400 mb-4">{trackingError}</p>
          )}
          <ShipmentMilestoneTimeline
            order={order}
            tracking={tracking}
            deliveryAddress={deliveryAddress}
          />
        </div>

        <div className="p-5 border-t border-white/[0.06] bg-[#0d0d0d] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-white/10 text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
}
