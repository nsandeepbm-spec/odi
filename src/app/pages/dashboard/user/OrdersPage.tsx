import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, AlertCircle, ShoppingBag, Clock, Search, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  PageHeader,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
  userOrderStatusDisplay,
} from '../../../components/dashboard/shared';
import { listMyOrders, type UserOrder, type UserOrderStatus } from '../../../lib/api';

type Tab = 'all' | 'awaiting' | 'active' | 'past' | 'cancelled';

const TABS: { label: string; value: Tab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Awaiting Payment', value: 'awaiting' },
  { label: 'Active', value: 'active' },
  { label: 'Delivered', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
];

const ACTIVE: UserOrderStatus[] = ['paid', 'processing', 'shipped'];

/** pending + razorpay_order_id = user started online checkout but never paid */
function isAwaitingPayment(o: UserOrder) {
  return o.status === 'pending' && !!o.razorpay_order_id;
}
/** pending + no razorpay_order_id = COD, show normally */
function isCodPending(o: UserOrder) {
  return o.status === 'pending' && !o.razorpay_order_id;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function orderLabel(o: UserOrder) {
  return o.order_number ?? o.id.slice(0, 8).toUpperCase();
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

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
    let list: UserOrder[];
    switch (tab) {
      case 'awaiting':  list = orders.filter(isAwaitingPayment); break;
      case 'active':    list = orders.filter((o) => ACTIVE.includes(o.status) || isCodPending(o)); break;
      case 'past':      list = orders.filter((o) => o.status === 'delivered'); break;
      case 'cancelled': list = orders.filter((o) => ['cancelled', 'refunded'].includes(o.status)); break;
      default:          list = orders;
    }

    const q = query.trim().toLowerCase().replace(/^#/, '');
    if (!q) return list;

    return list.filter((o) => {
      const number = (o.order_number ?? '').toLowerCase();
      const id = o.id.toLowerCase();
      const shortId = o.id.slice(0, 8).toLowerCase();
      return number.includes(q) || id.includes(q) || shortId.includes(q);
    });
  }, [tab, orders, query]);

  const counts = useMemo(() => ({
    all:       orders.length,
    awaiting:  orders.filter(isAwaitingPayment).length,
    active:    orders.filter((o) => ACTIVE.includes(o.status) || isCodPending(o)).length,
    past:      orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => ['cancelled', 'refunded'].includes(o.status)).length,
  }), [orders]);

  if (loading) return <DashboardSkeleton cols={6} rows={7} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load orders</p>
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
        eyebrow="Purchase Records"
        title="Order"
        accent="History."
        subtitle="Every order you've placed, with live status."
      />

      <Card className="relative z-10">
        <div className="px-5 pt-4 pb-4 flex flex-col gap-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 w-full sm:max-w-md px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-[#111113] focus-within:border-white/[0.15] transition-colors">
            <Search className="w-3.5 h-3.5 shrink-0 text-neutral-600" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-600 text-neutral-200"
              aria-label="Search orders by order ID"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-0.5 rounded text-neutral-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {TABS.map((t) => {
              const count = counts[t.value];
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTab(t.value)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    tab === t.value
                      ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                      : 'bg-transparent text-neutral-400 border border-white/[0.04] hover:bg-white/[0.04] hover:text-neutral-200'
                  }`}
                >
                  {t.label}
                  {count > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      tab === t.value ? 'bg-white/10 text-cyan-400' : 'bg-white/[0.04] text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders here"
            subtitle={
              query.trim()
                ? 'No orders match that order ID.'
                : tab === 'all'
                  ? 'Place your first order to see it here.'
                  : 'No orders matching this filter.'
            }
          />
        ) : (
          <>
            {/* Mobile / tablet card list */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((o) => {
                const awaiting = isAwaitingPayment(o);
                const statusDisplay = userOrderStatusDisplay(o);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => navigate(`/dashboard/orders/${o.id}`)}
                    className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors ${
                      awaiting ? 'bg-amber-500/[0.03] active:bg-amber-500/[0.06]' : 'active:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      awaiting
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-white/[0.03] border-white/[0.05]'
                    }`}>
                      {awaiting
                        ? <Clock className="w-4 h-4 text-amber-400" />
                        : <FileText className="w-4 h-4 text-neutral-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-black text-sm truncate ${awaiting ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {orderLabel(o)}
                        </span>
                        <span className="font-black text-sm text-white shrink-0">{inrFromPaise(o.total_paise)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-xs text-neutral-400 font-medium">{formatDate(o.created_at)}</span>
                        {awaiting ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black tracking-widest uppercase shrink-0">
                            <Clock className="w-2.5 h-2.5" /> Awaiting
                          </span>
                        ) : (
                          <span className="shrink-0"><OrderBadge status={statusDisplay.badgeStatus} label={statusDisplay.label} /></span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[640px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((o) => {
                  const awaiting = isAwaitingPayment(o);
                  const statusDisplay = userOrderStatusDisplay(o);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/dashboard/orders/${o.id}`)}
                      className={`transition-colors group cursor-pointer ${awaiting ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.06]' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                            awaiting
                              ? 'bg-amber-500/10 border-amber-500/20'
                              : 'bg-white/[0.03] border-white/[0.05]'
                          }`}>
                            {awaiting
                              ? <Clock className="w-4 h-4 text-amber-400" />
                              : <FileText className="w-4 h-4 text-neutral-500" />
                            }
                          </div>
                          <span className={`font-black transition-colors ${
                            awaiting
                              ? 'text-amber-400 group-hover:text-amber-300'
                              : 'text-cyan-400 group-hover:text-cyan-300'
                          }`}>
                            {orderLabel(o)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-medium">{formatDate(o.created_at)}</td>
                      <td className="px-6 py-4">
                        {awaiting ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black tracking-widest uppercase">
                            <Clock className="w-3 h-3" /> Awaiting Payment
                          </span>
                        ) : (
                          <OrderBadge status={statusDisplay.badgeStatus} label={statusDisplay.label} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-white">{inrFromPaise(o.total_paise)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 group-hover:text-cyan-400 transition-colors">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
