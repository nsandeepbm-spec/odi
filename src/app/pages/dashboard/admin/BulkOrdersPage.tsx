import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertCircle, Building2, Download, Plus, Search } from 'lucide-react';
import {
  Card,
  EmptyState,
  TableSkeleton,
  ListPager,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import {
  getAdminBulkOrder,
  listAdminBulkOrders,
  type BulkOrderListRow,
} from '../../../lib/api';
import { downloadOrderInvoice } from '../../../lib/invoice';

const PER_PAGE = 20;
const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function orgName(order: BulkOrderListRow) {
  const addr = order.shipping_address ?? {};
  return (
    addr.organization_name?.trim() ||
    [addr.first_name, addr.last_name].filter(Boolean).join(' ') ||
    'Buyer'
  );
}

function paymentBadge(status: string) {
  if (status === 'paid') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
}

export default function AdminBulkOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BulkOrderListRow[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: PER_PAGE, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [qApplied, setQApplied] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminBulkOrders({
        page,
        perPage: PER_PAGE,
        paymentStatus,
        q: qApplied || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setOrders(result.orders);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bulk orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, paymentStatus, qApplied, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const filters = useMemo(
    () =>
      [
        { id: 'all' as const, label: 'All' },
        { id: 'paid' as const, label: 'Paid' },
        { id: 'pending' as const, label: 'Pending' },
      ] as const,
    []
  );

  const onDownloadInvoice = async (orderId: string, status: string) => {
    setDownloadingId(orderId);
    try {
      const detail = await getAdminBulkOrder(orderId);
      await downloadOrderInvoice(
        {
          order: detail.order,
          items: detail.items,
          payments: detail.payments.map((p) => ({
            provider: p.provider,
            status: p.status,
            provider_payment_id: null,
            provider_order_id: null,
            method: detail.order.bulk_payment_method,
          })),
          user: null,
        },
        { documentKind: status === 'paid' ? 'invoice' : 'bill' }
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not download document');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
                <Building2 className="w-3 h-3" />
                Sales
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                No Delhivery
              </span>
            </div>
            <h1
              className="font-black tracking-tight text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
            >
              Bulk / Offline{' '}
              <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Orders.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
              School, store, and institution sales. Stock deducts on create. Shipping is handled offline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/admin/bulk-orders/new')}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400"
          >
            <Plus className="w-4 h-4" />
            Create order
          </button>
        </div>
      </header>

      <Card className={`relative z-10 min-w-0 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-500/40 flex flex-col gap-3 bg-[#0d0d0d] min-w-0">
          <form
            className="flex flex-col sm:flex-row gap-2 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQApplied(q.trim());
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[#111] border border-neutral-500/70 shadow-inner focus-within:border-cyan-400 transition-colors">
              <Search className="w-4 h-4 text-neutral-300 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search order, school, phone, email…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl border border-neutral-500/70 text-xs font-bold text-neutral-200 hover:bg-white/[0.06] hover:border-neutral-400"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-500/70 bg-[#111] px-3 py-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-200 w-full sm:w-auto sm:mr-1">
                Payment
              </span>
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setPaymentStatus(f.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    paymentStatus === f.id
                      ? 'bg-white text-black'
                      : 'bg-black/40 text-neutral-300 border border-neutral-600 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#111] border border-neutral-500/70 w-full lg:w-auto min-w-0">
              <label className="flex items-center gap-2 min-w-0 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                From
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setPage(1);
                  }}
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
                  value={to}
                  min={from || undefined}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 w-full sm:w-auto bg-transparent text-sm font-semibold normal-case tracking-normal text-white outline-none [color-scheme:dark]"
                />
              </label>
              {(from || to) && (
                <button
                  type="button"
                  onClick={() => {
                    setFrom('');
                    setTo('');
                    setPage(1);
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-lg text-neutral-200 border border-neutral-500 hover:text-white hover:bg-white/[0.06]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            {meta.total} order{meta.total === 1 ? '' : 's'} · Bulk / Offline
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <div className="p-10 flex flex-col items-center text-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="font-bold text-sm text-white">Could not load bulk orders</p>
            <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
            <p className="text-[11px] text-neutral-500 max-w-md">
              If this is a new feature, run <code className="text-cyan-400">sql/migrate-bulk-offline-orders.sql</code> in
              Supabase first.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No bulk / offline orders yet"
            subtitle="Create a direct sale for a school, store, or institution. These never use Delhivery."
          />
        ) : (
          <>
            <div className="md:hidden divide-y divide-white/[0.06]">
              {orders.map((order) => {
                const item = order.order_items?.[0];
                return (
                  <div key={order.id} className="px-4 py-4 min-w-0">
                    <Link to={`/dashboard/admin/bulk-orders/${order.id}`} className="block min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-black text-sm text-cyan-400 truncate">{order.order_number}</span>
                        <span className="font-black text-sm text-white shrink-0 tabular-nums">
                          {inrFromPaise(order.total_paise)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-1">{orgName(order)}</p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {item
                          ? `${item.snapshot_name} · qty ${item.quantity}`
                          : '—'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${paymentBadge(order.status)}`}
                        >
                          {order.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                        <span className="text-[11px] text-neutral-500 truncate">
                          {order.bulk_payment_method || '—'} · {formatDate(order.created_at)}
                        </span>
                      </div>
                    </Link>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Link
                        to={`/dashboard/admin/bulk-orders/${order.id}`}
                        className="text-center px-3 py-2 rounded-xl border border-neutral-500/60 text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:bg-white/[0.04] hover:border-neutral-400"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        disabled={downloadingId === order.id}
                        onClick={() => void onDownloadInvoice(order.id, order.status)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-500/60 text-[10px] font-bold uppercase tracking-wider text-neutral-200 hover:bg-white/[0.04] hover:border-neutral-400 disabled:opacity-50"
                      >
                        <Download className="w-3 h-3" />
                        {order.status === 'paid' ? 'Invoice' : 'Bill'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[820px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-neutral-500/40">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Buyer</th>
                    <th className="px-4 lg:px-6 py-4">Product</th>
                    <th className="px-4 lg:px-6 py-4">Payment</th>
                    <th className="px-4 lg:px-6 py-4">Total</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {orders.map((order) => {
                    const item = order.order_items?.[0];
                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 lg:px-6 py-4 align-top">
                          <p className="font-black text-white">{order.order_number}</p>
                          <p className="text-[11px] text-neutral-500 mt-1">{formatDate(order.created_at)}</p>
                        </td>
                        <td className="px-4 lg:px-6 py-4 align-top max-w-[180px]">
                          <p className="font-semibold text-neutral-200 truncate">{orgName(order)}</p>
                        </td>
                        <td className="px-4 lg:px-6 py-4 align-top max-w-[220px]">
                          <p className="text-neutral-300 truncate">
                            {item ? item.snapshot_name : '—'}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-1">
                            {item ? `Qty ${item.quantity} · ${inrFromPaise(item.unit_price_paise)}/unit` : ''}
                          </p>
                        </td>
                        <td className="px-4 lg:px-6 py-4 align-top">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${paymentBadge(order.status)}`}
                          >
                            {order.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                          <p className="text-[11px] text-neutral-500 mt-1">{order.bulk_payment_method || '—'}</p>
                        </td>
                        <td className="px-4 lg:px-6 py-4 align-top font-black text-white tabular-nums whitespace-nowrap">
                          {inrFromPaise(order.total_paise)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 align-top">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/dashboard/admin/bulk-orders/${order.id}`}
                              className="px-3 py-2 rounded-xl border border-neutral-500/60 text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:bg-white/[0.04] hover:border-neutral-400"
                            >
                              View
                            </Link>
                            <button
                              type="button"
                              disabled={downloadingId === order.id}
                              onClick={() => void onDownloadInvoice(order.id, order.status)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-500/60 text-[10px] font-bold uppercase tracking-wider text-neutral-200 hover:bg-white/[0.04] hover:border-neutral-400 disabled:opacity-50"
                            >
                              <Download className="w-3 h-3" />
                              {order.status === 'paid' ? 'Invoice' : 'Bill'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && (
          <ListPager
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
}
