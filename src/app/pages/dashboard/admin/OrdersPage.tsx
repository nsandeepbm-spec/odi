import React, { useEffect, useMemo, useState } from 'react';
import { Search, Download, CalendarX, Loader2 } from 'lucide-react';
import { PageHeader, Card, PaymentBadge, EmptyState, inrFromPaise } from '../../../components/dashboard/shared';
import { listAdminOrders, updateAdminOrderStatus, type AdminOrder } from '../../../lib/api';

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

export default function OrdersPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    return () => { cancelled = true; };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateAdminOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name].join(' ').toLowerCase();
      const email = (o.shipping_address?.email || '').toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        email.includes(q)
      );
    });
  }, [query, filter, orders]);

  return (
    <div>
      <PageHeader
        title="All"
        accent="Orders."
        subtitle="Track, filter and manage every order on the platform."
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
              placeholder="Search by ID, customer, email…"
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
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">Loading orders…</span>
          </div>
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn’t load orders" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarX} title="No orders found" subtitle="Try a different search term or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[820px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Order</th>
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
                {filtered.map((o) => {
                  const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name].filter(Boolean).join(' ') || 'Customer';
                  const email = o.shipping_address?.email || '—';
                  const item = o.order_items?.[0]; // Assuming 1 main item for display
                  const payment = o.payments?.[0];
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-indigo-600">{o.order_number}</div>
                        <div className="text-xs text-neutral-400">{formatDate(o.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{customer}</div>
                        <div className="text-xs text-neutral-400">{email}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 truncate max-w-[150px]" title={item?.snapshot_name}>
                        {item?.snapshot_name || '—'}
                      </td>
                      <td className="px-6 py-4 font-semibold">{item?.quantity || '—'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none font-semibold uppercase tracking-wider disabled:opacity-50"
                        >
                          {FILTERS.filter(f => f.value !== 'all').map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4"><PaymentBadge status={(payment?.status as any) || 'created'} /></td>
                      <td className="px-6 py-4 text-right font-black">{inrFromPaise(o.total_paise)}</td>
                      <td className="px-4 py-4" />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-semibold">
          <span>{loading ? '…' : `Showing ${filtered.length} of ${orders.length} orders ${!query.trim() && total > orders.length ? `(Total: ${total})` : ''}`}</span>
        </div>
      </Card>
    </div>
  );
}
