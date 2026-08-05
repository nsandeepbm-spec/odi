import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { formatInr } from '../../data/products';
import { useCheckout } from '../../lib/checkout';

interface SummaryItem {
  id?: string;
  name: string;
  pricePaise: number;
  quantity: number;
  imageUrl?: string;
  images?: string[];
  tag?: string;
}

export function CheckoutOrderSummary({ currentItem }: { currentItem?: SummaryItem }) {
  const { items, getTotal } = useCartStore();
  const { product, quantity, subtotalPaise, discountPaise, totalPaise, couponCode } = useCheckout();

  const checkoutItem: SummaryItem | null = product
    ? {
        id: product.slug,
        name: product.name,
        pricePaise: product.price_paise,
        quantity,
        imageUrl: product.media?.card?.url ?? product.images?.[0]?.url ?? '',
        tag: product.tag ?? undefined,
      }
    : null;

  const displayItems: SummaryItem[] = currentItem
    ? [currentItem]
    : checkoutItem
      ? [checkoutItem]
      : items;

  // Prefer live checkout totals (includes coupon) whenever a checkout product is loaded.
  const useCheckoutTotals = !!checkoutItem;

  const subtotal = useCheckoutTotals
    ? subtotalPaise
    : currentItem
      ? currentItem.pricePaise * currentItem.quantity
      : getTotal();

  const discount = useCheckoutTotals ? discountPaise : 0;
  const showCoupon = useCheckoutTotals && !!couponCode && discount > 0;

  const total = useCheckoutTotals
    ? totalPaise
    : currentItem
      ? currentItem.pricePaise * currentItem.quantity
      : getTotal();

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-7 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

      <div className="flex flex-col gap-4 mb-6">
        {displayItems.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">Your cart is empty.</p>
        ) : (
          displayItems.map((item, idx) => (
            <div key={item.id ?? idx} className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#f7f7f7] rounded-lg border border-neutral-200 flex items-center justify-center p-2 shrink-0">
                <img
                  src={item.imageUrl || item.images?.[0]}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-neutral-900 leading-tight">{item.name}</span>
                  <span className="font-bold text-neutral-900 shrink-0">
                    {formatInr(item.pricePaise * item.quantity)}
                  </span>
                </div>
                <span className="text-xs text-neutral-500 mb-1">Qty: {item.quantity}</span>
                {item.tag && (
                  <span className="inline-flex self-start px-2 py-0.5 rounded bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold tracking-wide">
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="border-neutral-100 my-4" />

      <div className="space-y-3 text-sm text-neutral-600 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatInr(subtotal)}</span>
        </div>
        {showCoupon ? (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon · {couponCode}</span>
            <span>−{formatInr(discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-[#00a680] font-bold">FREE</span>
        </div>
      </div>

      <hr className="border-neutral-100 my-4" />

      <div className="flex justify-between items-center mb-6">
        <span className="font-black text-xl text-neutral-900">Total</span>
        <div className="text-right">
          {showCoupon && (
            <p className="text-xs text-neutral-400 line-through mb-0.5">{formatInr(subtotal)}</p>
          )}
          <span className="font-black text-2xl text-neutral-900">{formatInr(total)}</span>
          {showCoupon && (
            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
              Coupon saves {formatInr(discount)}
            </p>
          )}
        </div>
      </div>

      <div className="w-full bg-[#f4f6ff] border border-[#e0e7ff] rounded-xl p-4 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-[#6366f1] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <p className="text-[11px] font-bold text-[#4f46e5] leading-tight">
          Secure Checkout with SSL
          <br />
          Encryption
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-neutral-500 mt-6">
        <Link to="/contact" className="hover:text-neutral-900">
          Need Help?
        </Link>
        <span>•</span>
        <Link to="/shipping-policy" className="hover:text-neutral-900">
          Shipping Policy
        </Link>
      </div>
    </div>
  );
}
