import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Banknote, Search, XCircle, Clock, Eye, BadgeCheck, ChevronRight } from 'lucide-react';
import {
  PageHeader,
  Card,
  EmptyState,
  StatCard,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import { ODILoader } from '../../../components/ODILoader';
import { razorpayRefundLabel } from '../../../components/dashboard/RefundRequestDrawer';
import {
  listAdminRefunds,
  type RefundRow,
  type RefundStatus,
} from '../../../lib/api';

type Tab = 'all' | 'review' | 'refunded' | 'declined';

const TABS: { label: string; value: Tab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Under review', value: 'review' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Declined', value: 'declined' },
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

function matchesTab(row: RefundRow, tab: Tab) {
  if (tab === 'all') return true;
  if (tab === 'review') return row.status === 'pending' || row.status === 'approved';
  if (tab === 'refunded') return row.status === 'completed';
  return row.status === 'rejected';
}

function StatusChip({ status }: { status: RefundStatus }) {
  const cls =
    status === 'pending' || status === 'approved'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : status === 'completed'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
  const label =
    status === 'pending' || status === 'approved'
      ? 'under review'
      : status === 'completed'
        ? 'refunded'
        : 'declined';
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${cls}`}>
      {label}
    </span>
  );
}

export default function RefundManagementPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RefundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('review');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminRefunds();
      setRows(data.refunds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load refunds');
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
      if (!matchesTab(r, tab)) return false;
      if (!q) return true;
      return (
        r.orderNumber.toLowerCase().includes(q) ||
        (r.userName ?? '').toLowerCase().includes(q) ||
        (r.userEmail ?? '').toLowerCase().includes(q) ||
        (r.providerRefundId ?? '').toLowerCase().includes(q) ||
        (r.providerPaymentId ?? '').toLowerCase().includes(q)
      );
    });
  }, [rows, tab, query]);

  const reviewCount = rows.filter((r) => r.status === 'pending' || r.status === 'approved').length;
  const refundedCount = rows.filter((r) => r.status === 'completed').length;
  const declinedCount = rows.filter((r) => r.status === 'rejected').length;

  return (
    <div className="min-w-0">
      <PageHeader
        title="Refund"
        accent="Management."
        subtitle="Open View for the cancelled order, payment IDs, then Approve refund."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Under review" value={String(reviewCount)} icon={Clock} delay={0} />
        <StatCard label="Refunded" value={String(refundedCount)} icon={BadgeCheck} delay={0.05} />
        <StatCard label="Declined" value={String(declinedCount)} icon={XCircle} delay={0.1} />
      </div>

      <Card>
        <div className="px-4 sm:p-5 py-4 border-b border-white/[0.04] flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {TABS.map((f) => {
              const count =
                f.value === 'all'
                  ? rows.length
                  : f.value === 'review'
                    ? reviewCount
                    : f.value === 'refunded'
                      ? refundedCount
                      : declinedCount;
              return (
              <button
                key={f.value}
                type="button"
                onClick={() => setTab(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
                  tab === f.value
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                }`}
              >
                {f.label}
                {count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    tab === f.value ? 'bg-white/10 text-cyan-400' : 'bg-white/[0.04] text-neutral-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.07] bg-[#111113] w-full lg:max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, customer, Razorpay id…"
              className="w-full min-w-0 bg-transparent text-sm outline-none text-neutral-300 placeholder:text-neutral-600"
            />
          </div>
        </div>

        {loading ? (
          <ODILoader size="sm" label="Loading…" className="py-16" />
        ) : error ? (
          <EmptyState icon={Banknote} title="Could not load" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Banknote}
            title="No refund requests"
            subtitle="Approve a cancel request to queue a refund here."
          />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((row) => {
                const rz = razorpayRefundLabel(row);
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => navigate(`/dashboard/admin/refunds/${row.id}`)}
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
                      <p
                        className={`text-[11px] leading-snug mt-1 line-clamp-2 ${
                          rz.tone === 'ok'
                            ? 'text-emerald-400'
                            : rz.tone === 'fail'
                              ? 'text-amber-400'
                              : 'text-neutral-500'
                        }`}
                      >
                        {rz.label}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-2">
                        <span className="text-xs text-neutral-500 font-medium truncate">
                          {formatDate(row.createdAt)}
                        </span>
                        <StatusChip status={row.status} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead>
                  <tr className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 border-b border-white/[0.04]">
                    <th className="px-4 lg:px-5 py-3">Order</th>
                    <th className="px-4 lg:px-5 py-3">Customer</th>
                    <th className="px-4 lg:px-5 py-3">Amount</th>
                    <th className="px-4 lg:px-5 py-3">Status</th>
                    <th className="px-4 lg:px-5 py-3">Razorpay</th>
                    <th className="px-4 lg:px-5 py-3">Requested</th>
                    <th className="px-4 lg:px-5 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => {
                    const rz = razorpayRefundLabel(row);
                    return (
                      <tr key={row.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="px-4 lg:px-5 py-4">
                          <p className="font-black text-cyan-400">{row.orderNumber}</p>
                        </td>
                        <td className="px-4 lg:px-5 py-4">
                          <p className="font-semibold text-white">{row.userName || '—'}</p>
                          <p className="text-xs text-neutral-500">{row.userEmail}</p>
                        </td>
                        <td className="px-4 lg:px-5 py-4 font-bold text-white">{inrFromPaise(row.amountPaise)}</td>
                        <td className="px-4 lg:px-5 py-4">
                          <StatusChip status={row.status} />
                        </td>
                        <td className="px-4 lg:px-5 py-4 max-w-[220px]">
                          <p
                            className={`text-xs leading-snug ${
                              rz.tone === 'ok'
                                ? 'text-emerald-400'
                                : rz.tone === 'fail'
                                  ? 'text-amber-400'
                                  : 'text-neutral-400'
                            }`}
                          >
                            {rz.label}
                          </p>
                        </td>
                        <td className="px-4 lg:px-5 py-4 text-neutral-400 text-xs">{formatDate(row.createdAt)}</td>
                        <td className="px-4 lg:px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/admin/refunds/${row.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
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
    </div>
  );
}
