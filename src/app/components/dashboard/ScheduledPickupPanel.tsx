import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  X,
  FileDown,
  Loader2,
  ExternalLink,
  Truck,
  MapPin,
  Package,
  CalendarClock,
} from 'lucide-react';
import type { AdminPickupRow } from '../../lib/api';
import { getAdminOrderDetail } from '../../lib/api';
import { downloadShippingLabelForOrder } from '../../lib/shippingLabel';
import {
  delhiveryOnePortalUrl,
  delhiveryOneReadyForPickupUrl,
  delhiveryTrackUrl,
} from '../../lib/delhiveryLinks';
import { ODILoader } from '../ODILoader';
import { formatPickupScheduleBlock } from '../../lib/pickupSchedule';

type Props = {
  row: AdminPickupRow;
  onClose: () => void;
};

/**
 * Scheduled pickup detail — re-download shipping label + Delhivery One link.
 */
export function ScheduledPickupPanel({ row, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [shipStreet, setShipStreet] = useState<string | null>(null);
  const [shipPhone, setShipPhone] = useState<string | null>(null);

  const schedule = formatPickupScheduleBlock(
    row.pickupDate ? { date: row.pickupDate, time: row.pickupTime ?? '' } : null
  );

  useEffect(() => {
    let cancelled = false;
    setLoadingDetail(true);
    getAdminOrderDetail(row.id)
      .then((d) => {
        if (cancelled) return;
        const a = d.order.shipping_address;
        setShipStreet(a?.street ?? null);
        setShipPhone(a?.phone ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setShipStreet(null);
          setShipPhone(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [row.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDownloadLabel = async () => {
    setDownloading(true);
    try {
      await downloadShippingLabelForOrder(row.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not download label');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-labelledby="scheduled-pickup-title"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#0d0d0d]">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
              Scheduled pickup
            </p>
            <h2 id="scheduled-pickup-title" className="text-lg font-black text-white truncate">
              {row.orderNumber}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">{row.customerName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1">
                <CalendarClock className="w-3 h-3" /> Date
              </p>
              <p className="text-sm font-black text-emerald-300 mt-1">{schedule.dateLabel}</p>
            </div>
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Time
              </p>
              <p className="text-sm font-black text-white mt-1">{schedule.timeLabel}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Courier
            </p>
            <Detail label="AWB / Waybill" value={row.waybill} mono highlight />
            <Detail label="Pickup ID" value={row.pickupToken ?? '—'} mono />
            <Detail label="Status" value={row.delhiveryStatus || row.status} />
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Deliver to
            </p>
            {loadingDetail ? (
              <ODILoader size="sm" label="Loading address…" className="py-4" />
            ) : (
              <>
                <Detail label="Name" value={row.customerName} />
                <Detail label="City" value={[row.city, row.state].filter(Boolean).join(', ') || '—'} />
                {shipStreet && <Detail label="Address" value={shipStreet} />}
                {shipPhone && <Detail label="Phone" value={shipPhone} />}
              </>
            )}
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-xs font-bold text-cyan-200 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Package label for this order
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Print this label and stick it on the parcel before Delhivery pickup. You can download
              again anytime from here if you missed it earlier.
            </p>
            <button
              type="button"
              disabled={downloading}
              onClick={() => void handleDownloadLabel()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              Download shipping label (PDF)
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Official Delhivery label
            </p>
            <p className="text-xs text-neutral-400">
              The exact courier label (same as your screenshot) is also available in Delhivery One —
              search AWB <span className="font-mono text-cyan-400">{row.waybill}</span> → Print.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={delhiveryOneReadyForPickupUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Open Delhivery One — Ready for pickup
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={delhiveryOnePortalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white"
              >
                Delhivery One home
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={delhiveryTrackUrl(row.waybill)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-neutral-400 hover:text-cyan-400"
              >
                Track on delhivery.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/[0.06] bg-[#0d0d0d] flex flex-col sm:flex-row gap-2">
          <Link
            to={`/dashboard/admin/orders/${row.id}?pickup=1#fulfillment`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border border-white/10 text-white hover:bg-white/5"
            onClick={onClose}
          >
            <Truck className="w-4 h-4" />
            Full order detail
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold rounded-xl text-neutral-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

function Detail({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{label}</p>
      <p
        className={`text-sm font-medium mt-0.5 break-words ${
          highlight ? 'font-mono font-black text-cyan-400' : mono ? 'font-mono text-neutral-200' : 'text-neutral-200'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
