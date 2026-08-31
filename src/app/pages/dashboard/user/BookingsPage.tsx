import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Package, CheckCircle2, AlertCircle, CalendarX, MapPin, Loader2, Search, X } from 'lucide-react';
import {
  PageHeader,
  Card,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { OrderProgressStepper } from '../../../components/dashboard/OrderProgressStepper';
import { ShipmentStatusChip } from '../../../components/dashboard/ShipmentStatusChip';
import { BookingDetailDrawer } from '../../../components/dashboard/BookingDetailDrawer';
import {
  listMyOrders,
  type UserOrder,
  type UserOrderStatus,
  type ShipmentTracking,
} from '../../../lib/api';
import { useOrdersTracking } from '../../../lib/useOrdersTracking';
import { deliveryLocationLine, isInTransitPhase, resolveShipmentPhase } from '../../../lib/shipmentStatus';

type Tab = 'active' | 'delivered' | 'all';

const TABS: { label: string; value: Tab }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'All', value: 'all' },
];

const ACTIVE_STATUSES: UserOrderStatus[] = ['paid', 'processing', 'shipped'];

/** pending + no razorpay_order_id = placed COD order (not an unpaid checkout). */
function isCodPending(o: UserOrder) {
  return o.status === 'pending' && !o.razorpay_order_id;
}

function isActiveBooking(o: UserOrder) {
  return ACTIVE_STATUSES.includes(o.status) || isCodPending(o);
}

function isUnpaidOnline(o: UserOrder) {
  return o.status === 'pending' && !!o.razorpay_order_id;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function matchesSearch(order: UserOrder, query: string): boolean {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  if (!q) return true;
  const number = (order.order_number ?? '').toLowerCase();
  const id = order.id.toLowerCase();
  const waybill = (order.delhivery_waybill ?? '').toLowerCase();
  return number.includes(q) || id.includes(q) || waybill.includes(q);
}

function BookingRow({
  order,
  tracking,
  trackingLoading,
  onOpen,
}: {
  order: UserOrder;
  tracking?: ShipmentTracking | null;
  trackingLoading?: boolean;
  onOpen: () => void;
}) {
  const locationLine = deliveryLocationLine(order, tracking);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left px-6 py-5 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
            <Package className="w-4.5 h-4.5 text-neutral-500" />
          </div>
          <div>
            <p className="font-black text-white text-sm tracking-tight">
              Order #{order.order_number}
            </p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">
              {formatDate(order.created_at)} · {inrFromPaise(order.total_paise)}
            </p>
            {order.delhivery_waybill && (
              <p className="text-[10px] text-neutral-600 font-medium mt-0.5">
                AWB {order.delhivery_waybill}
              </p>
            )}
          </div>
        </div>
        <ShipmentStatusChip order={order} tracking={tracking} />
      </div>

      {isActiveBooking(order) && (
        <div className="mb-4 mt-2 pointer-events-none">
          <OrderProgressStepper order={order} tracking={tracking} compact />
        </div>
      )}

      {order.status === 'delivered' && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Delivered on {formatDate(order.updated_at ?? order.created_at)}
        </div>
      )}

      {trackingLoading && order.delhivery_waybill ? (
        <p className="text-[11px] text-neutral-600 font-medium mt-1.5 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" /> Updating location…
        </p>
      ) : locationLine ? (
        <p className="text-[11px] text-neutral-400 font-medium mt-1.5 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-cyan-400/80 shrink-0" />
          {tracking?.statusLocation ? `Latest · ${locationLine}` : locationLine}
        </p>
      ) : null}

      <p className="text-[10px] font-bold text-cyan-400/80 mt-3 uppercase tracking-widest">
        Tap for route →
      </p>
    </button>
  );
}

