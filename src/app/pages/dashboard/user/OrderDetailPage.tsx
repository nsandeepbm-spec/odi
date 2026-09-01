import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
  Clock,
  FileDown,
  Ban,
  Banknote,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  EmptyState,
  inrFromPaise,
  OrderBadge,
  userOrderStatusDisplay,
} from '../../../components/dashboard/shared';
import { ODILoader } from '../../../components/ODILoader';
import {
  getMyOrder,
  getMyOrderTracking,
  createMyOrderCancel,
  getMyOrderCancel,
  getMyOrderRefund,
  type UserOrderItem,
  type UserOrderPayment,
  type ShipmentTracking,
  type CancelRow,
  type RefundRow,
} from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import { downloadOrderInvoice } from '../../../lib/invoice';
import {
  ShipmentTrackingSummary,
  ShipmentTrackingDrawer,
} from '../../../components/dashboard/ShipmentTrackingDrawer';
import { FeedbackDialog } from '../../../components/dashboard/FeedbackDialog';

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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-200 sm:text-right break-all min-w-0">{value}</span>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 min-w-0">
      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      <span className="text-xs font-black tracking-[0.2em] uppercase text-neutral-400 min-w-0 break-words">
        {children}
      </span>
    </div>
  );
}

function paymentBadgeClass(status: string) {
  switch (status) {
    case 'captured':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'refunded':
      return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    case 'authorized':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
}

function lineTotal(item: UserOrderItem) {
  return item.line_total_paise ?? item.unit_price_paise * item.quantity;
}

export default function UserOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getMyOrder>>['order'] | null>(null);
  const [items, setItems] = useState<UserOrderItem[]>([]);
  const [payments, setPayments] = useState<UserOrderPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackingDrawerOpen, setTrackingDrawerOpen] = useState(false);
  const [cancelReq, setCancelReq] = useState<CancelRow | null>(null);
  const [refundReq, setRefundReq] = useState<RefundRow | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelBusy, setCancelBusy] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const loadTracking = (id: string) => {
    setTrackingLoading(true);
    setTrackingError(null);
    getMyOrderTracking(id)
      .then((t) => setTracking(t))
      .catch((e) => {
        setTracking(null);
        setTrackingError(e instanceof Error ? e.message : 'Could not load tracking');
      })
      .finally(() => setTrackingLoading(false));
  };

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMyOrder(orderId)
      .then((d) => {
        if (!cancelled) {
          setOrder(d.order);
          setItems(d.items);
          setPayments(d.payments);
          setCancelReq(null);
          setRefundReq(null);
          setLoading(false);
          void Promise.all([getMyOrderCancel(d.order.id), getMyOrderRefund(d.order.id)])
            .then(([c, r]) => {
              if (!cancelled) {
                setCancelReq(c);
                setRefundReq(r);
              }
            })
            .catch(() => {
              if (!cancelled) {
                setCancelReq(null);
                setRefundReq(null);
              }
            });
          if (d.order.delhivery_waybill) loadTracking(d.order.id);
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

  if (loading) {
    return <ODILoader size="md" label="Loading order…" />;
  }

  if (error || !order) {
    return (
      <div className="min-w-0">
        <PageHeader
          title="Order"
          accent="Detail."
          subtitle="Could not load this order."
          action={
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] transition-all rounded-xl"
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

  const addr = order.shipping_address;
  const fullAddr = [addr?.street, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean)
    .join(', ');
  const shipName = [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') || '—';
  const awaitingPayment = order.status === 'pending' && !!order.razorpay_order_id;
  const statusDisplay = userOrderStatusDisplay({
    status: order.status,
    refund_status: refundReq?.status ?? order.refund_status,
    razorpay_order_id: order.razorpay_order_id,
  });
  const canRequestCancel =
    !['cancelled', 'refunded', 'delivered'].includes(order.status) &&
    !awaitingPayment &&
    (!cancelReq || cancelReq.status === 'rejected') &&
    !refundReq;

  const submitCancelRequest = () => {
    if (!user || !order) return;
    setCancelBusy(true);
    void createMyOrderCancel(order.id, cancelReason.trim() || undefined)
      .then((row) => {
        setCancelReq(row);
        setShowCancelForm(false);
        setCancelReason('');
        setFeedback({
          tone: 'success',
          title: 'Request received',
          message:
            'We’ve received your cancellation request. We’ll review it shortly. You can follow the status on this order.',
        });
      })
      .catch((err) => {
        setFeedback({
          tone: 'error',
          title: 'Could not submit request',
          message: err instanceof Error ? err.message : 'Please try again in a moment.',
        });
      })
      .finally(() => setCancelBusy(false));
  };

  return (
    <div className="min-w-0">
      <PageHeader
        title={order.order_number}
        accent="Detail."
        subtitle={`Placed ${formatDate(order.created_at)}`}
        action={
          <button
            type="button"
            onClick={() => navigate('/dashboard/orders')}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to orders
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          <Card>
            <div className="px-4 sm:px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d]">
              <SectionTitle icon={Package}>Order</SectionTitle>
              <div className="flex flex-wrap items-center gap-3 -mt-2">
                {awaitingPayment ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black tracking-widest uppercase">
                    <Clock className="w-3 h-3" /> Awaiting Payment
                  </span>
                ) : (
                  <OrderBadge status={statusDisplay.badgeStatus} label={statusDisplay.label} />
                )}
                <span className="text-xs text-neutral-500 font-medium">
                  {order.paid_at ? `Paid ${formatDateTime(order.paid_at)}` : 'Not paid yet'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
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

          <Card title={`Products · ${items.length}`}>
            <div className="p-4 sm:p-6 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">No line items.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-3 sm:p-4 min-w-0"
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
                      <p className="text-sm font-bold text-white break-words">{item.snapshot_name}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Qty {item.quantity} × {inrFromPaise(item.unit_price_paise)}
                      </p>
                      <p className="text-sm font-black text-white mt-1 sm:hidden">
                        {inrFromPaise(lineTotal(item))}
                      </p>
                    </div>
                    <p className="hidden sm:block text-sm font-black text-white shrink-0">
                      {inrFromPaise(lineTotal(item))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {payments.length > 0 && (
            <Card title="Payment">
              <div className="p-4 sm:p-6 space-y-4">
                {payments.map((pmt) => (
                  <div
                    key={pmt.id}
                    className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                        {pmt.provider}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${paymentBadgeClass(pmt.status)}`}
                      >
                        {pmt.status}
                      </span>
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

        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <Card>
            <div className="p-4 sm:p-6">
              <SectionTitle icon={MapPin}>Shipping</SectionTitle>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow label="Name" value={shipName} />
                <DetailRow label="Email" value={addr?.email ?? '—'} />
                <DetailRow label="Phone" value={addr?.phone ?? '—'} />
                <DetailRow label="Address" value={fullAddr || '—'} />
              </div>
            </div>
          </Card>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-4 sm:p-5 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Order total
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight break-all">
              {inrFromPaise(order.total_paise)}
            </p>
            {order.discount_paise > 0 && (
              <p className="text-xs font-bold text-emerald-400 mt-2">
                Saved {inrFromPaise(order.discount_paise)}
                {order.coupon_code ? ` · ${order.coupon_code}` : ''}
              </p>
            )}
            <button
              type="button"
              onClick={() =>
                downloadOrderInvoice({
                  order,
                  items,
                  payments,
                })
              }
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold tracking-wide rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.22)] hover:shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all"
            >
              <FileDown className="w-4 h-4" /> Download invoice
            </button>

            {cancelReq && (
              <div
                className={`mt-4 rounded-xl border px-3 py-3 text-xs ${
                  cancelReq.status === 'pending'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                    : cancelReq.status === 'approved'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/20 bg-red-500/10 text-red-300'
                }`}
              >
                <p className="font-black uppercase tracking-widest mb-1">
                  {cancelReq.status === 'pending'
                    ? 'Cancellation requested'
                    : cancelReq.status === 'approved'
                      ? 'Cancellation approved'
                      : 'Cancellation declined'}
                </p>
                {cancelReq.reason && (
                  <p className="opacity-90 leading-relaxed">{cancelReq.reason}</p>
                )}
              </div>
            )}

            {refundReq && (
              <div
                className={`mt-3 rounded-xl border px-3 py-3 text-xs ${
                  refundReq.status === 'pending' || refundReq.status === 'approved'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                    : refundReq.status === 'completed'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/20 bg-red-500/10 text-red-300'
                }`}
              >
                <p className="font-black uppercase tracking-widest mb-1 inline-flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5" />
                  {refundReq.status === 'pending' || refundReq.status === 'approved'
                    ? 'Refund in progress'
                    : refundReq.status === 'completed'
                      ? 'Refund sent'
                      : 'Refund not possible'}
                </p>
                {refundReq.status === 'pending' || refundReq.status === 'approved' ? (
                  <p className="opacity-90 leading-relaxed">
                    Your order is cancelled. The amount will be returned to your original payment
                    method.
                  </p>
                ) : refundReq.status === 'completed' ? (
                  <p className="opacity-90 leading-relaxed">
                    The amount has been returned to your original payment method. It can take a few
                    business days to show up.
                  </p>
                ) : (
                  <p className="opacity-90 leading-relaxed">
                    We weren't able to refund this order. If you have questions, contact support.
                  </p>
                )}
              </div>
            )}

            {canRequestCancel && !showCancelForm && (
              <button
                type="button"
                onClick={() => setShowCancelForm(true)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold tracking-wide rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/15 transition-all"
              >
                <Ban className="w-4 h-4" /> Cancel request
              </button>
            )}

            {canRequestCancel && showCancelForm && (
              <div className="mt-3 space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                  Why do you want to cancel?
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Optional reason…"
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.07] bg-[#111113] text-sm text-neutral-200 outline-none focus:border-white/20 resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    disabled={cancelBusy}
                    onClick={submitCancelRequest}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {cancelBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                    Submit request
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason('');
                    }}
                    className="px-3 py-2.5 text-xs font-bold rounded-xl border border-white/10 text-neutral-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {(order.delhivery_waybill ||
            order.status === 'shipped' ||
            order.status === 'processing' ||
            order.status === 'cancelled' ||
            order.status === 'refunded') && (
            <ShipmentTrackingSummary
              tracking={tracking}
              loading={trackingLoading}
              error={trackingError}
              onRefresh={() => loadTracking(order.id)}
              onViewDetails={() => setTrackingDrawerOpen(true)}
              userFacing
              order={order}
            />
          )}
        </div>
      </div>

      <ShipmentTrackingDrawer
        open={trackingDrawerOpen}
        onClose={() => setTrackingDrawerOpen(false)}
        tracking={tracking}
        loading={trackingLoading}
        error={trackingError}
        onRefresh={() => loadTracking(order.id)}
        orderNumber={order.order_number}
        order={order}
        deliveryAddress={
          fullAddr
            ? [shipName !== '—' ? shipName : null, fullAddr].filter(Boolean).join(' · ')
            : shipName !== '—'
              ? shipName
              : null
        }
        userFacing
      />

      <FeedbackDialog
        open={!!feedback}
        tone={feedback?.tone ?? 'success'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
