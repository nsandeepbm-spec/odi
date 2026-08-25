import React, { useEffect } from 'react';
import { Loader2, RefreshCw, X, MapPin } from 'lucide-react';
import type { ShipmentTracking } from '../../lib/api';
import { friendlyCourierStatus, trackingIsDelivered } from '../../lib/shipmentStatus';
import { buildRouteSteps, ShipmentRouteTimeline } from './ShipmentRouteTimeline';
import {
  ShipmentMilestoneTimeline,
  type MilestoneOrder,
} from './ShipmentMilestoneTimeline';
import { ODILoader } from '../ODILoader';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  tracking: ShipmentTracking | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  orderNumber?: string;
  /** When set, shows Flipkart-style milestone timeline (preferred). */
  order?: MilestoneOrder | null;
  deliveryAddress?: string | null;
  /** Admin sees raw Delhivery scan labels; customers see friendly copy. */
  adminView?: boolean;
  /** Customer-friendly labels when using legacy flat route timeline. */
  userFacing?: boolean;
};

/** Right drawer — milestone tracking + background scroll lock. */
export function ShipmentTrackingDrawer({
  open,
  onClose,
  tracking,
  loading,
  error,
  onRefresh,
  orderNumber,
  order,
  deliveryAddress,
  adminView,
  userFacing,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

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
      const drawer = document.getElementById('admin-shipment-tracking-drawer');
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
  }, [open]);

  if (!open) return null;

  const headline = tracking?.status
    ? adminView
      ? tracking.status
      : friendlyCourierStatus(tracking.status)
    : null;

  return (
    <>
      <button
        type="button"
        aria-label="Close tracking"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        id="admin-shipment-tracking-drawer"
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipment-tracking-title"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#0d0d0d]">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
              Track order
            </p>
            <h2 id="shipment-tracking-title" className="text-lg font-black text-white truncate">
              {orderNumber ?? 'Order'}
            </h2>
            {headline && <p className="text-xs text-neutral-400 mt-1">{headline}</p>}
            {tracking?.statusLocation && (
              <p className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                {tracking.statusLocation}
              </p>
            )}
            {tracking?.waybill && (
              <p className="text-xs font-mono text-cyan-400 mt-1">{tracking.waybill}</p>
            )}
            {loading && (
              <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating…
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                aria-label="Refresh tracking"
              >
                {loading ? (
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

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {loading && !tracking && !order ? (
            <ODILoader size="sm" label="Loading route…" className="py-10" />
          ) : error && !tracking && !order ? (
            <p className="text-sm text-amber-400 py-4">{error}</p>
          ) : order ? (
            <>
              {error && <p className="text-xs text-amber-400 mb-4">{error}</p>}
              <ShipmentMilestoneTimeline
                order={order}
                tracking={tracking}
                deliveryAddress={deliveryAddress}
                adminView={adminView}
              />
            </>
          ) : tracking ? (
            <ShipmentRouteTimeline tracking={tracking} userFacing={userFacing} />
          ) : (
            <p className="text-sm text-neutral-500 py-4">No tracking data yet.</p>
          )}
        </div>

        <div className="p-5 border-t border-white/[0.06] bg-[#0d0d0d]">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-white/10 text-white hover:bg-white/5"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

type SummaryProps = {
  tracking: ShipmentTracking | null;
  loading?: boolean;
  error?: string | null;
  onViewDetails: () => void;
  onRefresh?: () => void;
  userFacing?: boolean;
};

/** Compact sidebar block — below order total on admin order detail. */
export function ShipmentTrackingSummary({
  tracking,
  loading,
  error,
  onViewDetails,
  onRefresh,
  userFacing,
}: SummaryProps) {
  const delivered = trackingIsDelivered(tracking);
  const steps = buildRouteSteps(tracking, userFacing);
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
          Shipment tracking
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-1 rounded-md text-neutral-500 hover:text-white disabled:opacity-50"
            aria-label="Refresh"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {loading && !tracking ? (
        <ODILoader size="sm" label="Loading…" className="py-3" />
      ) : error ? (
        <p className="text-xs text-amber-400 mb-3">{error}</p>
      ) : tracking ? (
        <>
          <p
            className={`text-sm font-black mb-1 ${delivered ? 'text-emerald-400' : 'text-white'}`}
          >
            {userFacing
              ? friendlyCourierStatus(tracking.status)
              : (tracking.status ?? 'In progress')}
          </p>
          {tracking.origin && tracking.destination && (
            <p className="text-[11px] text-neutral-500 leading-snug mb-2">
              <span className="text-emerald-500/90">{tracking.origin.split(' ')[0]}</span>
              <span className="text-neutral-600 mx-1">→</span>
              <span className={delivered ? 'text-emerald-400' : 'text-neutral-400'}>
                {tracking.destination.split(' ')[0]}
              </span>
            </p>
          )}
          {tracking.waybill && (
            <p className="text-[10px] font-mono text-cyan-400/80 mb-3">{tracking.waybill}</p>
          )}
          {steps.length > 0 && (
            <p className="text-[10px] text-neutral-500 mb-3">
              {completedCount} of {steps.length} steps completed
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-neutral-500 mb-3">Tracking will appear once the shipment is live.</p>
      )}

      <button
        type="button"
        onClick={onViewDetails}
        disabled={!tracking && !loading && !!error}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-40"
      >
        View details
      </button>
    </div>
  );
}
