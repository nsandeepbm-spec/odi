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
  Banknote,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  PaymentBadge,
  EmptyState,
  inrFromPaise,
  OrderBadge,
} from '../../../components/dashboard/shared';
import { ODILoader } from '../../../components/ODILoader';
import { razorpayRefundLabel } from '../../../components/dashboard/RefundRequestDrawer';
import { FeedbackDialog } from '../../../components/dashboard/FeedbackDialog';
import {
  getAdminRefund,
  getAdminOrderDetail,
  reviewAdminRefund,
  type RefundRow,
  type RefundStatus,
  type AdminOrderDetail,
} from '../../../lib/api';
import { getInitials } from '../../../lib/auth';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function paymentBadgeStatus(status: string): 'paid' | 'pending' | 'refunded' | 'failed' {
  if (status === 'captured' || status === 'paid') return 'paid';
  if (status === 'refunded') return 'refunded';
  if (status === 'failed') return 'failed';
  return 'pending';
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

function StatusChip({ status }: { status: RefundStatus }) {
  const cls =
    status === 'pending' || status === 'approved'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : status === 'completed'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
  const label =
    status === 'pending' || status === 'approved'
      ? 'under review'
      : status === 'completed'
        ? 'refunded'
        : 'declined';
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${cls}`}>
      {label}
    </span>
  );
}

export default function RefundDetailPage() {
  const { refundId } = useParams<{ refundId: string }>();
  const navigate = useNavigate();
  const [refund, setRefund] = useState<RefundRow | null>(null);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [busyAction, setBusyAction] = useState<'approved' | 'rejected' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error';
    title: string;
    message: string;
    detail?: string | null;
  } | null>(null);

  const load = (id: string) => {
    setLoading(true);
    setError(null);
    getAdminRefund(id)
      .then(async (row) => {
        setRefund(row);
        try {
          const orderDetail = await getAdminOrderDetail(row.orderId);
          setDetail(orderDetail);
        } catch {
          setDetail(null);
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load refund');
        setRefund(null);
        setDetail(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!refundId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminRefund(refundId)
      .then(async (row) => {
        if (cancelled) return;
        setRefund(row);
        try {
          const orderDetail = await getAdminOrderDetail(row.orderId);
          if (!cancelled) setDetail(orderDetail);
        } catch {
          if (!cancelled) setDetail(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load refund');
          setRefund(null);
          setDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refundId]);

  if (loading) return <ODILoader size="md" label="Loading refund…" />;

  if (error || !refund) {
    return (
      <div className="min-w-0">
        <PageHeader
          title="Refund"
          accent="Detail."
          subtitle="Could not load this refund request."
          action={
            <Link
              to="/dashboard/admin/refunds"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> Back to refunds
            </Link>
          }
        />
        <Card>
          <EmptyState icon={AlertCircle} title="Refund not found" subtitle={error ?? 'This request may have been removed.'} />
        </Card>
      </div>
    );
  }

  const order = detail?.order;
  const items = detail?.items ?? [];
  const payments = detail?.payments ?? [];
  const user = detail?.user;
  const addr = order?.shipping_address;
  const customerName =
    [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') ||
    user?.full_name ||
    '—';
  const fullAddr = [addr?.street, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean)
    .join(', ');
  const rz = razorpayRefundLabel(refund);
  const canAct = refund.status === 'pending' || refund.status === 'approved';
  const matchedPayment =
    payments.find((p) => p.id === refund.paymentId) ??
    payments.find((p) => p.provider_payment_id === refund.providerPaymentId) ??
    payments[0];

  const handleReview = async (decision: 'approved' | 'rejected') => {
    setBusyAction(decision);
    setActionError(null);
    try {
      const updated = await reviewAdminRefund(refund.id, decision, note);
      const fresh = await getAdminRefund(updated.id);
      setRefund(fresh);
      try {
        const orderDetail = await getAdminOrderDetail(fresh.orderId);
        setDetail(orderDetail);
      } catch {
        setDetail(null);
      }
      setNote('');
      if (decision === 'approved') {
        setFeedback({
          tone: 'success',
          title: 'Refund sent',
          message: fresh.providerRefundId
            ? 'The refund was sent to Razorpay. It can take a few business days to reach the customer.'
            : 'This refund was marked complete (no Razorpay payment on this order).',
          detail: fresh.providerRefundId,
        });
      } else {
        setFeedback({
          tone: 'success',
          title: 'Refund declined',
          message: 'This refund request was declined. No payout was sent.',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update refund';
      setActionError(message);
      if (refundId) load(refundId);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="min-w-0">
      <PageHeader
        title={refund.orderNumber}
        accent="Refund."
        subtitle={`Order ${refund.orderNumber} · requested ${formatDate(refund.createdAt)}`}
        action={
          <button
            type="button"
            onClick={() => navigate('/dashboard/admin/refunds')}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to refunds
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          <Card>
            <div className="px-4 sm:px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d]">
              <SectionTitle icon={Banknote}>Refund request</SectionTitle>
              <div className="flex flex-wrap items-center gap-3 -mt-2">
                <StatusChip status={refund.status} />
                {order && <OrderBadge status={order.status} />}
                <span
                  className={`text-xs font-medium min-w-0 break-words ${
                    rz.tone === 'ok'
                      ? 'text-emerald-400'
                      : rz.tone === 'fail'
                        ? 'text-amber-400'
                        : 'text-neutral-400'
                  }`}
                >
                  {rz.label}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow label="Order #" value={<span className="font-black text-cyan-400">{refund.orderNumber}</span>} />
                <DetailRow
                  label="Order ID"
                  value={<span className="font-mono text-xs">{refund.orderId}</span>}
                />
                <DetailRow label="Refund amount" value={inrFromPaise(refund.amountPaise)} />
                <DetailRow label="Currency" value={refund.currency} />
                <DetailRow label="Requested" value={formatDateTime(refund.createdAt)} />
                <DetailRow label="Reviewed" value={refund.reviewedAt ? formatDateTime(refund.reviewedAt) : null} />
                <DetailRow label="Refunded at" value={refund.refundedAt ? formatDateTime(refund.refundedAt) : null} />
              </div>
              {refund.reason?.trim() && (
                <div className="mt-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                    Reason
                  </p>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {refund.reason}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="px-4 sm:px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d]">
              <SectionTitle icon={CreditCard}>Payment (for Razorpay refund)</SectionTitle>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-white/[0.02] border border-cyan-500/20 rounded-2xl p-4">
                <DetailRow
                  label="Razorpay payment ID"
                  value={
                    <span className="font-mono text-xs text-cyan-300">
                      {refund.providerPaymentId || '—'}
                    </span>
                  }
                />
                <DetailRow
                  label="Razorpay refund ID"
                  value={
                    refund.providerRefundId ? (
                      <span className="font-mono text-xs text-emerald-400">{refund.providerRefundId}</span>
                    ) : (
                      'Not refunded yet'
                    )
                  }
                />
                <DetailRow label="Provider" value={refund.provider} />
                <DetailRow label="Internal payment ID" value={refund.paymentId} />
                {refund.providerError && (
                  <DetailRow
                    label="Razorpay error"
                    value={<span className="text-amber-400">{refund.providerError}</span>}
                  />
                )}
              </div>

              {payments.length === 0 ? (
                <p className="text-sm text-neutral-500">No payment records on this order.</p>
              ) : (
                payments.map((pmt) => (
                  <div
                    key={pmt.id}
                    className={`bg-white/[0.02] border rounded-2xl p-4 ${
                      matchedPayment?.id === pmt.id ? 'border-cyan-500/25' : 'border-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                        {pmt.provider}
                      </span>
                      <PaymentBadge status={paymentBadgeStatus(pmt.status)} />
                      {matchedPayment?.id === pmt.id && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                          Used for refund
                        </span>
                      )}
                    </div>
                    <DetailRow
                      label="Payment ID"
                      value={
                        pmt.provider_payment_id ? (
                          <span className="font-mono text-xs">{pmt.provider_payment_id}</span>
                        ) : (
                          '—'
                        )
                      }
                    />
                    {pmt.provider_order_id && (
                      <DetailRow
                        label="Razorpay order"
                        value={<span className="font-mono text-xs">{pmt.provider_order_id}</span>}
                      />
                    )}
                    <DetailRow label="Amount" value={inrFromPaise(pmt.amount_paise)} />
                    <DetailRow label="Time" value={formatDateTime(pmt.created_at)} />
                  </div>
                ))
              )}
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
                    className="flex items-center gap-3 sm:gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-3 sm:p-4"
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
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
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
              ) : (
                <p className="text-sm font-semibold text-white mb-3">
                  {refund.userName || refund.userEmail || '—'}
                </p>
              )}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow label="Email" value={user?.email ?? refund.userEmail ?? addr?.email ?? '—'} />
                <DetailRow label="Phone" value={user?.phone ?? addr?.phone ?? '—'} />
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

          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Refund amount
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight break-all">
              {inrFromPaise(refund.amountPaise)}
            </p>
            {order && (
              <p className="text-xs text-neutral-500 mt-2">
                Order total {inrFromPaise(order.total_paise)}
              </p>
            )}

            {refund.adminNote && (
              <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
                Last note: {refund.adminNote}
              </p>
            )}

            {canAct && (
              <div className="mt-4 space-y-3">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                  Your note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Internal note…"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.07] bg-[#111113] text-sm text-neutral-200 outline-none focus:border-white/20 resize-none"
                />
                {actionError && (
                  <p className="text-xs text-amber-400 leading-relaxed">{actionError}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    disabled={!!busyAction}
                    onClick={() => void handleReview('approved')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {busyAction === 'approved' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Approve refund
                  </button>
                  <button
                    type="button"
                    disabled={!!busyAction}
                    onClick={() => void handleReview('rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {busyAction === 'rejected' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    Decline
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Approve sends a Razorpay refund for this payment. Decline closes the request without paying out.
                </p>
              </div>
            )}

            {order && (
              <Link
                to={`/dashboard/admin/orders/${order.id}`}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5"
              >
                Open full order
              </Link>
            )}
          </div>
        </div>
      </div>

      <FeedbackDialog
        open={!!feedback}
        tone={feedback?.tone ?? 'success'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        detail={feedback?.detail}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
