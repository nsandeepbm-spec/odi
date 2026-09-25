import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Tag, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCartStore, CART_MAX_QTY } from '../../store/cartStore';
import { formatInr, isProductPurchasable } from '../../data/products';
import { persistCheckoutProduct } from '../../lib/checkout';
import {
  getPublicProduct,
  listCouponOffers,
  validateCoupon,
  type CouponOffer,
} from '../../lib/api';
import { auth } from '../../lib/firebase';

function offerValueLabel(offer: CouponOffer) {
  if (offer.type === 'percent') return `${offer.value}% OFF`;
  return `${formatInr(offer.value)} OFF`;
}

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotal,
    getDiscountedTotal,
    couponCode,
    couponDiscountPaise,
    setAppliedCoupon,
    clearAppliedCoupon,
  } = useCartStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [offers, setOffers] = useState<CouponOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const primary = items[0] ?? null;
  const subtotal = getTotal();
  const discount =
    couponCode && couponDiscountPaise > 0 ? Math.min(couponDiscountPaise, subtotal) : 0;
  const total = getDiscountedTotal();

  useEffect(() => {
    if (!isDrawerOpen) {
      setShowOffers(false);
      return;
    }
    window.history.pushState({ cartOpen: true }, '');
    const handlePopState = () => closeDrawer();
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.cartOpen) {
        window.history.back();
      }
    };
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen || !primary) {
      setProductId(null);
      setOffers([]);
      return;
    }
    let cancelled = false;
    setOffersLoading(true);
    (async () => {
      try {
        const product = await getPublicProduct(primary.id);
        if (cancelled) return;
        setProductId(product.id);
        const res = await listCouponOffers({
          productId: product.id,
          quantity: primary.quantity,
        });
        if (!cancelled) setOffers(res.offers);
      } catch {
        if (!cancelled) {
          setProductId(null);
          setOffers([]);
        }
      } finally {
        if (!cancelled) setOffersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isDrawerOpen, primary?.id, primary?.quantity]);

  useEffect(() => {
    if (!isDrawerOpen || !couponCode || !productId || !primary) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await validateCoupon({
          code: couponCode,
          items: [{ productId, quantity: primary.quantity }],
        });
        if (cancelled) return;
        setAppliedCoupon(result.code, result.discount_paise);
        setCouponMessage(
          result.discount_paise > 0
            ? `Offer ${result.code} applied — you save ${formatInr(result.discount_paise)}`
            : `Offer ${result.code} applied`
        );
      } catch (err) {
        if (cancelled) return;
        clearAppliedCoupon();
        setCouponMessage(err instanceof Error ? err.message : 'Coupon no longer valid');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    isDrawerOpen,
    couponCode,
    productId,
    primary?.quantity,
    setAppliedCoupon,
    clearAppliedCoupon,
  ]);

  useEffect(() => {
    if (showOffers) setManualCode(couponCode ?? '');
  }, [showOffers, couponCode]);

  const applyCoupon = async (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setCouponMessage('Enter a coupon code');
      return;
    }
    if (!productId || !primary) {
      setCouponMessage('Product not loaded yet');
      return;
    }
    setCouponApplying(true);
    setCouponMessage(null);
    try {
      const result = await validateCoupon({
        code: normalized,
        items: [{ productId, quantity: primary.quantity }],
      });
      setAppliedCoupon(result.code, result.discount_paise);
      setCouponMessage(
        result.discount_paise > 0
          ? `Offer ${result.code} applied — you save ${formatInr(result.discount_paise)}`
          : `Offer ${result.code} applied`
      );
      setShowOffers(false);
    } catch (err) {
      clearAppliedCoupon();
      setCouponMessage(err instanceof Error ? err.message : 'Invalid or expired coupon');
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCoupon = () => {
    clearAppliedCoupon();
    setCouponMessage(null);
    setManualCode('');
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    const slug = items[0].id;
    setBusy(true);
    setCartError(null);
    try {
      const product = await getPublicProduct(slug);
      if (!isProductPurchasable(product)) {
        removeItem(slug);
        setCartError('This kit is coming soon and can’t be checked out yet.');
        return;
      }
      const latest = useCartStore.getState().items.find((i) => i.id === slug);
      if (!latest) {
        setCartError('Your cart is empty.');
        return;
      }
      const qty = persistCheckoutProduct(latest.id, latest.quantity);
      closeDrawer();
      const reviewPath = `/checkout/review?product=${latest.id}`;
      if (!auth.currentUser) {
        navigate(`/login?redirect=${encodeURIComponent(reviewPath)}`, {
          state: { checkoutQuantity: qty },
        });
        return;
      }
      navigate(reviewPath, {
        state: { checkoutQuantity: qty },
      });
    } catch {
      removeItem(slug);
      setCartError('This kit is not available for purchase.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h2 className="text-lg font-black text-neutral-900">Your Cart</h2>
                <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {items.length}
                </span>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                  <ShoppingBag className="w-16 h-16 text-neutral-200 mb-4" />
                  <p className="font-bold text-neutral-900 mb-2">Your cart is empty</p>
                  <p className="text-sm">Looks like you haven't added any products yet.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-neutral-50 rounded-lg border border-neutral-200 p-2 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-neutral-900 leading-tight">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mt-1">{formatInr(item.pricePaise)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-7 h-7 flex items-center justify-center border-l border-r border-neutral-300 text-xs font-bold">
                            {item.quantity}
                          </div>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= CART_MAX_QTY}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-neutral-900 ml-auto">
                          {formatInr(item.pricePaise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 ? (
              <div className="border-t border-neutral-100 bg-neutral-50 shrink-0">
                {/* Coupon — compact row + expand offers below */}
                <div className="px-6 pt-4 pb-2">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 flex items-center gap-1.5 mb-1">
                        <Tag className="w-3 h-3" />
                        Coupon
                      </p>
                      {couponCode ? (
                        <p className="text-sm font-bold text-neutral-900 font-mono truncate">
                          {couponCode}
                          {discount > 0 ? (
                            <span className="ml-2 text-xs font-bold text-emerald-700 font-sans">
                              −{formatInr(discount)}
                            </span>
                          ) : null}
                        </p>
                      ) : (
                        <p className="text-sm text-neutral-500">
                          {offersLoading
                            ? 'Loading…'
                            : offers.length > 0
                              ? `${offers.length} offer${offers.length === 1 ? '' : 's'} available`
                              : 'Have a code?'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {couponCode ? (
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="px-3 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-white"
                        >
                          Remove
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={!productId}
                        onClick={() => setShowOffers((v) => !v)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {showOffers ? 'Hide' : couponCode ? 'Change' : 'View offers'}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${showOffers ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {couponMessage ? (
                    <p
                      className={`text-xs font-medium mb-2 break-words ${
                        couponCode ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  ) : null}

                  <AnimatePresence initial={false}>
                    {showOffers ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={manualCode}
                              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  void applyCoupon(manualCode);
                                }
                              }}
                              placeholder="Enter code"
                              className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none focus:border-neutral-900 uppercase placeholder:text-neutral-400 bg-white"
                            />
                            <button
                              type="button"
                              disabled={couponApplying || !manualCode.trim()}
                              onClick={() => void applyCoupon(manualCode)}
                              className="px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold disabled:opacity-50"
                            >
                              {couponApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                            </button>
                          </div>

                          {offersLoading && offers.length === 0 ? (
                            <p className="text-xs text-neutral-400">Loading offers…</p>
                          ) : offers.length === 0 ? (
                            <p className="text-xs text-neutral-500">No public offers right now.</p>
                          ) : (
                            <ul className="space-y-2 max-h-40 overflow-y-auto">
                              {offers.map((offer) => {
                                const locked = !offer.eligible;
                                const active = couponCode === offer.code;
                                return (
                                  <li key={offer.id}>
                                    <button
                                      type="button"
                                      disabled={locked || couponApplying}
                                      onClick={() => void applyCoupon(offer.code)}
                                      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                                        locked
                                          ? 'border-neutral-100 bg-white/60 opacity-60 cursor-not-allowed'
                                          : active
                                            ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-neutral-900 truncate">
                                            {offer.title}
                                          </p>
                                          <p className="text-[11px] font-mono font-bold text-neutral-500">
                                            {offer.code}
                                          </p>
                                          {locked && offer.reason ? (
                                            <p className="text-[10px] text-amber-700 mt-0.5">{offer.reason}</p>
                                          ) : null}
                                        </div>
                                        <span className="text-[11px] font-black text-emerald-700 shrink-0">
                                          {offerValueLabel(offer)}
                                        </span>
                                      </div>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-neutral-200/80">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-neutral-600">Subtotal</span>
                      <span className="font-bold text-neutral-900">{formatInr(subtotal)}</span>
                    </div>
                    {discount > 0 ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-emerald-700">Discount</span>
                        <span className="font-bold text-emerald-700">−{formatInr(discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-900">Total</span>
                      <span className="font-black text-xl text-neutral-900">{formatInr(total)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 text-center mb-4">
                    Shipping and taxes calculated at checkout.
                  </p>
                  {cartError ? (
                    <p className="text-xs text-amber-700 font-medium text-center mb-3">{cartError}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void handleCheckout()}
                    disabled={busy}
                    className="w-full py-4 rounded-xl bg-black text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-60"
                  >
                    {busy ? 'Checking…' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
