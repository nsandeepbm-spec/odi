import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, CheckCircle2, Search, XCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import {
  PageHeader,
  Card,
  EmptyState,
  StatCard,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import { ODILoader } from '../../../components/ODILoader';
import { CancelRequestDrawer } from '../../../components/dashboard/CancelRequestDrawer';
import { FeedbackDialog } from '../../../components/dashboard/FeedbackDialog';
import {
  listAdminCancels,
  reviewAdminCancel,
  type CancelRow,
  type CancelStatus,
} from '../../../lib/api';

const FILTERS: { label: string; value: CancelStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusChip({ status }: { status: CancelStatus }) {
  const cls =
    status === 'pending'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : status === 'approved'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${cls}`}>
      {status}
    </span>
  );
}

export default function CancelManagementPage() {
  const [rows, setRows] = useState<CancelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CancelStatus | 'all'>('pending');
  const [busyAction, setBusyAction] = useState<{
    id: string;
    decision: 'approved' | 'rejected';
  } | null>(null);
  const [viewRow, setViewRow] = useState<CancelRow | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminCancels();
      setRows(data.cancels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cancels');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.orderNumber.toLowerCase().includes(q) ||
        (r.userName ?? '').toLowerCase().includes(q) ||
        (r.userEmail ?? '').toLowerCase().includes(q) ||
        (r.waybill ?? '').toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  const pendingCount = rows.filter((r) => r.status === 'pending').length;
  const approvedCount = rows.filter((r) => r.status === 'approved').length;
  const rejectedCount = rows.filter((r) => r.status === 'rejected').length;

  const handleReview = async (row: CancelRow, decision: 'approved' | 'rejected', adminNote: string) => {
    setBusyAction({ id: row.id, decision });
    try {
      const updated = await reviewAdminCancel(row.id, decision, adminNote);
      await load();
      setViewRow(null);
      if (decision === 'approved') {
        setFeedback({
          tone: 'success',
          title: 'Cancellation approved',
          message: updated.waybill
            ? 'The courier shipment was cancelled. A refund is queued under Refund Management.'
            : 'A refund is queued under Refund Management.',
        });
      } else {
        setFeedback({
          tone: 'success',
          title: 'Cancellation declined',
          message: 'The customer’s cancel request was declined. The order stays active.',
        });
      }
    } catch (err) {
      setFeedback({
        tone: 'error',
        title: 'Could not update request',
        message: err instanceof Error ? err.message : 'Please try again.',
      });
      await load();
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="min-w-0">
      <PageHeader
        title="Cancel"
        accent="Management."
        subtitle="Open View to read the customer message and order details, then approve or reject."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending" value={String(pendingCount)} icon={Clock} delay={0} />
        <StatCard label="Approved" value={String(approvedCount)} icon={CheckCircle2} delay={0.05} />
        <StatCard label="Rejected" value={String(rejectedCount)} icon={XCircle} delay={0.1} />
      </div>

      <Card>
        <div className="px-4 sm:p-5 py-4 border-b border-white/[0.04] flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filter === f.value
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.07] bg-[#111113] w-full lg:max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, customer, AWB…"
              className="w-full min-w-0 bg-transparent text-sm outline-none text-neutral-300 placeholder:text-neutral-600"
            />
          </div>
        </div>

        {loading ? (
          <ODILoader size="sm" label="Loading…" className="py-16" />
        ) : error ? (
          <EmptyState icon={Ban} title="Could not load" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Ban}
            title="No cancel requests"
            subtitle="When a customer submits Cancel Request, it appears here."
          />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setViewRow(row)}
                  className="w-full text-left flex items-center gap-3 px-4 py-4 active:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm text-cyan-400 truncate">{row.orderNumber}</span>
                      <span className="font-black text-sm text-white shrink-0">
                        {inrFromPaise(row.amountPaise)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">{row.userName || '—'}</p>
                    {row.userEmail ? (
                      <p className="text-xs text-neutral-500 truncate">{row.userEmail}</p>
                    ) : null}
                    {row.waybill ? (
                      <p className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">AWB {row.waybill}</p>
                    ) : null}
                    {row.delhiveryError ? (
                      <p className="text-[11px] text-amber-400 mt-0.5 line-clamp-2">
                        Delhivery: {row.delhiveryError}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-2">
                      <span className="text-xs text-neutral-500 font-medium truncate">
                        {formatDate(row.createdAt)}
                      </span>
                      <StatusChip status={row.status} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[720px]">
                <thead>
                  <tr className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 border-b border-white/[0.04]">
                    <th className="px-4 lg:px-5 py-3">Order</th>
                    <th className="px-4 lg:px-5 py-3">Customer</th>
                    <th className="px-4 lg:px-5 py-3">Amount</th>
                    <th className="px-4 lg:px-5 py-3">Status</th>
                    <th className="px-4 lg:px-5 py-3">Requested</th>
                    <th className="px-4 lg:px-5 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 lg:px-5 py-4">
                        <p className="font-black text-cyan-400">{row.orderNumber}</p>
                        {row.waybill && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">AWB {row.waybill}</p>
                        )}
                        {row.delhiveryError && (
                          <p className="text-[11px] text-amber-400 mt-0.5">Delhivery: {row.delhiveryError}</p>
                        )}
                      </td>
                      <td className="px-4 lg:px-5 py-4">
                        <p className="font-semibold text-white">{row.userName || '—'}</p>
                        <p className="text-xs text-neutral-500">{row.userEmail}</p>
                      </td>
                      <td className="px-4 lg:px-5 py-4 font-bold text-white">{inrFromPaise(row.amountPaise)}</td>
                      <td className="px-4 lg:px-5 py-4">
                        <StatusChip status={row.status} />
                      </td>
                      <td className="px-4 lg:px-5 py-4 text-neutral-400 text-xs">{formatDate(row.createdAt)}</td>
                      <td className="px-4 lg:px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewRow(row)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <CancelRequestDrawer
        open={!!viewRow}
        row={viewRow}
        busyAction={viewRow && busyAction?.id === viewRow.id ? busyAction.decision : null}
        onClose={() => setViewRow(null)}
        onReview={handleReview}
      />

      <FeedbackDialog
        open={!!feedback}
        tone={feedback?.tone ?? 'success'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