export default function BookingsPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('active');
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [trackingOverrides, setTrackingOverrides] = useState<Record<string, ShipmentTracking>>({});

  useEffect(() => {
    let cancelled = false;
    listMyOrders(1, 50)
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

  const { trackingMap: fetchedTracking, trackingLoading } = useOrdersTracking(orders);

  const trackingMap = useMemo(
    () => ({ ...fetchedTracking, ...trackingOverrides }),
    [fetchedTracking, trackingOverrides],
  );

  const filtered = useMemo(() => {
    let list: UserOrder[];
    switch (tab) {
      case 'active':
        list = orders.filter(isActiveBooking);
        break;
      case 'delivered':
        list = orders.filter((o) => o.status === 'delivered');
        break;
      default:
        list = orders.filter(
          (o) => !['cancelled', 'refunded'].includes(o.status) && !isUnpaidOnline(o)
        );
    }
    if (!query.trim()) return list;
    return list.filter((o) => matchesSearch(o, query));
  }, [tab, orders, query]);

  const phaseByOrderId = useMemo(() => {
    const map: Record<string, ReturnType<typeof resolveShipmentPhase>> = {};
    for (const o of orders) {
      map[o.id] = resolveShipmentPhase(o, trackingMap[o.id]);
    }
    return map;
  }, [orders, trackingMap]);

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

  const activeCount = orders.filter(isActiveBooking).length;
  const selectedTracking = selectedOrder ? trackingMap[selectedOrder.id] : null;
  const inTransitCount = orders.filter((o) => isInTransitPhase(phaseByOrderId[o.id])).length;
  const processingCount = orders.filter((o) => {
    const p = phaseByOrderId[o.id];
    return p === 'preparing' || p === 'ready_to_ship';
  }).length;

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
        subtitle="Tap any booking to see the delivery route — location by location."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 relative z-10">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package },
          { label: 'In Transit', value: inTransitCount, icon: Truck },
          { label: 'Processing', value: processingCount, icon: Package },
          {
            label: 'Delivered',
            value: orders.filter((o) => o.status === 'delivered').length,
            icon: CheckCircle2,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-4 flex items-center gap-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
              <stat.icon className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-500">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Card className="relative z-10">
        <div className="px-5 pt-4 pb-4 flex flex-col gap-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 max-w-md px-3.5 py-2.5 rounded-xl border border-white/[0.07] bg-[#111113] focus-within:border-white/[0.15] transition-colors">
            <Search className="w-3.5 h-3.5 shrink-0 text-neutral-600" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID or AWB…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-600 text-neutral-200"
              aria-label="Search bookings by order ID or waybill"
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
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  tab === t.value
                    ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                    : 'bg-transparent text-neutral-400 border border-white/[0.04] hover:bg-white/[0.04] hover:text-neutral-200'
                }`}
              >
                {t.label}
                {t.value === 'active' && activeCount > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      tab === 'active'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/[0.04] text-neutral-500'
                    }`}
                  >
                    {activeCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={query.trim() ? 'No matching bookings' : 'No bookings here'}
            subtitle={
              query.trim()
                ? `No results for "${query.trim()}". Try order number or AWB.`
                : tab === 'active'
                  ? 'You have no active orders right now.'
                  : 'No orders match this filter.'
            }
          />
        ) : (
          <div>
            {filtered.map((o) => (
              <BookingRow
                key={o.id}
                order={o}
                tracking={trackingMap[o.id]}
                trackingLoading={
                  trackingLoading && Boolean(o.delhivery_waybill) && !trackingMap[o.id]
                }
                onOpen={() => setSelectedOrder(o)}
              />
            ))}
          </div>
        )}
      </Card>

      {selectedOrder && (
        <BookingDetailDrawer
          order={selectedOrder}
          tracking={selectedTracking}
          trackingLoading={
            trackingLoading &&
            Boolean(selectedOrder.delhivery_waybill) &&
            !selectedTracking
          }
          onClose={() => setSelectedOrder(null)}
          onTrackingUpdated={(t) => {
            if (t) setTrackingOverrides((prev) => ({ ...prev, [selectedOrder.id]: t }));
          }}
        />
      )}
    </motion.div>
  );
}
