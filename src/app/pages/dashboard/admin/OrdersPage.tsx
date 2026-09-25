import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Download, CalendarX, Eye, ChevronRight, Package, RefreshCw } from 'lucide-react';
import {
  Card,
  PaymentBadge,
  EmptyState,
  inrFromPaise,
  TableSkeleton,
  OrderBadge,
  adminDeliveryStatusDisplay,
  adminOrderStatusDisplay,
} from '../../../components/dashboard/shared';
import { listAdminOrders, type AdminOrder } from '../../../lib/api';
import { downloadCsv } from '../../../lib/csv';

const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

const DELIVERY_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAYMENT_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Incomplete', value: 'incomplete_payment' },
  { label: 'Abandoned', value: 'abandoned_payment' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DATE_PRESETS: { label: string; range: () => { from: string; to: string } }[] = [
  {
    label: 'Today',
    range: () => {
      const t = isoDate(new Date());
      return { from: t, to: t };
    },
  },
  {
    label: '7 days',
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 6);
      return { from: isoDate(from), to: isoDate(to) };
    },
  },
  {
    label: '30 days',
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 29);
      return { from: isoDate(from), to: isoDate(to) };
    },
  },
  {
    label: 'This month',
    range: () => {
      const now = new Date();
      return { from: isoDate(new Date(now.getFullYear(), now.getMonth(), 1)), to: isoDate(now) };
    },
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isCodOrder(order: AdminOrder) {
  if (order.channel === 'BULK_OFFLINE') return false;
  if (order.payments?.some((p) => p.provider === 'cod')) return true;
  // Online COD has no Razorpay order id (unpaid Razorpay attempts always have one).
  return !order.razorpay_order_id && order.payment_lifecycle == null;
}

function paymentDisplay(order: AdminOrder): { status: 'paid' | 'pending' | 'refunded' | 'failed'; label: string } {
  const lifecycle = adminOrderStatusDisplay(order).label;
  if (lifecycle === 'Incomplete payment') return { status: 'pending', label: 'Incomplete' };
  if (lifecycle === 'Abandoned payment') return { status: 'failed', label: 'Abandoned' };
  const raw = order.payments?.[0]?.status || '';
  if (raw === 'refunded' || order.status === 'refunded') return { status: 'refunded', label: 'Refunded' };
  if (raw === 'failed') return { status: 'failed', label: 'Failed' };

  if (isCodOrder(order)) {
    const codPay = order.payments?.find((p) => p.provider === 'cod');
    const collected =
      Boolean(order.paid_at) ||
      codPay?.status === 'captured' ||
      codPay?.status === 'paid';
    // Delivered via Delhivery means cash was collected at the door (even if settle lag).
    if (collected || order.status === 'delivered') {
      return { status: 'paid', label: 'COD collected' };
    }
    return { status: 'pending', label: 'COD due' };
  }

  if (raw === 'captured' || raw === 'paid' || order.paid_at) return { status: 'paid', label: 'Paid' };
  if (order.channel === 'BULK_OFFLINE') {
    return {
      status: 'pending',
      label: order.bulk_payment_method ? `Due · ${order.bulk_payment_method}` : 'Bulk pending',
    };
  }
  return { status: 'pending', label: 'Pending' };
}

function orderDetailPath(order: AdminOrder) {
  return order.channel === 'BULK_OFFLINE'
    ? `/dashboard/admin/bulk-orders/${order.id}`
    : `/dashboard/admin/orders/${order.id}`;
}

function customerLabel(order: AdminOrder) {
  const org = order.shipping_address?.organization_name?.trim();
  if (org) return org;
  return (
    [order.shipping_address?.first_name, order.shipping_address?.last_name].filter(Boolean).join(' ') ||
    'Customer'
  );
}

export default function OrdersPage() {
  const [query, setQuery] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiStatus =
        paymentFilter === 'incomplete_payment' || paymentFilter === 'abandoned_payment'
          ? paymentFilter
          : deliveryFilter !== 'all'
            ? deliveryFilter
            : undefined;
      const result = await listAdminOrders(1, 100, apiStatus, {
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      setOrders(result.orders);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [deliveryFilter, paymentFilter, dateFrom, dateTo]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const pay = paymentDisplay(o);
      if (paymentFilter === 'paid' && pay.status !== 'paid') return false;
      if (
        paymentFilter === 'pending' &&
        pay.label !== 'Pending' &&
        pay.label !== 'COD' &&
        pay.label !== 'COD due'
      ) {
        return false;
      }
      if (paymentFilter === 'failed' && pay.status !== 'failed') return false;
      if (paymentFilter === 'refunded' && pay.status !== 'refunded') return false;
      if (
        deliveryFilter !== 'all' &&
        paymentFilter !== 'incomplete_payment' &&
        paymentFilter !== 'abandoned_payment' &&
        o.status !== deliveryFilter &&
        adminDeliveryStatusDisplay(o).badgeStatus !== deliveryFilter
      ) {
        return false;
      }
      if (!q) return true;
      const customer = customerLabel(o).toLowerCase();
      const email = (o.shipping_address?.email || '').toLowerCase();
      const channel = (o.channel || '').toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        email.includes(q) ||
        channel.includes(q) ||
        (q === 'bulk' && o.channel === 'BULK_OFFLINE')
      );
    });
  }, [query, deliveryFilter, paymentFilter, orders]);

  const exportCsv = () => {
    if (filtered.length === 0) {
      alert('No orders match the current filters to export.');
      return;
    }
    const headers = [
      'Order Number',
      'Date',
      'Channel',
      'Customer',
      'Email',
      'Product',
      'Qty',
      'Status',
      'Payment Status',
      'Amount (INR)',
      'Waybill',
      'Order ID',
    ];
    const rows = filtered.map((o) => {
      const customer = customerLabel(o);
      const email = o.shipping_address?.email || '';
      const item = o.order_items?.[0];
      const payment = o.payments?.[0];
      return [
        o.order_number,
        formatDate(o.created_at),
        o.channel === 'BULK_OFFLINE' ? 'BULK_OFFLINE' : 'ONLINE',
        customer,
        email,
        item?.snapshot_name || '',
        item?.quantity ?? '',
        o.status,
        payment?.status || '',
        (o.total_paise / 100).toFixed(2),
        o.delhivery_waybill || '',
        o.id,
      ];
    });
    const stamp = new Date().toISOString().slice(0, 10);
    const range = [dateFrom || 'all', dateTo || 'all'].join('_to_');
    downloadCsv(`odi-orders_${range}_${stamp}.csv`, headers, rows);
  };

  return (
    <div className="min-w-0">
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                <Package className="w-3 h-3" />
                Online store
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Delhivery
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => void loadOrders()}
                disabled={loading}
                aria-label="Refresh orders"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold tracking-wide border border-neutral-500/70 text-white bg-black/40 hover:bg-white/[0.04] hover:border-neutral-400 transition-all rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={loading || filtered.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold tracking-wide border border-neutral-500/70 text-white bg-black/40 hover:bg-white/[0.04] hover:border-neutral-400 transition-all rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            All{' '}
            <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Orders.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
            Delivery is the courier status. Payment is separate. Dates are the order placed date (India time).
          </p>
        </div>
      </header>

      {paymentFilter === 'incomplete_payment' && (
        <div className="mb-4 relative z-10 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          <p className="font-bold text-amber-200">Incomplete payment</p>
          <p className="text-xs mt-1 text-amber-100/70 leading-relaxed">
            Razorpay may have charged the customer while this order stayed pending. Open the order →{' '}
            <span className="font-bold text-amber-100">Sync payment from Razorpay</span> to mark it
            paid (stock, email, shipment).
          </p>
        </div>
      )}

      <Card className={`relative z-10 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-500/40 flex flex-col gap-3 bg-[#0d0d0d]">
          <div className="flex flex-col xl:flex-row xl:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[#111] border border-neutral-500 shadow-inner focus-within:border-cyan-400 transition-colors">
              <Search className="w-4 h-4 text-neutral-300 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, customer, email…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400 text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 w-full xl:w-auto xl:justify-end min-w-0">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 p-1 rounded-xl bg-[#111] border border-neutral-600 w-full sm:w-auto">
                {DATE_PRESETS.map((p) => {
                  const range = p.range();
                  const active = dateFrom === range.from && dateTo === range.to;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setDateFrom(range.from);
                        setDateTo(range.to);
                      }}
                      className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                        active
                          ? 'bg-white text-black'
                          : 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#111] border border-neutral-600 w-full sm:w-auto min-w-0">
                <label className="flex items-center gap-2 min-w-0 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  From
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="min-w-0 w-full sm:w-auto bg-transparent text-sm font-semibold normal-case tracking-normal text-white outline-none [color-scheme:dark]"
                  />
                </label>
                <span className="hidden sm:inline text-neutral-500" aria-hidden>
                  –
                </span>
                <label className="flex items-center gap-2 min-w-0 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  To
                  <input
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="min-w-0 w-full sm:w-auto bg-transparent text-sm font-semibold normal-case tracking-normal text-white outline-none [color-scheme:dark]"
                  />
                </label>
              </div>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl text-neutral-200 border border-neutral-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-600 bg-[#111] px-3 py-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 w-full sm:w-auto sm:mr-1">Delivery</span>
              {DELIVERY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setDeliveryFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    deliveryFilter === f.value
                      ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-black/40 text-neutral-300 border border-neutral-600 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-600 bg-[#111] px-3 py-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-200 w-full sm:w-auto sm:mr-1">Payment</span>
              {PAYMENT_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setPaymentFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    paymentFilter === f.value
                      ? 'bg-white text-black'
                      : 'bg-black/40 text-neutral-300 border border-neutral-600 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton cols={8} rows={7} />
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn't load orders" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarX} title="No orders found" subtitle="Try a different search, status, or date range." />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.06]">
              {filtered.map((o) => {
                const customer = customerLabel(o);
                const item = o.order_items?.[0];
                const isBulk = o.channel === 'BULK_OFFLINE';
                const isCod = isCodOrder(o);
                return (
                  <Link
                    key={o.id}
                    to={orderDetailPath(o)}
                    className="flex items-center gap-3 px-4 py-4 active:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-sm text-cyan-400 truncate">{o.order_number}</span>
                        <span className="font-black text-sm text-white shrink-0">
                          {inrFromPaise(o.total_paise)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-1">{customer}</p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {item?.snapshot_name || '—'}
                        {item?.quantity ? ` · ×${item.quantity}` : ''}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mt-2">
                        <span className="text-xs text-neutral-500 font-medium truncate">
                          {formatDate(o.created_at)}
                          {isBulk ? ' · Bulk' : ''}
                          {isCod ? ' · COD' : ''}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isCod && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-amber-500/35 text-amber-300 bg-amber-500/10">
                              COD
                            </span>
                          )}
                          <OrderBadge
                            status={adminDeliveryStatusDisplay(o).badgeStatus}
                            label={adminDeliveryStatusDisplay(o).label}
                          />
                          <PaymentBadge status={paymentDisplay(o).status} label={paymentDisplay(o).label} />
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[860px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-neutral-500/40">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Customer</th>
                    <th className="px-4 lg:px-6 py-4">Product</th>
                    <th className="px-4 lg:px-6 py-4">Qty</th>
                    <th className="px-4 lg:px-6 py-4">Delivery</th>
                    <th className="px-4 lg:px-6 py-4">Payment</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Amount</th>
                    <th className="px-4 py-4 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filtered.map((o) => {
                    const customer = customerLabel(o);
                    const email = o.shipping_address?.email || '—';
                    const item = o.order_items?.[0];
                    const isBulk = o.channel === 'BULK_OFFLINE';
                    const isCod = isCodOrder(o);
                    return (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 lg:px-6 py-4">
                          <Link
                            to={orderDetailPath(o)}
                            className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors hover:underline"
                          >
                            {o.order_number}
                          </Link>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-neutral-500">{formatDate(o.created_at)}</span>
                            {isBulk && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-violet-500/30 text-violet-300 bg-violet-500/10">
                                Bulk
                              </span>
                            )}
                            {isCod && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-amber-500/35 text-amber-300 bg-amber-500/10">
                                COD
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="font-bold text-white">{customer}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">{email}</div>
                        </td>
                        <td
                          className="px-4 lg:px-6 py-4 text-neutral-300 truncate max-w-[150px] font-medium"
                          title={item?.snapshot_name}
                        >
                          {item?.snapshot_name || '—'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 font-black text-white">{item?.quantity || '—'}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <OrderBadge
                            status={adminDeliveryStatusDisplay(o).badgeStatus}
                            label={adminDeliveryStatusDisplay(o).label}
                          />
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <PaymentBadge status={paymentDisplay(o).status} label={paymentDisplay(o).label} />
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right font-black text-white drop-shadow-sm">
                          {inrFromPaise(o.total_paise)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link
                            to={orderDetailPath(o)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                            title="View full details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-neutral-500/40 bg-[#0d0d0d] text-xs text-neutral-500 font-bold tracking-wide">
          <span>
            {loading
              ? '…'
              : `Showing ${filtered.length} of ${orders.length} orders ${
                  !query.trim() && !dateFrom && !dateTo && deliveryFilter === 'all' && paymentFilter === 'all' && total > orders.length
                    ? `(Total: ${total})`
                    : ''
                }`}
          </span>
        </div>
      </Card>
    </div>
  );
}
