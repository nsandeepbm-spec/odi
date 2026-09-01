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
  MapPin,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { OrderProgressStepper } from '../../../components/dashboard/OrderProgressStepper';
import { ShipmentStatusChip } from '../../../components/dashboard/ShipmentStatusChip';
import { displayName, useAuth } from '../../../lib/auth';
import {
  getMyOrderTracking,
  listMyOrders,
  type UserOrder,
  type UserOrderStatus,
  type ShipmentTracking,
} from '../../../lib/api';
import { deliveryLocationLine } from '../../../lib/shipmentStatus';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const ACTIVE_STATUSES: UserOrderStatus[] = ['paid', 'processing', 'shipped'];

export default function OverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTracking, setActiveTracking] = useState<ShipmentTracking | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listMyOrders(1, 20)
      .then((res) => {
        if (!cancelled) {
          setOrders(res.orders);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeOrder = orders.find((o) => ACTIVE_STATUSES.includes(o.status));

  useEffect(() => {
    if (!activeOrder?.delhivery_waybill) {
      setActiveTracking(null);
      return;
    }
    let cancelled = false;
    setTrackingLoading(true);
    getMyOrderTracking(activeOrder.id)
      .then((t) => {
        if (!cancelled) setActiveTracking(t);
      })
      .catch(() => {
        if (!cancelled) setActiveTracking(null);
      })
      .finally(() => {
        if (!cancelled) setTrackingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeOrder?.id, activeOrder?.delhivery_waybill]);

  const totalSpent = orders
    .filter((o) => !['pending', 'cancelled', 'refunded'].includes(o.status))
    .reduce((s, o) => s + o.total_paise, 0);
  const recentOrders = orders.slice(0, 5);
  const inTransitCount = orders.filter(
    (o) => o.status === 'shipped' || activeTracking?.status?.toLowerCase().includes('transit')
  ).length;

  if (loading) return <DashboardSkeleton cols={5} rows={6} />;

  if (error) {
    return (
      <div className="min-w-0 bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-6 sm:p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load your orders</p>
        <p className="text-xs text-neutral-400 max-w-sm break-words">{error}</p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const locationLine = activeOrder ? deliveryLocationLine(activeOrder, activeTracking) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-w-0"
    >
      <PageHeader
        eyebrow={greeting}
        title="Welcome back,"
        accent={user ? displayName(user).split(' ')[0] : 'there'}
        subtitle="Here's a live summary of your orders and activity."
        action={
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] sm:hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl"
          >
            Browse Books <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10 min-w-0">
        <StatCard label="Total Orders" value={String(orders.length)} icon={Package} delay={0} />
        <StatCard label="In Transit" value={String(inTransitCount)} icon={Truck} delay={0.06} />
        <StatCard label="Total Spent" value={inrFromPaise(totalSpent)} icon={CreditCard} delay={0.12} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 relative z-10 min-w-0">
        <Card title="Active Shipment" className="xl:col-span-2 min-w-0">
          {activeOrder ? (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 min-w-0">
                <div className="min-w-0">
                  <Link
                    to={`/dashboard/orders/${activeOrder.id}`}
                    className="font-black text-base tracking-tight text-white hover:text-cyan-300 transition-colors break-all"
                  >
                    Order #{activeOrder.order_number}
                  </Link>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                    Placed {formatDate(activeOrder.created_at)} · {inrFromPaise(activeOrder.total_paise)}
                  </p>
                </div>
                <ShipmentStatusChip order={activeOrder} tracking={activeTracking} />
              </div>

              <OrderProgressStepper order={activeOrder} tracking={activeTracking} />

              {trackingLoading ? (
                <p className="mt-6 text-xs text-neutral-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating live location…
                </p>
              ) : locationLine ? (
                <div className="mt-6 flex items-start gap-2 text-xs text-neutral-400 font-medium min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="break-words min-w-0">
                    {activeTracking?.statusLocation ? 'Latest update' : 'Delivering to'} · {locationLine}
                  </span>
                </div>
              ) : activeOrder.shipping_address?.city ? (
                <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                  Delivering to {activeOrder.shipping_address.city}
                  {activeOrder.shipping_address.postal_code
                    ? ` – ${activeOrder.shipping_address.postal_code}`
                    : ''}
                </div>
              ) : null}

              <Link
                to={`/dashboard/orders/${activeOrder.id}`}
                className="inline-flex mt-5 text-xs font-bold text-cyan-400 hover:underline"
              >
                View order & tracking →
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={Truck}
              title="No active shipments"
              subtitle="Your next order will appear here once it's confirmed."
            />
          )}
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl shadow-black/40 bg-[#0A0A0A] p-4 sm:p-6 flex flex-col min-w-0"
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

      <Card
        className="relative z-10 min-w-0"
        title="Recent Orders"
        action={
          <Link
            to="/dashboard/orders"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
          >
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
          <>
            <div className="md:hidden divide-y divide-white/[0.04]">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/dashboard/orders/${o.id}`}
                  className="flex items-center gap-3 px-4 py-4 active:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm text-cyan-400 truncate">#{o.order_number}</span>
                      <span className="font-black text-sm text-white shrink-0">
                        {inrFromPaise(o.total_paise)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <span className="text-xs text-neutral-500 font-medium truncate">
                        {formatDate(o.created_at)}
                      </span>
                      <span className="shrink-0">
                        <ShipmentStatusChip order={o} />
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </Link>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[540px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <Link
                          to={`/dashboard/orders/${o.id}`}
                          className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors"
                        >
                          #{o.order_number}
                        </Link>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-neutral-400 font-medium">
                        {formatDate(o.created_at)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <ShipmentStatusChip order={o} />
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right font-black text-white">
                        {inrFromPaise(o.total_paise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
