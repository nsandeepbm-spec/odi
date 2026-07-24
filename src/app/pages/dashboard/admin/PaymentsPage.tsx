import React, { useEffect, useState } from 'react';
import { IndianRupee, Clock, RotateCcw, Download, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatCard, Card, PaymentBadge, EmptyState, inrFromPaise } from '../../../components/dashboard/shared';
import { listAdminPayments, type AdminPayment } from '../../../lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [kpis, setKpis] = useState({ collectedPaise: 0, pendingPaise: 0, refundedPaise: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Loading payments…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="font-bold text-sm">Could not load payments</p>
        <p className="text-xs text-neutral-500 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Payments &"
        accent="Transactions."
        subtitle="Monitor collections, pending payments and refunds."
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide border border-neutral-200 hover:bg-neutral-50 transition-colors rounded-xl">
            <Download className="w-4 h-4" /> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Collected" value={inrFromPaise(kpis.collectedPaise)} icon={IndianRupee} delay={0} />
        <StatCard label="Pending" value={inrFromPaise(kpis.pendingPaise)} icon={Clock} delay={0.06} />
        <StatCard label="Refunded" value={inrFromPaise(kpis.refundedPaise)} icon={RotateCcw} delay={0.12} />
      </div>

      <Card title="Transaction History">
        {payments.length === 0 ? (
          <EmptyState icon={IndianRupee} title="No payments found" subtitle="Payments will appear here once customers checkout." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[720px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Transaction</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((t) => {
                  const customer = [t.orders?.shipping_address?.first_name, t.orders?.shipping_address?.last_name].filter(Boolean).join(' ') || 'Customer';
                  return (
                    <tr key={t.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-xs font-mono text-neutral-500">{t.id.slice(0, 13)}…</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">#{t.orders?.order_number || '—'}</td>
                      <td className="px-6 py-4 text-neutral-600">{customer}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-neutral-100 text-neutral-500">
                          {t.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500">{formatDate(t.created_at)}</td>
                      <td className="px-6 py-4"><PaymentBadge status={t.status as any} /></td>
                      <td className="px-6 py-4 text-right font-black">{inrFromPaise(t.amount_paise)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
