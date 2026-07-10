import React from 'react';
import { FileText, Download } from 'lucide-react';
import { PageHeader, Card, BookingBadge, inr } from '../../../components/dashboard/shared';
import { myBookings } from '../../../data/mock';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Order"
        accent="History."
        subtitle="Your complete purchase history with downloadable invoices."
      />

      <Card title="All Orders">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
              <tr>
                <th className="px-6 py-3.5">Order</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Total</th>
                <th className="px-6 py-3.5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {myBookings.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-neutral-400" />
                      </div>
                      <span className="font-bold">#{b.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{b.product} × {b.qty}</td>
                  <td className="px-6 py-4 text-neutral-500">{b.date}</td>
                  <td className="px-6 py-4"><BookingBadge status={b.status} /></td>
                  <td className="px-6 py-4 text-right font-black">{inr(b.amount)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
