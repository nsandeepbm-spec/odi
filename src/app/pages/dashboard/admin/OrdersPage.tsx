import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Download, CalendarX, Eye } from 'lucide-react';
import {
  PageHeader,
  Card,
  PaymentBadge,
  EmptyState,
  inrFromPaise,
  TableSkeleton,
  OrderBadge,
} from '../../../components/dashboard/shared';
import { listAdminOrders, type AdminOrder } from '../../../lib/api';
import { downloadCsv, inDateRange } from '../../../lib/csv';

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function badgeStatus(status: string): 'paid' | 'pending' | 'refunded' | 'failed' {
  if (status === 'captured' || status === 'paid') return 'paid';
  if (status === 'refunded') return 'refunded';
  if (status === 'failed') return 'failed';
  return 'pending';
}

export default function OrdersPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listAdminOrders(1, 100);
        if (!cancelled) {
          setOrders(result.orders);
          setTotal(result.meta.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
          setOrders([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!inDateRange(o.created_at, dateFrom, dateTo)) return false;
      if (!q) return true;
      const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name].join(' ').toLowerCase();
      const email = (o.shipping_address?.email || '').toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        email.includes(q)
      );
    });
  }, [query, filter, orders, dateFrom, dateTo]);

  const exportCsv = () => {
    if (filtered.length === 0) {
      alert('No orders match the current filters to export.');
      return;
    }
    const headers = [
      'Order Number',
      'Date',
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
      const customer =
        [o.shipping_address?.first_name, o.shipping_address?.last_name].filter(Boolean).join(' ') ||
        'Customer';
      const email = o.shipping_address?.email || '';
      const item = o.order_items?.[0];
      const payment = o.payments?.[0];
      return [
        o.order_number,
        formatDate(o.created_at),
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
    <div>
      <PageHeader
        title="All"
        accent="Orders."
        subtitle="Track every order. Status updates automatically from payment and Delhivery."
        action={
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || filtered.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl shadow-lg relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      <Card className="relative z-10">
        <div className="px-6 py-5 border-b border-white/[0.04] flex flex-col gap-4 bg-[#0d0d0d]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md px-4 py-2.5 rounded-xl bg-[#050505] border border-white/[0.06] shadow-inner focus-within:border-white/[0.2] transition-colors">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, customer, email…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
              />
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">To</label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
              />
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="px-3 py-2 text-xs font-bold rounded-xl text-neutral-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  filter === f.value
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton cols={8} rows={7} />
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn't load orders" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarX} title="No orders found" subtitle="Try a different search, status, or date range." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[860px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-4 py-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((o) => {
                  const customer =
                    [o.shipping_address?.first_name, o.shipping_address?.last_name]
                      .filter(Boolean)
                      .join(' ') || 'Customer';
                  const email = o.shipping_address?.email || '—';
                  const item = o.order_items?.[0];
                  const payment = o.payments?.[0];
                  return (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/dashboard/admin/orders/${o.id}`}
                          className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors hover:underline"
                        >
                          {o.order_number}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-0.5">{formatDate(o.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{customer}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{email}</div>
                      </td>
                      <td
                        className="px-6 py-4 text-neutral-300 truncate max-w-[150px] font-medium"
                        title={item?.snapshot_name}
                      >
                        {item?.snapshot_name || '—'}
                      </td>
                      <td className="px-6 py-4 font-black text-white">{item?.quantity || '—'}</td>
                      <td className="px-6 py-4">
                        <OrderBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PaymentBadge status={badgeStatus(payment?.status || 'pending')} />
                      </td>
                      <td className="px-6 py-4 text-right font-black text-white drop-shadow-sm">
                        {inrFromPaise(o.total_paise)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          to={`/dashboard/admin/orders/${o.id}`}
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
        )}

        <div className="px-6 py-5 border-t border-white/[0.04] bg-[#0d0d0d] flex items-center justify-between text-xs text-neutral-500 font-bold tracking-wide">
          <span>
            {loading
              ? '…'
              : `Showing ${filtered.length} of ${orders.length} orders ${
                  !query.trim() && !dateFrom && !dateTo && filter === 'all' && total > orders.length
                    ? `(Total: ${total})`
                    : ''
                }`}
          </span>
        </div>
      </Card>
    </div>
  );
}
