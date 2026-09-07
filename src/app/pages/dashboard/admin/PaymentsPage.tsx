import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { IndianRupee, Clock, RotateCcw, Download, AlertCircle, Eye, ChevronRight } from 'lucide-react';
import { PageHeader, StatCard, Card, PaymentBadge, EmptyState, inrFromPaise, DashboardSkeleton } from '../../../components/dashboard/shared';
import { listAdminPayments, type AdminPayment } from '../../../lib/api';
import { downloadCsv, inDateRange } from '../../../lib/csv';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function badgeStatus(status: string): 'paid' | 'pending' | 'refunded' | 'failed' {
  if (status === 'captured' || status === 'paid') return 'paid';
  if (status === 'refunded') return 'refunded';
  if (status === 'failed') return 'failed';
  return 'pending';
}

function customerName(t: AdminPayment) {
  return (
    [t.orders?.shipping_address?.first_name, t.orders?.shipping_address?.last_name]
      .filter(Boolean)
      .join(' ') || 'Customer'
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [kpis, setKpis] = useState({ collectedPaise: 0, pendingPaise: 0, refundedPaise: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await listAdminPayments(1, 100);
        if (!cancelled) {
          setPayments(result.payments);
          setKpis(result.kpis);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load payments');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () => payments.filter((p) => inDateRange(p.created_at, dateFrom, dateTo)),
    [payments, dateFrom, dateTo]
  );

  const exportCsv = () => {
    if (filtered.length === 0) {
      alert('No payments match the current date range to export.');
      return;
    }
    const headers = [
      'Payment ID',
      'Order Number',
      'Order ID',
      'Customer',
      'Provider',
      'Status',
      'Amount (INR)',
      'Date',
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.orders?.order_number || '',
      t.order_id,
      customerName(t),
      t.provider,
      t.status,
      (t.amount_paise / 100).toFixed(2),
      formatDate(t.created_at),
    ]);
    const stamp = new Date().toISOString().slice(0, 10);
    const range = [dateFrom || 'all', dateTo || 'all'].join('_to_');
    downloadCsv(`odi-payments_${range}_${stamp}.csv`, headers, rows);
  };

  if (loading) return <DashboardSkeleton cols={5} rows={7} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3 relative z-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load payments</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Payments &"
        accent="Transactions."
        subtitle="Captured checkout payments. Approve customer refunds from Refund Management."
        action={
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link
              to="/dashboard/admin/refunds"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 text-sm font-bold tracking-wide border border-cyan-500/25 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all rounded-xl relative z-10"
            >
              Refund Management
            </Link>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl shadow-lg relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 relative z-10">
        <StatCard label="Collected" value={inrFromPaise(kpis.collectedPaise)} icon={IndianRupee} delay={0} />
        <StatCard label="Pending" value={inrFromPaise(kpis.pendingPaise)} icon={Clock} delay={0.06} />
        <StatCard label="Refunded" value={inrFromPaise(kpis.refundedPaise)} icon={RotateCcw} delay={0.12} />
      </div>

      <Card title="Transaction History" className="relative z-10">
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.04] bg-[#0d0d0d] grid grid-cols-2 sm:flex sm:flex-wrap sm:items-end gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              className="col-span-2 sm:col-auto px-3 py-2 text-xs font-bold rounded-xl text-neutral-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Clear dates
            </button>
          )}
          <span className="col-span-2 sm:ml-auto text-xs text-neutral-500 font-bold sm:self-center">
            {filtered.length} of {payments.length} shown
          </span>
        </div>

        {payments.length === 0 ? (
          <EmptyState icon={IndianRupee} title="No payments found" subtitle="Payments will appear here once customers checkout." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={IndianRupee} title="No payments in range" subtitle="Try a different date range." />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((t) => (
                <Link
                  key={t.id}
                  to={`/dashboard/admin/payments/${t.id}`}
                  className="flex items-center gap-3 px-4 py-4 active:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm text-cyan-400 truncate">
                        #{t.orders?.order_number || '—'}
                      </span>
                      <span className="font-black text-sm text-white shrink-0">
                        {inrFromPaise(t.amount_paise)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">{customerName(t)}</p>
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-2">
                      <span className="text-xs text-neutral-500 font-medium">
                        {formatDate(t.created_at)} · {t.provider}
                      </span>
                      <PaymentBadge status={badgeStatus(t.status)} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </Link>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Transaction</th>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Customer</th>
                    <th className="px-4 lg:px-6 py-4">Method</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Amount</th>
                    <th className="px-4 py-4 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <Link
                          to={`/dashboard/admin/payments/${t.id}`}
                          className="font-bold text-xs font-mono text-neutral-500 group-hover:text-cyan-400 transition-colors hover:underline"
                        >
                          {t.id.slice(0, 13)}…
                        </Link>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {t.order_id ? (
                          <Link
                            to={`/dashboard/admin/orders/${t.order_id}`}
                            className="font-black text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                          >
                            #{t.orders?.order_number || '—'}
                          </Link>
                        ) : (
                          <span className="font-black text-cyan-400">#{t.orders?.order_number || '—'}</span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-bold text-white">{customerName(t)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
                          {t.provider}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-neutral-400 font-medium">
                        {formatDate(t.created_at)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <PaymentBadge status={badgeStatus(t.status)} />
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right font-black text-white drop-shadow-sm">
                        {inrFromPaise(t.amount_paise)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          to={`/dashboard/admin/payments/${t.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                          title="View payment details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
