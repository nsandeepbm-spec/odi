import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard as CreditCardIcon,
  Banknote,
  Smartphone,
  Building2,
  Check,
  RefreshCw,
  Truck,
  MapPin,
} from 'lucide-react';
import { useCheckout, isShippingComplete, isDbAddressId } from '../../lib/checkout';
import { CheckoutOrderSummary } from '../../components/checkout/CheckoutOrderSummary';
import { discountPercent, formatInr } from '../../data/products';
import { createCheckoutSession, verifyPayment } from '../../lib/api';
import { auth } from '../../lib/firebase';
import { FeedbackDialog, type FeedbackDialogTone } from '../../components/dashboard/FeedbackDialog';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, hint: 'GPay · PhonePe · BHIM' },
  { id: 'card', label: 'Card', icon: CreditCardIcon, hint: 'Credit / Debit' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, hint: 'Pay at doorstep' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, hint: 'All major banks' },
] as const;

/** Small styled brand badge used in payment panels */
function PayBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black border"
      style={{ color, borderColor: `${color}55`, background: `${color}0f` }}
    >
      {label}
    </span>
  );
}

type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, cb: (r: { error: { description: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const RAZORPAY_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/** Load the Razorpay SDK once, only when this component mounts. */
function useRazorpayScript() {
  const loaded = useRef(!!window.Razorpay);
  useEffect(() => {
    if (loaded.current) return;
    const script = document.createElement('script');
    script.src = RAZORPAY_URL;
    script.async = true;
    script.onload = () => { loaded.current = true; };
    document.body.appendChild(script);
    return () => {
      // Leave the script in DOM so it stays cached if user navigates back
    };
  }, []);
}

export default function CheckoutPaymentPage() {
  const {
    product,
    productQuery,
    selectedAddressId,
    quantity,
    shipping,
    totalPaise,
    completeOrder,
    idempotencyKey,
    couponCode,
    discountPaise,
    shippingQuoteStatus,
    refreshShippingQuote,
  } = useCheckout();
  const navigate = useNavigate();
  useRazorpayScript();
  const [loading, setLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('upi');
  const [feedback, setFeedback] = useState<{
    tone: FeedbackDialogTone;
    title: string;
    message: string;
  } | null>(null);

  const successPath = (orderNumber: string, pay: 'cod' | 'online') =>
    `/checkout/success?order=${encodeURIComponent(orderNumber)}&pay=${pay}&product=${encodeURIComponent(product?.slug ?? '')}`;

  useEffect(() => {
    if (shippingQuoteStatus === 'ready' || shippingQuoteStatus === 'loading') return;
    const pin = shipping.postalCode.replace(/\D/g, '').slice(0, 6);
    if (pin.length === 6) void refreshShippingQuote(pin);
  }, [shipping.postalCode, shippingQuoteStatus, refreshShippingQuote]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-4">Product not found.</p>
        <Link to="/products" className="text-sm font-bold text-indigo-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  if (!isShippingComplete(shipping)) {
    navigate(`/checkout/review${productQuery}`, { replace: true });
    return null;
  }

  const off = discountPercent(product.price_paise, product.compare_at_paise);
  const shippingLine = [shipping.street, shipping.city, shipping.postalCode].filter(Boolean).join(', ');
  const customerName = [shipping.firstName, shipping.lastName].filter(Boolean).join(' ');

  const payLabel =
    activeMethod === 'cod' ? `Place order · ${formatInr(totalPaise)}` : `Pay ${formatInr(totalPaise)}`;

  const buildShippingAddress = () => ({
    first_name: shipping.firstName,
    last_name: shipping.lastName,
    phone: shipping.phone,
    email: shipping.email,
    street: shipping.street,
    city: shipping.city,
    postal_code: shipping.postalCode,
    country: 'IN' as const,
  });

  const buildCheckoutPayload = (paymentMethod: 'razorpay' | 'cod') => ({
    items: [{ slug: product.slug, quantity }],
    ...(isDbAddressId(selectedAddressId)
      ? { addressId: selectedAddressId }
      : { shippingAddress: buildShippingAddress() }),
    paymentMethod,
    couponCode: couponCode || null,
  });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth.currentUser) {
        navigate(`/login?redirect=${encodeURIComponent(`/checkout/payment${productQuery}`)}`);
        return;
      }

      if (activeMethod === 'cod') {
        const session = await createCheckoutSession(buildCheckoutPayload('cod'), idempotencyKey);
        completeOrder(session.orderNumber);
        navigate(successPath(session.orderNumber, 'cod'));
        return;
      }

      // Online payment via Razorpay
      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout failed to load. Refresh and try again.');
      }

      const session = await createCheckoutSession(buildCheckoutPayload('razorpay'), idempotencyKey);

      if (!session.keyId || !session.razorpayOrderId) {
        throw new Error('Payment session incomplete — Razorpay keys not configured on server.');
      }

      // Map our tab to Razorpay's prefill method value
      const rzpMethod = activeMethod === 'upi' ? 'upi'
        : activeMethod === 'card' ? 'card'
        : activeMethod === 'netbanking' ? 'netbanking'
        : undefined;

      const rzp = new window.Razorpay({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        name: 'ODI',
        description: `Purchase ${product.name}`,
        order_id: session.razorpayOrderId,
        handler: async (response: RazorpaySuccess) => {
          try {
            await verifyPayment({
              orderId: session.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            completeOrder(session.orderNumber);
            navigate(successPath(session.orderNumber, 'online'));
          } catch (verifyErr) {
            setFeedback({
              tone: 'error',
              title: 'Payment not confirmed',
              message:
                verifyErr instanceof Error
                  ? verifyErr.message
                  : 'Payment received but verification failed. Contact support with your order number.',
            });
          }
        },
        prefill: {
          name: customerName,
          email: shipping.email,
          contact: shipping.phone,
          ...(rzpMethod ? { method: rzpMethod } : {}),
        },
        theme: { color: '#111111' },
      });

      rzp.on('payment.failed', (response) => {
        setFeedback({
          tone: 'error',
          title: 'Payment failed',
          message: response.error.description || 'The payment was not completed.',
        });
      });
      rzp.open();
    } catch (err) {
      setFeedback({
        tone: 'error',
        title: 'Could not start payment',
        message: err instanceof Error ? err.message : 'Error processing payment',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-start">
      {/* Left: merged product + payment — matches product / shipping step width */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Product gallery */}
          <div className="p-5 sm:p-6 flex items-center justify-center h-72 sm:h-96 lg:h-[500px] bg-neutral-50/40 border-b border-neutral-100">
            <img
              src={product.media?.card?.url ?? product.images?.[0]?.url ?? ''}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Meta bar: price · product · address */}
          <div className="border-b border-neutral-100 px-4 sm:px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="shrink-0 min-w-[150px]">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  {product.volume}
                </span>
                {product.tag && (
                  <span className="inline-flex px-2 py-0.5 rounded-md bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold">
                    {product.tag}
                  </span>
                )}
              </div>
              <h2
                className="text-lg font-black text-neutral-900 leading-tight mb-1"
                style={{ letterSpacing: '-0.03em' }}
              >
                {product.name}
              </h2>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  {formatInr(totalPaise)}
                </span>
                {off !== null && (
                  <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    {off}% OFF
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Qty {quantity}
                {couponCode && discountPaise > 0
                  ? ` · ${couponCode} −${formatInr(discountPaise)}`
                  : ''}
              </p>
            </div>

            <div className="hidden sm:block w-px h-14 bg-neutral-100 shrink-0" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-1">
                    Delivering to
                  </p>
                  <p className="text-sm font-bold text-neutral-900">{customerName}</p>
                  <p className="text-sm text-neutral-600">{shippingLine}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {shipping.phone} · {shipping.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                Step 3
              </span>
              <span className="inline-flex px-2.5 py-0.5 rounded-md bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold">
                Payment
              </span>
            </div>

            <h1
              className="text-2xl font-black text-neutral-900 leading-tight mb-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              Choose payment method
            </h1>
            <p className="text-sm text-neutral-600 mb-5">
              Pay {formatInr(totalPaise)} for {product.name}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon, hint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveMethod(id)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all ${
                    activeMethod === id
                      ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5 text-neutral-700" />
                  <span className="text-[11px] font-bold text-neutral-800 leading-tight">{label}</span>
                  <span className="text-[10px] text-neutral-500 leading-tight">{hint}</span>
                </button>
              ))}
            </div>

            <form id="payment-form" onSubmit={handlePay} className="flex flex-col">
              <div className="rounded-xl border border-neutral-200 p-4 md:p-5 mb-5 bg-neutral-50/30 min-h-[160px]">

              {activeMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-medium">Accepted:</span>
                    <PayBadge label="Google Pay" color="#4285F4" />
                    <PayBadge label="PhonePe" color="#5f259f" />
                    <PayBadge label="Paytm" color="#00b9f1" />
                    <PayBadge label="BHIM" color="#00794f" />
                    <span className="text-[10px] text-neutral-400">& all UPI apps</span>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-white border border-neutral-200 p-3">
                    <ShieldCheck className="w-4 h-4 text-[#00a680] shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Click <strong>Pay Now</strong> to open Razorpay. Choose your UPI app there — we never collect a UPI ID on this page.
                    </p>
                  </div>
                </div>
              )}

              {activeMethod === 'card' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-medium">Accepted:</span>
                    <PayBadge label="VISA" color="#1a1f71" />
                    <PayBadge label="Mastercard" color="#eb001b" />
                    <PayBadge label="RuPay" color="#097dc6" />
                    <PayBadge label="Amex" color="#006fcf" />
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-white border border-neutral-200 p-3">
                    <ShieldCheck className="w-4 h-4 text-[#00a680] shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Your card details are securely entered in <strong>Razorpay's PCI-DSS compliant</strong> hosted checkout — no card data is stored on our servers.
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Click <strong>Pay Now</strong> to open Razorpay's secure card form.
                  </p>
                </div>
              )}

              {activeMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 rounded-lg bg-white border border-neutral-200 p-3">
                    <Building2 className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Click <strong>Pay Now</strong> to open Razorpay and pick your bank. The bank list is shown there — not on this page.
                    </p>
                  </div>
                </div>
              )}

              {activeMethod === 'cod' && (
                <div className="flex gap-3 items-start">
                  <Banknote className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Pay when your kit arrives</p>
                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                      Keep {formatInr(totalPaise)} ready in cash for the courier. No online payment needed now.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 mb-4">
              <div className="flex flex-col items-center text-center gap-1 px-1">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                <span className="text-[10px] font-bold text-neutral-700">Secure</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 px-1 border-x border-neutral-100">
                <RefreshCw className="w-4 h-4 text-neutral-700" />
                <span className="text-[10px] font-bold text-neutral-700">7 Day Return</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 px-1">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span className="text-[10px] font-bold text-neutral-700">Free Ship</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(`/checkout/review${productQuery}`)}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-600 bg-transparent hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to shipping
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-[#f05a13] text-white font-bold tracking-wide hover:bg-[#e0500e] transition-colors shadow-sm text-sm disabled:opacity-60"
              >
                {loading ? 'Processing…' : payLabel}
              </button>
            </div>

            <div className="flex flex-col items-center gap-1.5 mt-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                <Check className="w-3.5 h-3.5" />
                <span>Safe and Secure Payments</span>
              </div>
              {activeMethod !== 'cod' && (
                <p className="text-[10px] text-neutral-400">
                  Payments powered by{' '}
                  <span className="font-black text-[#3395FF]">Razorpay</span>
                </p>
              )}
            </div>
          </form>
          </div>
        </div>
      </div>

      {/* Right: order summary */}
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        <CheckoutOrderSummary />
      </div>

      <FeedbackDialog
        open={Boolean(feedback)}
        appearance="light"
        tone={feedback?.tone ?? 'error'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
