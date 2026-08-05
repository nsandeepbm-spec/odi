import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Package, CheckCircle2, AlertCircle, CalendarX } from 'lucide-react';
import {
  PageHeader,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { listMyOrders, type UserOrder, type UserOrderStatus } from '../../../lib/api';

type Tab = 'active' | 'delivered' | 'all';

const TABS: { label: string; value: Tab }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'All', value: 'all' },
];

const ACTIVE_STATUSES: UserOrderStatus[] = ['paid', 'processing', 'shipped'];

const ORDER_STEPS: { key: UserOrderStatus; label: string }[] = [
  { key: 'paid', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

function stepIndex(status: UserOrderStatus): number {
  return ORDER_STEPS.findIndex((s) => s.key === status);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Single booking row with tracker ─────────────────────────────────────────

function BookingRow({ order }: { order: UserOrder }) {
  const current = stepIndex(order.status);

  return (
    <div className="px-6 py-5 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
            <Package className="w-4.5 h-4.5 text-neutral-500" />
          </div>
          <div>
            <p className="font-black text-white text-sm tracking-tight">
              Order #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">
              {formatDate(order.created_at)} · {inrFromPaise(order.total_paise)}
            </p>
          </div>
        </div>
        <OrderBadge status={order.status} />
      </div>

      {/* Progress stepper — shown only for in-progress orders */}
      {ACTIVE_STATUSES.includes(order.status) && (
        <div className="flex items-center mb-4 mt-2">
          {ORDER_STEPS.map((step, i) => {
            const done = i <= current;
            const isActive = i === current;
            return (
              <React.Fragment key={step.key}>
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 ${done ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' : 'bg-white/[0.06]'}`}
                  />
                )}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      done
                        ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 border-transparent shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                        : 'bg-[#0A0A0A] border-white/[0.08]'
                    } ${isActive ? 'ring-4 ring-cyan-500/20' : ''}`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/[0.08]" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold tracking-wider uppercase whitespace-nowrap ${
                      done ? 'text-neutral-200' : 'text-neutral-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Delivered indicator */}
      {order.status === 'delivered' && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Delivered on {formatDate(order.updated_at ?? order.created_at)}
        </div>
      )}

      {order.shipping_address?.city && (
        <p className="text-[11px] text-neutral-600 font-medium mt-1.5">
          📍 {order.shipping_address.city}
          {order.shipping_address.postal_code ? ` – ${order.shipping_address.postal_code}` : ''}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('active');

  useEffect(() => {
    let cancelled = false;
    listMyOrders(1, 50)
      .then((res) => {
        if (!cancelled) { setOrders(res.orders); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'active':    return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
      case 'delivered': return orders.filter((o) => o.status === 'delivered');
      default:          return orders.filter((o) => !['cancelled', 'refunded', 'pending'].includes(o.status));
    }
  }, [tab, orders]);

  if (loading) return <DashboardSkeleton cols={5} rows={5} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load bookings</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
      </div>
    );
  }

  const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <PageHeader
        eyebrow="Shipment Tracking"
        title="My"
        accent="Bookings."
        subtitle="Track every order you've placed, past and present."
      />

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 relative z-10">
        {[
          { label: 'Total Orders',  value: orders.length,                                                   icon: Package },
          { label: 'In Transit',    value: orders.filter((o) => o.status === 'shipped').length,             icon: Truck },
          { label: 'Processing',    value: orders.filter((o) => ['paid','processing'].includes(o.status)).length, icon: Package },
          { label: 'Delivered',     value: orders.filter((o) => o.status === 'delivered').length,           icon: CheckCircle2 },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-4 flex items-center gap-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
              <stat.icon className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="relative z-10">
        {/* Tabs */}
        <div className="px-5 pt-4 pb-4 flex gap-1.5 border-b border-white/[0.04] flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                tab === t.value
                  ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                  : 'bg-transparent text-neutral-400 border border-white/[0.04] hover:bg-white/[0.04] hover:text-neutral-200'
              }`}
            >
              {t.label}
              {t.value === 'active' && activeCount > 0 && (
                <span className={`ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  tab === 'active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.04] text-neutral-500'
                }`}>
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No bookings here"
            subtitle={tab === 'active' ? 'You have no active orders right now.' : 'No orders match this filter.'}
          />
        ) : (
          <div>
            {filtered.map((o) => (
              <BookingRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
