import React from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { PageHeader, Card, PaymentBadge, inr } from '../../../components/dashboard/shared';
import { myBookings } from '../../../data/mock';

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payments &"
        accent="Billing."
        subtitle="Manage saved payment methods and view billing history."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Saved methods */}
        <div className="space-y-4">
          <div className="relative rounded-2xl p-6 text-white overflow-hidden shadow-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/30 via-indigo-500/30 to-purple-600/30 blur-2xl" />
            <div className="flex items-center justify-between mb-10">
              <CreditCard className="w-6 h-6 opacity-80" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60">Primary</span>
            </div>
            <p className="font-mono text-lg tracking-[0.2em] mb-6">•••• •••• •••• 4421</p>
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="opacity-50 text-[9px] font-bold tracking-widest uppercase mb-0.5">Card Holder</p>
                <p className="font-bold">Sandeep</p>
              </div>
              <div>
                <p className="opacity-50 text-[9px] font-bold tracking-widest uppercase mb-0.5">Expires</p>
                <p className="font-bold">09/28</p>
              </div>
            </div>
          </div>
          <button className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide border border-dashed border-neutral-300 rounded-2xl text-neutral-500 hover:bg-white hover:text-neutral-900 transition-colors">
            <Plus className="w-4 h-4" /> Add Payment Method
          </button>
        </div>

        {/* Billing history */}
        <Card title="Billing History" className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[480px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Reference</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {myBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">#{b.id}</div>
                      <div className="text-xs text-neutral-400">{b.product}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{b.date}</td>
                    <td className="px-6 py-4"><PaymentBadge status={b.payment} /></td>
                    <td className="px-6 py-4 text-right font-black">{inr(b.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
