import React from 'react';
import { Loader2, MapPin, PackageSearch, RefreshCw } from 'lucide-react';
import type { ShipmentTracking } from '../../lib/api';

function formatScanTime(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  tracking: ShipmentTracking | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  /** Compact card chrome for sidebars */
  compact?: boolean;
};

/**
 * Responsive Delhivery scan timeline — shared by user + admin order detail.
 */
export function ShipmentTrackingPanel({
  tracking,
  loading,
  error,
  onRefresh,
  compact,
}: Props) {
  return (
    <div className={compact ? '' : 'bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 sm:p-5'}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 mb-1">
            Current status
          </p>
          {loading && !tracking ? (
            <p className="text-sm text-neutral-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading tracking…
            </p>
          ) : tracking?.status ? (
            <p className="text-lg sm:text-xl font-black text-white tracking-tight">{tracking.status}</p>
          ) : (
            <p className="text-sm text-neutral-400">No status yet</p>
          )}
          {tracking?.statusLocation && (
            <p className="text-xs text-neutral-500 mt-1 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
              <span>{tracking.statusLocation}</span>
            </p>
          )}
          {tracking?.instructions && (
            <p className="text-xs text-neutral-400 mt-1">{tracking.instructions}</p>
          )}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Refresh
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-amber-400 mb-3">{error}</p>
      )}

      {tracking && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 text-xs">
          {tracking.waybill && (
            <div className="rounded-xl bg-black/30 border border-white/[0.06] px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">AWB</p>
              <p className="font-mono font-bold text-cyan-400 break-all">{tracking.waybill}</p>
            </div>
          )}
          {tracking.expectedDeliveryDate && (
            <div className="rounded-xl bg-black/30 border border-white/[0.06] px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Expected delivery
              </p>
              <p className="font-medium text-neutral-200">{formatScanTime(tracking.expectedDeliveryDate)}</p>
            </div>
          )}
          {tracking.origin && (
            <div className="rounded-xl bg-black/30 border border-white/[0.06] px-3 py-2 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Route</p>
              <p className="font-medium text-neutral-200">
                {tracking.origin}
                {tracking.destination ? ` → ${tracking.destination}` : ''}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 mb-3">
        Scan history
      </p>

      {!tracking?.scans?.length ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <PackageSearch className="w-8 h-8 text-neutral-600" />
          <p className="text-sm text-neutral-500">
            {loading ? 'Fetching scans…' : 'No scan history yet. Try again after pickup.'}
          </p>
        </div>
      ) : (
        <ol className="relative space-y-0 border-l border-white/[0.08] ml-2 sm:ml-3">
          {tracking.scans.map((scan, idx) => (
            <li key={`${scan.scanDateTime ?? ''}-${scan.scan}-${idx}`} className="relative pl-5 sm:pl-6 pb-5 last:pb-0">
              <span
                className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                  idx === 0
                    ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.45)]'
                    : 'bg-[#0d0d0d] border-neutral-600'
                }`}
              />
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-3">
                  <p className="text-sm font-bold text-white">{scan.scan}</p>
                  <p className="text-[11px] text-neutral-500 shrink-0">
                    {formatScanTime(scan.scanDateTime)}
                  </p>
                </div>
                {scan.scannedLocation && (
                  <p className="text-xs text-neutral-400 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                    {scan.scannedLocation}
                  </p>
                )}
                {scan.instructions && (
                  <p className="text-xs text-neutral-500 mt-0.5">{scan.instructions}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
