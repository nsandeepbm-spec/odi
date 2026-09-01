import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Search,
  Truck,
  Loader2,
  CalendarX,
  CheckCircle2,
  CalendarClock,
  ListChecks,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { PageHeader, Card, EmptyState, TableSkeleton } from '../../../components/dashboard/shared';
import { ScheduledPickupPanel } from '../../../components/dashboard/ScheduledPickupPanel';
import {
  listAdminPickups,
  createAdminOrderPickup,
  type AdminPickupRow,
} from '../../../lib/api';
import { formatPickupDateLabel, formatPickupScheduleBlock } from '../../../lib/pickupSchedule';

/** Space bulk Delhivery pickup calls (~1.2 req/s) to stay under typical rate limits. */
const PICKUP_GAP_MS = 850;

type Tab = 'needs' | 'scheduled';

function tomorrowIsoDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatOrderPlaced(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const PICKUP_TIMES = [
  { value: '10:00:00', label: '10:00 (morning)' },
  { value: '12:15:00', label: '12:15 (mid-day)' },
  { value: '14:00:00', label: '14:00 (afternoon)' },
  { value: '16:00:00', label: '16:00 (evening)' },
];

function orderDetailHref(id: string, focusPickup?: boolean) {
  return focusPickup
    ? `/dashboard/admin/orders/${id}?pickup=1#fulfillment`
    : `/dashboard/admin/orders/${id}`;
}

/**
 * Admin Pickups — schedule Delhivery pickup + view scheduled date/time.
 */
export default function PickupsPage() {
  const [tab, setTab] = useState<Tab>('needs');
  const [needsRows, setNeedsRows] = useState<AdminPickupRow[]>([]);
  const [scheduledRows, setScheduledRows] = useState<AdminPickupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pickupDate, setPickupDate] = useState(tomorrowIsoDate);
  const [pickupTime, setPickupTime] = useState('12:15:00');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [selectedScheduled, setSelectedScheduled] = useState<AdminPickupRow | null>(null);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminPickups();
      setNeedsRows(data.needs);
      setScheduledRows(data.scheduled);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pickups');
      setNeedsRows([]);
      setScheduledRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPickups();
  }, [fetchPickups]);

  const source = tab === 'needs' ? needsRows : scheduledRows;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((row) => {
      const sched = row.pickupDate
        ? `${row.pickupDate} ${row.pickupTime ?? ''} ${row.pickupTimeLabel ?? ''}`.toLowerCase()
        : '';
      return (
        row.orderNumber.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.waybill.toLowerCase().includes(q) ||
        (row.pickupToken ?? '').toLowerCase().includes(q) ||
        sched.includes(q) ||
        (row.city ?? '').toLowerCase().includes(q)
      );
    });
  }, [source, query]);

  const allFilteredSelected =
    tab === 'needs' && filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const r of filtered) next.delete(r.id);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const r of filtered) next.add(r.id);
        return next;
      });
    }
  };

  const handleSingle = async (orderId: string) => {
    if (!pickupDate) {
      alert('Choose a pickup date');
      return;
    }
    setProcessingId(orderId);
    setLastMessage(null);
    try {
      await createAdminOrderPickup(orderId, {
        pickupDate,
        pickupTime,
        packageCount: 1,
      });
      setLastMessage(`Pickup scheduled for ${formatPickupDateLabel(pickupDate)} · ${pickupTime.slice(0, 5)}`);
      setTab('scheduled');
      await fetchPickups();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Pickup request failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleBulk = async () => {
    const ids = filtered.filter((r) => selected.has(r.id)).map((r) => r.id);
    if (ids.length === 0) {
      alert('Select at least one order');
      return;
    }
    if (!pickupDate) {
      alert('Choose a pickup date');
      return;
    }

    setBulkRunning(true);
    setBulkProgress({ done: 0, total: ids.length });
    setLastMessage(null);
    let ok = 0;
    let failed = 0;

    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        setProcessingId(id);
        try {
          await createAdminOrderPickup(id, { pickupDate, pickupTime, packageCount: 1 });
          ok += 1;
        } catch {
          failed += 1;
        }
        setBulkProgress({ done: i + 1, total: ids.length });
        if (i < ids.length - 1) await sleep(PICKUP_GAP_MS);
      }
      setLastMessage(
        `Scheduled ${ok} pickup${ok === 1 ? '' : 's'} for ${formatPickupDateLabel(pickupDate)} · ${pickupTime.slice(0, 5)}` +
          (failed ? ` · ${failed} failed` : '')
      );
      if (ok > 0) setTab('scheduled');
    } finally {
      setProcessingId(null);
      setBulkRunning(false);
      setBulkProgress(null);
      await fetchPickups();
    }
  };

  const busy = processingId !== null || bulkRunning;

  return (
    <div className="min-w-0">
      <PageHeader
        title="Schedule"
        accent="Pickups."
        subtitle="Needs schedule: ready to request pickup. Scheduled: click any row to open details and re-download the shipping label (or use Delhivery One for the official courier PDF)."
        action={
          <Link
            to="/dashboard/admin/shipments"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-4 sm:px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] rounded-xl"
          >
            <Truck className="w-4 h-4" />
            Shipments (AWB)
          </Link>
        }
      />

      <div className="relative z-10 mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('needs')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors ${
            tab === 'needs'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'bg-black/40 text-neutral-400 border-white/[0.08] hover:text-white'
          }`}
        >
          <CalendarClock className="w-4 h-4 shrink-0" />
          <span className="truncate">Needs schedule</span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/10 shrink-0">
            {needsRows.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab('scheduled')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors ${
            tab === 'scheduled'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-black/40 text-neutral-400 border-white/[0.08] hover:text-white'
          }`}
        >
          <ListChecks className="w-4 h-4 shrink-0" />
          Scheduled
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/10 shrink-0">
            {scheduledRows.length}
          </span>
        </button>
      </div>

      {tab === 'needs' && (
        <Card className="relative z-10 mb-4">
          <div className="px-4 sm:px-5 py-4 grid grid-cols-2 lg:flex lg:flex-row lg:items-end gap-3 sm:gap-4 bg-[#0d0d0d]">
            <div className="flex flex-col gap-1.5 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Pickup date
              </label>
              <input
                type="date"
                value={pickupDate}
                min={tomorrowIsoDate()}
                onChange={(e) => setPickupDate(e.target.value)}
                disabled={busy}
                className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark] disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                Pickup time
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                disabled={busy}
                className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-50"
              >
                {PICKUP_TIMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={busy || selected.size === 0}
              onClick={() => void handleBulk()}
              className="col-span-2 lg:col-auto w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold tracking-wide bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {bulkRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CalendarClock className="w-4 h-4" />
              )}
              Schedule selected ({selected.size})
            </button>
            {bulkProgress && (
              <p className="col-span-2 lg:col-auto text-xs font-medium text-neutral-400 self-center">
                {bulkProgress.done} / {bulkProgress.total}…
              </p>
            )}
          </div>
          {lastMessage && (
            <p className="px-4 sm:px-5 pb-3 text-xs font-medium text-emerald-400 break-words">{lastMessage}</p>
          )}
        </Card>
      )}

      {tab === 'scheduled' && lastMessage && (
        <p className="relative z-10 mb-3 text-xs font-medium text-emerald-400 px-1 break-words">{lastMessage}</p>
      )}

      <Card className="relative z-10">
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-3 bg-[#0d0d0d]">
          <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-md px-4 py-2 rounded-xl bg-[#050505] border border-white/[0.06]">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === 'needs'
                  ? 'Search order / waybill…'
                  : 'Search order / date / pickup ID…'
              }
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
            />
          </div>
          <p className="text-xs text-neutral-500">
            {filtered.length} {tab === 'needs' ? 'ready' : 'scheduled'}
            {tab === 'needs' ? (
              <span className="hidden sm:inline">{` · bulk gap ${PICKUP_GAP_MS}ms`}</span>
            ) : null}
          </p>
        </div>

        {loading ? (
          <TableSkeleton cols={tab === 'needs' ? 6 : 8} rows={5} />
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn't load pickups" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={tab === 'needs' ? CheckCircle2 : ListChecks}
            title={tab === 'needs' ? 'Nothing to pick up' : 'No scheduled pickups'}
            subtitle={
              tab === 'needs'
                ? 'No manifested orders waiting for pickup. Create waybills on Shipments first.'
                : 'When you schedule a pickup, it will appear here with date and time.'
            }
          />
        ) : tab === 'needs' ? (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                  disabled={busy}
                  className="rounded border-white/20"
                  aria-label="Select all"
                />
                <span className="text-xs font-bold text-neutral-400">
                  Select all{selected.size > 0 ? ` · ${selected.size} selected` : ''}
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((row) => (
                  <div key={row.id} className="px-4 py-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        disabled={busy}
                        className="mt-1 rounded border-white/20 shrink-0"
                        aria-label={`Select ${row.orderNumber}`}
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={orderDetailHref(row.id)}
                          className="font-black text-cyan-400 hover:underline break-all"
                        >
                          {row.orderNumber}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {formatOrderPlaced(row.createdAt)}
                        </div>
                        <p className="font-bold text-white truncate mt-1.5">{row.customerName}</p>
                        <p className="text-xs text-neutral-500">{row.city || '—'}</p>
                        <span className="inline-block max-w-full mt-1.5 font-mono text-cyan-400 text-xs font-bold break-all">
                          {row.waybill}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleSingle(row.id)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {processingId === row.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CalendarClock className="w-3.5 h-3.5" />
                      )}
                      Request pickup
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[720px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={toggleAllFiltered}
                        disabled={busy}
                        className="rounded border-white/20"
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Waybill</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleOne(row.id)}
                          disabled={busy}
                          className="rounded border-white/20"
                          aria-label={`Select ${row.orderNumber}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={orderDetailHref(row.id)}
                          className="font-black text-cyan-400 hover:underline"
                        >
                          {row.orderNumber}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {formatOrderPlaced(row.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-white">{row.customerName}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-cyan-400 text-xs font-bold">{row.waybill}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-400 text-xs">{row.city || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void handleSingle(row.id)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 disabled:opacity-50"
                        >
                          {processingId === row.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CalendarClock className="w-3.5 h-3.5" />
                          )}
                          Request pickup
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((row) => {
                const sched = formatPickupScheduleBlock(
                  row.pickupDate
                    ? { date: row.pickupDate, time: row.pickupTime ?? '' }
                    : null
                );
                return (
                  <div key={row.id} className="px-4 py-4 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedScheduled(row)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="font-black text-cyan-400 break-all">{row.orderNumber}</span>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Placed {formatOrderPlaced(row.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider text-right shrink-0 ${
                            sched.hasSchedule ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {sched.hasSchedule ? 'Scheduled' : 'No date'}
                        </span>
                      </div>
                      <p className="font-bold text-white truncate mt-2">{row.customerName}</p>
                      <p className="text-xs text-neutral-500">{row.city || '—'}</p>
                      <p className="text-xs font-bold text-white mt-2">
                        {sched.dateLabel}
                        {sched.timeLabel ? ` · ${sched.timeLabel}` : ''}
                      </p>
                      <p className="font-mono text-cyan-400 text-xs font-bold break-all mt-1">{row.waybill}</p>
                      {row.pickupToken ? (
                        <p className="font-mono text-[10px] text-neutral-500 break-all mt-0.5">
                          Pickup ID {row.pickupToken}
                        </p>
                      ) : null}
                      <p className="text-xs text-neutral-400 capitalize mt-1">
                        {row.delhiveryStatus || row.status}
                      </p>
                    </button>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedScheduled(row)}
                        className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open
                      </button>
                      <Link
                        to={orderDetailHref(row.id, true)}
                        className="inline-flex items-center justify-center gap-1 w-full px-3 py-2.5 text-xs font-bold rounded-lg text-neutral-400 border border-white/10 hover:text-white hover:bg-white/5"
                      >
                        Order
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[900px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Pickup date</th>
                    <th className="px-4 py-3">Pickup time</th>
                    <th className="px-4 py-3">Waybill</th>
                    <th className="px-4 py-3">Pickup ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((row) => {
                    const sched = formatPickupScheduleBlock(
                      row.pickupDate
                        ? { date: row.pickupDate, time: row.pickupTime ?? '' }
                        : null
                    );
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-white/[0.02] cursor-pointer"
                        onClick={() => setSelectedScheduled(row)}
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={orderDetailHref(row.id, true)}
                            className="font-black text-cyan-400 hover:underline"
                          >
                            {row.orderNumber}
                          </Link>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            Placed {formatOrderPlaced(row.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-white">{row.customerName}</p>
                          <p className="text-xs text-neutral-500">{row.city || '—'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-bold ${
                              sched.hasSchedule ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {sched.dateLabel}
                          </span>
                          {row.pickupDate && (
                            <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                              {row.pickupDate}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-white">{sched.timeLabel}</span>
                          {row.pickupTime && (
                            <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                              {row.pickupTime.slice(0, 8)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-cyan-400 text-xs font-bold">
                            {row.waybill}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-neutral-300">
                            {row.pickupToken || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-400 capitalize">
                          {row.delhiveryStatus || row.status}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedScheduled(row);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Open
                            </button>
                            <Link
                              to={orderDetailHref(row.id, true)}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white"
                            >
                              Order
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {selectedScheduled && (
        <ScheduledPickupPanel
          row={selectedScheduled}
          onClose={() => setSelectedScheduled(null)}
        />
      )}
    </div>
  );
}
