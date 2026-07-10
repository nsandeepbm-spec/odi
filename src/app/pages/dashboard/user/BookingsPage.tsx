import React, { useMemo, useState } from 'react';
import { CalendarX } from 'lucide-react';
import { PageHeader, Card, BookingBadge, PaymentBadge, EmptyState, inr } from '../../../components/dashboard/shared';
import { myBookings } from '../../../data/mock';

type Tab = 'all' | 'active' | 'past' | 'cancelled';

const TABS: { label: string; value: Tab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Past', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    switch (tab) {
      case 'active':
        return myBookings.filter((b) => ['confirmed', 'processing', 'shipped'].includes(b.status));
      case 'past':
        return myBookings.filter((b) => b.status === 'delivered');
      case 'cancelled':
        return myBookings.filter((b) => b.status === 'cancelled');
      default:
        return myBookings;
    }
  }, [tab]);

  return (
    <div>
      <PageHeader
        title="My"
        accent="Bookings."
        subtitle="Track every booking you've made, past and present."
      />

      <Card>
        {/* Tabs */}
        <div className="px-5 pt-4 flex gap-1.5 border-b border-neutral-100 pb-4">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                tab === t.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-500 border border-neutral-200/70 hover:bg-neutral-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={CalendarX} title="Nothing here yet" subtitle="Bookings matching this filter will show up here." />
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((b) => (
              <div key={b.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-neutral-50/70 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-black tracking-tight">{b.product}</p>
                    <BookingBadge status={b.status} />
                  </div>
                  <p className="text-xs text-neutral-400 font-semibold mt-1">
                    #{b.id} · {b.date} · Qty {b.qty}
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <PaymentBadge status={b.payment} />
                  <span className="font-black text-lg">{inr(b.amount)}</span>
                  <button className="px-4 py-2 text-xs font-bold border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
