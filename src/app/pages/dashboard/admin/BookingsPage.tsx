import React, { useMemo, useState } from 'react';
import { Search, Download, MoreHorizontal, CalendarX } from 'lucide-react';
import { PageHeader, Card, BookingBadge, PaymentBadge, EmptyState, inr } from '../../../components/dashboard/shared';
import { bookings, type BookingStatus } from '../../../data/mock';

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function BookingsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== 'all' && b.status !== filter) return false;
      if (!q) return true;
      return (
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.product.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <div>
      <PageHeader
        title="All"
        accent="Bookings."
        subtitle="Track, filter and manage every booking on the platform."
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide border border-neutral-200 hover:bg-neutral-50 transition-colors rounded-xl">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      <Card>
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, customer, product…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  filter === f.value
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-500 border border-neutral-200/70 hover:bg-neutral-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon={CalendarX} title="No bookings found" subtitle="Try a different search term or status filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[820px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Booking</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Qty</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-indigo-600">#{b.id}</div>
                      <div className="text-xs text-neutral-400">{b.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{b.customer}</div>
                      <div className="text-xs text-neutral-400">{b.email}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{b.product}</td>
                    <td className="px-6 py-4 font-semibold">{b.qty}</td>
                    <td className="px-6 py-4"><BookingBadge status={b.status} /></td>
                    <td className="px-6 py-4"><PaymentBadge status={b.payment} /></td>
                    <td className="px-6 py-4 text-right font-black">{inr(b.amount)}</td>
                    <td className="px-4 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors" aria-label="Actions">
                        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-semibold">
          <span>Showing {filtered.length} of {bookings.length} bookings</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500">Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
