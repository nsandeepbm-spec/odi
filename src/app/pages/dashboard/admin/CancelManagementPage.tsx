import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Ban, CheckCircle2, Search, XCircle, Clock, Eye } from 'lucide-react';
import {
  PageHeader,
  Card,
  EmptyState,
  StatCard,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import { ODILoader } from '../../../components/ODILoader';
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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState('');

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

  const handleReview = async (row: CancelRow, decision: 'approved' | 'rejected') => {
    setBusyId(row.id);
    try {
      await reviewAdminCancel(row.id, decision, note);
      setNote('');
      await load();
      if (decision === 'approved') {
        alert('Cancel approved. Delhivery cancel attempted if waybill exists. Refund queued under Refund Management.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not update request');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Cancel"
        accent="Management."
        subtitle="Review customer cancel requests. Approve runs Delhivery cancel (if AWB) and queues a refund."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending" value={String(pendingCount)} icon={Clock} delay={0} />
        <StatCard label="Approved" value={String(approvedCount)} icon={CheckCircle2} delay={0.05} />
        <StatCard label="Rejected" value={String(rejectedCount)} icon={XCircle} delay={0.1} />
      </div>

      <Card>
        <div className="p-4 sm:p-5 border-b border-white/[0.04] flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.07] bg-[#111113] max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, customer, AWB…"
              className="w-full bg-transparent text-sm outline-none text-neutral-300 placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 border-b border-white/[0.04]">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
            Admin note (optional)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Applied on next approve/reject"
            className="w-full px-3 py-2.5 rounded-xl border border-white/[0.07] bg-[#111113] text-sm text-neutral-200 outline-none focus:border-white/20"
          />
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 border-b border-white/[0.04]">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Requested</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/admin/orders/${row.orderId}`}
                        className="font-black text-cyan-400 hover:underline"
                      >
                        {row.orderNumber}
                      </Link>
                      {row.waybill && (
                        <p className="text-[11px] text-neutral-500 mt-0.5">AWB {row.waybill}</p>
                      )}
                      {row.delhiveryError && (
                        <p className="text-[11px] text-amber-400 mt-0.5">Delhivery: {row.delhiveryError}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{row.userName || '—'}</p>
                      <p className="text-xs text-neutral-500">{row.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="text-neutral-300 line-clamp-2">{row.reason}</p>
                      {row.adminNote && (
                        <p className="text-[11px] text-neutral-500 mt-1">Note: {row.adminNote}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-white">{inrFromPaise(row.amountPaise)}</td>
                    <td className="px-5 py-4">
                      <StatusChip status={row.status} />
                    </td>
                    <td className="px-5 py-4 text-neutral-400 text-xs">{formatDate(row.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard/admin/orders/${row.orderId}`}
                          className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {row.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === row.id}
                              onClick={() => void handleReview(row, 'approved')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busyId === row.id}
                              onClick={() => void handleReview(row, 'rejected')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
