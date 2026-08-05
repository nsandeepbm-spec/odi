import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Package,
  Truck,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { displayName, useAuth } from '../../../lib/auth';
import { listMyOrders, type UserOrder, type UserOrderStatus } from '../../../lib/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const ORDER_STEPS: { key: UserOrderStatus; label: string }[] = [
  { key: 'paid', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

function stepIndex(status: UserOrderStatus): number {
  return ORDER_STEPS.findIndex((s) => s.key === status);
}

const ACTIVE_STATUSES: UserOrderStatus[] = ['paid', 'processing', 'shipped'];

// ─── Component ───────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listMyOrders(1, 20)
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

  const firstName = user ? displayName(user).split(' ')[0] : 'there';
  const activeOrder = orders.find((o) => ACTIVE_STATUSES.includes(o.status));
  const totalSpent = orders
    .filter((o) => !['pending', 'cancelled', 'refunded'].includes(o.status))
    .reduce((s, o) => s + o.total_paise, 0);
  const recentOrders = orders.slice(0, 5);

  if (loading) return <DashboardSkeleton cols={5} rows={6} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load your orders</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <PageHeader
        eyebrow={greeting}
        title="Welcome back,"
        accent={firstName}
        subtitle="Here's a live summary of your orders and activity."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl"
          >
            Browse Books <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        <StatCard label="Total Orders"  value={String(orders.length)}         icon={Package}    delay={0} />
        <StatCard label="In Transit"    value={String(orders.filter((o) => o.status === 'shipped').length)} icon={Truck} delay={0.06} />
        <StatCard label="Total Spent"   value={inrFromPaise(totalSpent)}       icon={CreditCard} delay={0.12} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 relative z-10">
        {/* Active shipment tracker */}
        <Card title="Active Shipment" className="xl:col-span-2">
          {activeOrder ? (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <p className="font-black text-base tracking-tight text-white">
                    Order #{activeOrder.order_number ?? activeOrder.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                    Placed {formatDate(activeOrder.created_at)} · {inrFromPaise(activeOrder.total_paise)}
                  </p>
                </div>
                <OrderBadge status={activeOrder.status} />
              </div>

              {/* Progress stepper */}
              <div className="flex items-center">
                {ORDER_STEPS.map((step, i) => {
                  const current = stepIndex(activeOrder.status);
                  const done = i <= current;
                  const isActive = i === current;
                  return (
                    <React.Fragment key={step.key}>
                      {i > 0 && (
                        <div className={`flex-1 h-0.5 ${done ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' : 'bg-white/[0.06]'}`} />
                      )}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          done
                            ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 border-transparent shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                            : 'bg-[#0A0A0A] border-white/10'
                        } ${isActive ? 'ring-4 ring-cyan-500/20' : ''}`}>
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-white/10" />
                          )}
                        </div>
                        <span className={`text-[9px] font-bold tracking-wider uppercase whitespace-nowrap ${
                          done ? 'text-white' : 'text-neutral-600'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {activeOrder.shipping_address?.city && (
                <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                  Delivering to {activeOrder.shipping_address.city}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Truck}
              title="No active shipments"
              subtitle="Your next order will appear here once it's confirmed."
            />
          )}
        </Card>

        {/* Promo card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl shadow-black/40 bg-[#0A0A0A] p-6 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-indigo-500/5 to-purple-600/5 pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black tracking-tight text-xl leading-tight mb-2 text-white">
            Ocean Explorer is{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              coming.
            </span>
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed flex-1">
            Vol. 02 dives into glowing coral reefs and ocean giants. Be the first to know when it launches.
          </p>
          <button className="mt-5 w-full py-3 text-sm font-semibold tracking-wide border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors text-neutral-300">
            Notify Me
          </button>
        </motion.div>
      </div>

      {/* Recent orders */}
      <Card
        className="relative z-10"
        title="Recent Orders"
        action={
          <Link to="/dashboard/orders" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {recentOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            subtitle="Your orders will appear here after your first purchase."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[540px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-black text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      #{o.order_number ?? o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-medium">{formatDate(o.created_at)}</td>
                    <td className="px-6 py-4"><OrderBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-right font-black text-white">{inrFromPaise(o.total_paise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
