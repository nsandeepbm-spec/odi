import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, Package, ArrowRight, MapPin, Truck, Home } from 'lucide-react';
import { useCheckout } from '../../lib/checkout';
import { formatInr } from '../../data/products';

const ORDER_STEPS = [
  {
    id: 'confirmed',
    label: 'Confirmed',
    sub: 'Order placed',
    icon: CheckCircle2,
    color: '#00a680',
    bg: '#00a68015',
    ring: '#00a68040',
  },
  {
    id: 'processing',
    label: 'Processing',
    sub: 'Packing your kit',
    icon: Package,
    color: '#f59e0b',
    bg: '#f59e0b15',
    ring: '#f59e0b40',
  },
  {
    id: 'shipped',
    label: 'Shipped',
    sub: 'On its way',
    icon: Truck,
    color: '#3b82f6',
    bg: '#3b82f615',
    ring: '#3b82f640',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    sub: 'At your door',
    icon: Home,
    color: '#8b5cf6',
    bg: '#8b5cf615',
    ring: '#8b5cf640',
  },
] as const;

type StepId = (typeof ORDER_STEPS)[number]['id'];

function OrderTracker({ currentStatus }: { currentStatus: StepId }) {
  const currentIdx = ORDER_STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="col-span-full bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm mt-2"
    >
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-6">
        Order Status
      </p>

      {/* Stepper */}
      <div className="relative flex items-start justify-between gap-2">
        {/* Connecting line track (behind steps) */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-100 mx-[10%]"
          aria-hidden="true"
        />
        {/* Active fill line */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 mx-[10%]"
          style={{ background: ORDER_STEPS[currentIdx]?.color ?? '#00a680' }}
          initial={{ width: '0%' }}
          animate={{
            width: currentIdx === 0
              ? '0%'
              : `${(currentIdx / (ORDER_STEPS.length - 1)) * 80}%`,
          }}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />

        {ORDER_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2.5 flex-1 min-w-0"
            >
              {/* Circle */}
              <motion.div
                initial={isActive ? { scale: 0 } : false}
                animate={isActive ? { scale: 1 } : {}}
                transition={{ delay: 0.65, type: 'spring', stiffness: 260, damping: 18 }}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all"
                style={
                  isActive
                    ? { background: step.bg, borderColor: step.ring, boxShadow: `0 0 0 4px ${step.ring}` }
                    : isDone
                    ? { background: '#f0fdf4', borderColor: '#86efac' }
                    : { background: '#f9fafb', borderColor: '#e5e7eb' }
                }
              >
                <Icon
                  className="w-4.5 h-4.5"
                  style={
                    isActive
                      ? { color: step.color }
                      : isDone
                      ? { color: '#22c55e' }
                      : { color: '#d1d5db' }
                  }
                />
              </motion.div>

              {/* Labels */}
              <div className="text-center min-w-0 px-1">
                <p
                  className="text-xs font-black leading-tight truncate"
                  style={
                    isActive
                      ? { color: step.color }
                      : isDone
                      ? { color: '#16a34a' }
                      : { color: '#9ca3af' }
                  }
                >
                  {step.label}
                </p>
                <p
                  className={`text-[10px] leading-tight mt-0.5 truncate ${
                    isPending ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {step.sub}
                </p>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: step.bg, color: step.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: step.color }}
                    />
                    Current
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500 mt-6 text-center">
        Estimated delivery in{' '}
        <span className="font-bold text-neutral-900">5–7 business days</span> · We'll email you
        when your kit ships.
      </p>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  const { product, quantity, lastOrderId, shipping, totalPaise } = useCheckout();
  const [searchParams] = useSearchParams();

  // Priority: real order number from URL → stored in context after completeOrder()
  const orderNumber = searchParams.get('order') ?? lastOrderId ?? '—';
  const isCod = searchParams.get('pay') === 'cod';
  const customerName = [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || 'Valued Customer';
  const imageUrl = product?.media?.card?.url ?? product?.images?.[0]?.url ?? '';

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-start">

      {/* Left: Success message */}
      <div className="lg:col-span-8 flex flex-col justify-center py-10 lg:py-20 lg:pr-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-[#00a680]/10 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-10 h-10 text-[#00a680]" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 mb-4"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-base text-neutral-500 mb-2"
        >
          Order <span className="font-black text-neutral-800">#{orderNumber}</span>
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-neutral-500 mb-10 max-w-lg leading-relaxed"
        >
          {isCod
            ? 'Your Cash on Delivery order is confirmed. Keep cash ready for the courier — no online payment was taken.'
            : "Thank you for your purchase. We're getting your order ready to ship. You'll be notified once it's on the way."}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/dashboard/orders"
            className="px-8 py-4 rounded-xl bg-black text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
          >
            <Package className="w-5 h-5" />
            Track Order Status
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-bold tracking-wide hover:border-neutral-900 transition-colors flex items-center justify-center gap-3"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Right: Receipt */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-4 flex flex-col gap-6"
      >
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">

          {/* Order number header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-100">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">Order Number</p>
              <p className="text-lg font-black text-neutral-900">#{orderNumber}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00a680]/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00a680]" />
              <span className="text-xs font-bold text-[#00a680]">{isCod ? 'COD' : 'Confirmed'}</span>
            </div>
          </div>

          {/* Product row */}
          {product && (
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-[#f7f7f7] rounded-lg border border-neutral-200 flex items-center justify-center p-2 shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <Package className="w-6 h-6 text-neutral-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-neutral-900 leading-tight">{product.name}</span>
                  <span className="font-bold text-neutral-900 shrink-0">{formatInr(totalPaise)}</span>
                </div>
                <span className="text-xs text-neutral-500">Qty: {quantity}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-4 border-t border-b border-neutral-100 mb-6">
            <span className="font-bold text-neutral-600">{isCod ? 'Pay on delivery' : 'Total Paid'}</span>
            <span className="font-black text-xl text-neutral-900">{formatInr(totalPaise)}</span>
          </div>

          {/* Shipping info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">Customer</p>
              <p className="text-sm font-bold text-neutral-900">{customerName}</p>
              {shipping.email && <p className="text-sm text-neutral-500">{shipping.email}</p>}
              {shipping.phone && <p className="text-sm text-neutral-500">{shipping.phone}</p>}
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">Ship to</p>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div className="text-sm text-neutral-600 leading-relaxed">
                  <p>{shipping.street}</p>
                  <p>{shipping.city}{shipping.postalCode ? `, ${shipping.postalCode}` : ''}</p>
                  <p>India</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Full-width order status tracker */}
      <OrderTracker currentStatus="confirmed" />

    </div>
  );
}
