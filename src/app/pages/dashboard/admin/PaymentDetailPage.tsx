import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  CreditCard,
  Package,
  User,
  MapPin,
  AlertCircle,
  ExternalLink,
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
import { getAdminPaymentDetail, type AdminPaymentDetail } from '../../../lib/api';
import { getInitials } from '../../../lib/auth';

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

function badgeStatus(status: string): 'paid' | 'pending' | 'refunded' | 'failed' {
  if (status === 'captured' || status === 'paid') return 'paid';
  if (status === 'refunded') return 'refunded';
  if (status === 'failed') return 'failed';
  return 'pending';
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-200 text-right break-all">{value}</span>
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

export default function PaymentDetailPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminPaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminPaymentDetail(paymentId)
      .then((d) => {
        if (!cancelled) {
          setDetail(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load payment');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  if (loading) {
    return <ODILoader size="md" label="Loading payment…" />;
  }

  if (error || !detail) {
    return (
      <div>
        <PageHeader
          title="Payment"
          accent="Detail."
          subtitle="Could not load this transaction."
          action={
            <Link
              to="/dashboard/admin/payments"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> Back to payments
            </Link>
          }
        />
        <Card>
          <EmptyState
            icon={AlertCircle}
            title="Payment not found"
            subtitle={error ?? 'This payment may have been removed or the link is invalid.'}
          />
        </Card>
      </div>
    );
  }

  const { payment, order, user } = detail;
  const addr = order?.shipping_address;
  const customerName =
    [addr?.first_name, addr?.last_name].filter(Boolean).join(' ') ||
    user?.full_name ||
    user?.email?.split('@')[0] ||
    'Customer';
  const fullAddr = [addr?.street, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div>
      <PageHeader
        title="Payment"
        accent="Detail."
        subtitle={`${payment.provider} · ${formatDateTime(payment.created_at)}`}
        action={
          <button
            type="button"
            onClick={() => navigate('/dashboard/admin/payments')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] hover:border-white/[0.2] transition-all rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to payments
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card>
            <div className="px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <SectionTitle icon={CreditCard}>Transaction</SectionTitle>
                <div className="flex flex-wrap items-center gap-3 -mt-2">
                  <PaymentBadge status={badgeStatus(payment.status)} />
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
                    {payment.provider}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">
                  Amount
                </p>
                <p className="text-2xl font-black text-white tracking-tight">
                  {inrFromPaise(payment.amount_paise)}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{payment.currency || 'INR'}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                <DetailRow
                  label="Payment ID"
                  value={<span className="font-mono text-xs">{payment.id}</span>}
                />
                <DetailRow
                  label="Provider payment"
                  value={
                    payment.provider_payment_id ? (
                      <span className="font-mono text-xs">{payment.provider_payment_id}</span>
                    ) : (
                      '—'
                    )
                  }
                />
                <DetailRow
                  label="Provider order"
                  value={
                    payment.provider_order_id ? (
                      <span className="font-mono text-xs">{payment.provider_order_id}</span>
                    ) : (
                      '—'
                    )
                  }
                />
                <DetailRow label="Status" value={payment.status} />
                <DetailRow label="Created" value={formatDateTime(payment.created_at)} />
                <DetailRow label="Updated" value={formatDateTime(payment.updated_at)} />
              </div>
            </div>
          </Card>

          {order && (
            <Card>
              <div className="px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <SectionTitle icon={Package}>Linked order</SectionTitle>
                <Link
                  to={`/dashboard/admin/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Open order <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="p-6">
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                  <DetailRow
                    label="Order #"
                    value={<span className="font-black text-cyan-400">{order.order_number}</span>}
                  />
                  <DetailRow label="Order status" value={<OrderBadge status={order.status} />} />
                  <DetailRow label="Order date" value={formatDate(order.created_at)} />
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
                    label="Order total"
                    value={
                      <span className="font-black text-white">{inrFromPaise(order.total_paise)}</span>
                    }
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

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
                <DetailRow label="Name" value={customerName} />
                <DetailRow label="Email" value={user?.email ?? addr?.email ?? '—'} />
                <DetailRow label="Phone" value={user?.phone ?? addr?.phone ?? '—'} />
                <DetailRow label="Role" value={user?.role} />
                <DetailRow label="Account" value={user?.status} />
              </div>
            </div>
          </Card>

          {addr && (
            <Card>
              <div className="p-5 sm:p-6">
                <SectionTitle icon={MapPin}>Shipping</SectionTitle>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                  <DetailRow label="Name" value={customerName} />
                  <DetailRow label="Email" value={addr.email ?? '—'} />
                  <DetailRow label="Phone" value={addr.phone ?? '—'} />
                  <DetailRow label="Address" value={fullAddr || '—'} />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
