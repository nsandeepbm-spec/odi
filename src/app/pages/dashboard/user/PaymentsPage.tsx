import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, IndianRupee, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { listMyOrders, type UserOrder } from '../../../lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing:  'bg-sky-500/10 text-sky-400 border-sky-500/20',
    delivered:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled:   'bg-red-500/10 text-red-400 border-red-500/20',
    refunded:    'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    shipped:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };
  const cls = styles[status] ?? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  return (
    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${cls}`}>
      {label}
    </span>
  );
}

export default function PaymentsPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listMyOrders(1, 50)
      .then((res) => {
        if (!cancelled) { setOrders(res.orders); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load payments');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const kpis = useMemo(() => {
    const paid = orders
      .filter((o) => !['pending', 'cancelled', 'refunded'].includes(o.status))
      .reduce((s, o) => s + o.total_paise, 0);
    const pending = orders
      .filter((o) => o.status === 'pending')
      .reduce((s, o) => s + o.total_paise, 0);
    const refunded = orders
      .filter((o) => o.status === 'refunded')
      .reduce((s, o) => s + o.total_paise, 0);
    return { paid, pending, refunded };
  }, [orders]);

  if (loading) return <DashboardSkeleton cols={5} rows={6} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load payments</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <PageHeader
        eyebrow="Financial Summary"
        title="Payments &"
        accent="Billing."
        subtitle="Your complete billing history and payment summary."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        <StatCard label="Total Paid"    value={inrFromPaise(kpis.paid)}     icon={IndianRupee}   delay={0} />
        <StatCard label="Pending"       value={inrFromPaise(kpis.pending)}  icon={Clock}         delay={0.06} />
        <StatCard label="Refunded"      value={inrFromPaise(kpis.refunded)} icon={CreditCard}    delay={0.12} />
      </div>

      <Card
        className="relative z-10"
        title="Billing History"
      >
        {orders.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No transactions yet"
            subtitle="Your payment history will appear here after your first order."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[520px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {orders.map((o) => {
                  const isPaid = !['pending', 'cancelled', 'refunded'].includes(o.status);
                  return (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                            {isPaid
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              : o.status === 'cancelled'
                                ? <XCircle className="w-4 h-4 text-red-500" />
                                : <Clock className="w-4 h-4 text-amber-400" />
                            }
                          </div>
                          <div>
                            <div className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors text-xs">
                              #{o.order_number ?? o.id.slice(0, 8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-medium">{formatDate(o.created_at)}</td>
                      <td className="px-6 py-4"><PaymentStatusBadge status={o.status} /></td>
                      <td className="px-6 py-4 text-right font-black text-white">{inrFromPaise(o.total_paise)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
