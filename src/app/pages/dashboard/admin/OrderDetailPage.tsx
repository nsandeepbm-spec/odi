import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  CreditCard,
  Loader2,
  AlertCircle,
  FileDown,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  PaymentBadge,
  EmptyState,
  inrFromPaise,
  OrderBadge,
} from '../../../components/dashboard/shared';
import {
  getAdminOrderDetail,
  updateAdminOrderStatus,
  type AdminOrderDetail,
} from '../../../lib/api';
import { getInitials } from '../../../lib/auth';
import { downloadOrderInvoice } from '../../../lib/invoice';

const STATUSES = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-200 text-right">{value}</span>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      <span className="text-xs font-black tracking-[0.2em] uppercase text-neutral-400">{children}</span>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminOrderDetail(orderId)
      .then((d) => {
        if (!cancelled) {
          setDetail(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load order');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!detail) return;
    setUpdating(true);
    try {
      const updated = await updateAdminOrderStatus(detail.order.id, newStatus);
      setDetail((d) =>
        d ? { ...d, order: { ...d.order, status: updated.status } } : d
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-sm text-neutral-500 font-medium">Loading order…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div>
        <PageHeader
          title="Order"
          accent="Detail."
          subtitle="Could not load this order."
          action={
            <Link
              to="/dashboard/admin/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> Back to orders
            </Link>
          }
        />
        <Card>
          <EmptyState
            icon={AlertCircle}
            title="Order not found"
            subtitle={error ?? 'This order may have been removed or the link is invalid.'}
          />
        </Card>
      </div>
    );
  }

  const { order, items, payments, user } = detail;
  const addr = order.shipping_address;
  const fullAddr = [addr?.street, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean)
    .join(', ');
  const customerName =
    [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') ||
    user?.full_name ||
    user?.email?.split('@')[0] ||
    'Customer';

  return (
    <div>
      <PageHeader
        title={order.order_number}
        accent="Detail."
        subtitle={`Placed ${formatDate(order.created_at)} · ${customerName}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadOrderInvoice(detail)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.22)] hover:shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all rounded-xl"
            >
              <FileDown className="w-4 h-4" /> Invoice
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/orders')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> Back to orders
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        {/* Main column */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Order summary + status */}
          <Card>
            <div className="px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <SectionTitle icon={Package}>Order</SectionTitle>
                <div className="flex flex-wrap items-center gap-3 -mt-2">
                  <OrderBadge status={order.status} />
                  <span className="text-xs text-neutral-500 font-medium">
                    {order.paid_at ? `Paid ${formatDateTime(order.paid_at)}` : 'Not paid yet'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Update status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => void handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="appearance-none bg-[#050505] border border-white/[0.1] text-white text-xs rounded-xl focus:ring-1 focus:ring-cyan-500 px-3 py-2 outline-none font-bold uppercase tracking-widest disabled:opacity-50 cursor-pointer hover:border-white/[0.2] transition-colors"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#0A0A0A]">
                      {s.label}
                    </option>
                  ))}
                </select>
                {updating && <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow
                  label="Order #"
                  value={<span className="font-black text-cyan-400">{order.order_number}</span>}
                />
                <DetailRow label="Date" value={formatDate(order.created_at)} />
                <DetailRow
                  label="Paid at"
                  value={order.paid_at ? formatDateTime(order.paid_at) : '—'}
                />
                <DetailRow label="Subtotal" value={inrFromPaise(order.subtotal_paise)} />
                {order.discount_paise > 0 && (
                  <DetailRow
                    label="Discount"
                    value={
                      <span className="text-emerald-400">−{inrFromPaise(order.discount_paise)}</span>
                    }
                  />
                )}
                {order.coupon_code && <DetailRow label="Coupon" value={order.coupon_code} />}
                <DetailRow
                  label="Total"
                  value={
                    <span className="font-black text-white text-base">
                      {inrFromPaise(order.total_paise)}
                    </span>
                  }
                />
              </div>
            </div>
          </Card>

          {/* Products */}
          <Card title={`Products · ${items.length}`}>
            <div className="p-4 sm:p-6 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">No line items.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4"
                  >
                    {item.snapshot_image_url ? (
                      <img
                        src={item.snapshot_image_url}
                        alt={item.snapshot_name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-neutral-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.snapshot_name}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Qty {item.quantity} × {inrFromPaise(item.unit_price_paise)}
                      </p>
                    </div>
                    <p className="text-sm font-black text-white shrink-0">
                      {inrFromPaise(item.line_total_paise)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Payments */}
          {payments.length > 0 && (
            <Card title="Payment">
              <div className="p-4 sm:p-6 space-y-4">
                {payments.map((pmt) => (
                  <div
                    key={pmt.id}
                    className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                        {pmt.provider}
                      </span>
                      <PaymentBadge status={pmt.status as 'paid' | 'pending' | 'refunded' | 'failed'} />
                    </div>
                    <DetailRow
                      label="Payment ID"
                      value={
                        pmt.provider_payment_id ? (
                          <span className="font-mono text-xs break-all">{pmt.provider_payment_id}</span>
                        ) : (
                          '—'
                        )
                      }
                    />
                    {pmt.provider_order_id && (
                      <DetailRow
                        label="Provider order"
                        value={<span className="font-mono text-xs break-all">{pmt.provider_order_id}</span>}
                      />
                    )}
                    <DetailRow label="Amount" value={inrFromPaise(pmt.amount_paise)} />
                    <DetailRow label="Time" value={formatDateTime(pmt.created_at)} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card>
            <div className="p-5 sm:p-6">
              <SectionTitle icon={User}>Customer</SectionTitle>
              {user ? (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.04]">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black ring-1 ring-white/10">
                      {getInitials(user.full_name, user.email)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {user.full_name ?? user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : null}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow label="Email" value={user?.email ?? addr?.email ?? '—'} />
                <DetailRow label="Phone" value={user?.phone ?? addr?.phone ?? '—'} />
                <DetailRow label="Role" value={user?.role} />
                <DetailRow label="Account" value={user?.status} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 sm:p-6">
              <SectionTitle icon={MapPin}>Shipping</SectionTitle>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow label="Name" value={customerName} />
                <DetailRow label="Email" value={addr?.email ?? '—'} />
                <DetailRow label="Phone" value={addr?.phone ?? '—'} />
                <DetailRow label="Address" value={fullAddr || '—'} />
              </div>
            </div>
          </Card>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Order total
            </p>
            <p className="text-3xl font-black text-white tracking-tight">
              {inrFromPaise(order.total_paise)}
            </p>
            {order.discount_paise > 0 && (
              <p className="text-xs font-bold text-emerald-400 mt-2">
                Saved {inrFromPaise(order.discount_paise)}
                {order.coupon_code ? ` · ${order.coupon_code}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
