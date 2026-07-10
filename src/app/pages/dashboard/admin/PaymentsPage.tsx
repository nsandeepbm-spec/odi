import React from 'react';
import { IndianRupee, Clock, RotateCcw, Download } from 'lucide-react';
import { PageHeader, StatCard, Card, PaymentBadge, inr } from '../../../components/dashboard/shared';
import { transactions } from '../../../data/mock';

export default function PaymentsPage() {
  const collected = transactions.filter((t) => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter((t) => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const refunded = transactions.filter((t) => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);

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
        <StatCard label="Collected" value={inr(collected)} icon={IndianRupee} trend="+8.4%" delay={0} />
        <StatCard label="Pending" value={inr(pending)} icon={Clock} delay={0.06} />
        <StatCard label="Refunded" value={inr(refunded)} icon={RotateCcw} delay={0.12} />
      </div>

      <Card title="Transaction History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[720px]">
            <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
              <tr>
                <th className="px-6 py-3.5">Transaction</th>
                <th className="px-6 py-3.5">Booking</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold">{t.id}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">#{t.bookingId}</td>
                  <td className="px-6 py-4 text-neutral-600">{t.customer}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-neutral-100 text-neutral-500">
                      {t.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{t.date}</td>
                  <td className="px-6 py-4"><PaymentBadge status={t.status} /></td>
                  <td className="px-6 py-4 text-right font-black">{inr(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
