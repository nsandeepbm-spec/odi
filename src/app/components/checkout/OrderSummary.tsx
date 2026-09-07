import React from 'react';
import { formatInr } from '../../data/products';
import { useCheckout, type ShippingQuoteStatus } from '../../lib/checkout';

function shippingLine(status: ShippingQuoteStatus, paise: number) {
  if (status === 'loading') return 'Calculating…';
  if (status === 'idle') return 'At shipping step';
  if (status === 'error') return 'Unavailable';
  return formatInr(paise);
}

export function OrderSummary({ compact = false }: { compact?: boolean }) {
  const {
    product,
    quantity,
    subtotalPaise,
    discountPaise,
    totalPaise,
    shippingPaise,
    shippingQuoteStatus,
  } = useCheckout();

  if (!product) return null;

  return (
    <div className={`bg-neutral-50 rounded-2xl border border-neutral-100 ${compact ? 'p-5' : 'p-6 md:p-8'}`}>
      <h3 className="text-sm font-black tracking-tight mb-5">Order Summary</h3>

      <div className="flex gap-4 mb-5">
        <div className="w-16 h-20 bg-white rounded-lg border border-neutral-200 overflow-hidden shrink-0">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-neutral-900 truncate">{product.name}</p>
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mt-0.5">
            {product.volume}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Qty {quantity}</p>
          <p className="text-sm font-black mt-1">{formatInr(product.price_paise * quantity)}</p>
        </div>
      </div>

      <div className="space-y-2.5 text-sm border-t border-neutral-200 pt-4">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>{formatInr(subtotalPaise)}</span>
        </div>
        {discountPaise > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span>−{formatInr(discountPaise)}</span>
          </div>
        )}
        <div className="flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span className="font-bold">{shippingLine(shippingQuoteStatus, shippingPaise)}</span>
        </div>
        <div className="flex justify-between font-black text-lg pt-3 border-t border-neutral-200">
          <span>Total</span>
          <span>{formatInr(totalPaise)}</span>
        </div>
      </div>
    </div>
  );
}
