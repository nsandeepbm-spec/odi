import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { listCouponOffers, type CouponOffer } from '../../lib/api';
import { formatInr } from '../../data/products';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  quantity: number;
  appliedCode: string | null;
  applying: boolean;
  onApply: (code: string) => Promise<boolean>;
  onClear: () => void;
  /** Prefetched on checkout page load — modal opens with data ready */
  initialOffers?: CouponOffer[];
  initialOffersKey?: string;
};

type CacheEntry = {
  key: string;
  offers: CouponOffer[];
};

function offerValueLabel(offer: CouponOffer) {
  if (offer.type === 'percent') return `${offer.value}% OFF`;
  return `${formatInr(offer.value)} OFF`;
}

function OffersSkeleton() {
  return (
    <ul className="space-y-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="rounded-xl border border-neutral-100 bg-neutral-50 px-3.5 py-3 animate-pulse"
        >
          <div className="flex justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/3 rounded bg-neutral-200" />
              <div className="h-3 w-16 rounded bg-neutral-200" />
              <div className="h-3 w-1/2 rounded bg-neutral-100" />
            </div>
            <div className="h-3 w-12 rounded bg-neutral-200 shrink-0" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CouponOffersModal({
  open,
  onOpenChange,
  productId,
  quantity,
  appliedCode,
  applying,
  onApply,
  onClear,
  initialOffers,
  initialOffersKey,
}: Props) {
  const cacheRef = useRef<CacheEntry | null>(null);
  const [offers, setOffers] = useState<CouponOffer[]>(initialOffers ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const cacheKey = `${productId}:${quantity}`;

  // Keep bottom sheet above the mobile keyboard (visualViewport)
  useEffect(() => {
    if (!open) {
      setKeyboardOffset(0);
      setViewportHeight(null);
      return;
    }

    const mq = window.matchMedia('(max-width: 639px)');
    const syncMq = () => setIsCompact(mq.matches);
    syncMq();
    mq.addEventListener('change', syncMq);

    const vv = window.visualViewport;
    const syncVv = () => {
      if (!mq.matches) {
        setKeyboardOffset(0);
        setViewportHeight(null);
        return;
      }
      if (!vv) {
        setViewportHeight(window.innerHeight);
        setKeyboardOffset(0);
        return;
      }
      const layoutH = window.innerHeight;
      const visibleH = vv.height;
      const offsetTop = vv.offsetTop;
      const inset = Math.max(0, Math.round(layoutH - visibleH - offsetTop));
      setKeyboardOffset(inset);
      setViewportHeight(Math.round(visibleH));
    };

    syncVv();
    vv?.addEventListener('resize', syncVv);
    vv?.addEventListener('scroll', syncVv);
    window.addEventListener('resize', syncVv);
    return () => {
      mq.removeEventListener('change', syncMq);
      vv?.removeEventListener('resize', syncVv);
      vv?.removeEventListener('scroll', syncVv);
      window.removeEventListener('resize', syncVv);
    };
  }, [open]);

  // Seed from parent prefetch (checkout page load)
  useEffect(() => {
    if (!initialOffers || !initialOffersKey) return;
    if (initialOffersKey !== cacheKey) return;
    cacheRef.current = { key: cacheKey, offers: initialOffers };
    setOffers(initialOffers);
    setLoading(false);
    setError(null);
  }, [initialOffers, initialOffersKey, cacheKey]);

  // Prefetch / refresh when product or qty changes
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    const cached = cacheRef.current;
    if (cached?.key === cacheKey) {
      setOffers(cached.offers);
      setLoading(false);
      setError(null);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await listCouponOffers({ productId, quantity });
        if (cancelled) return;
        cacheRef.current = { key: cacheKey, offers: res.offers };
        setOffers(res.offers);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        cacheRef.current = null;
        setOffers([]);
        setError(err instanceof Error ? err.message : 'Could not load offers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId, quantity, cacheKey]);

  useEffect(() => {
    if (!open) return;
    setManualCode(appliedCode ?? '');
    setCheckMessage(null);
    setSelectedCode(appliedCode);
  }, [open, appliedCode]);

  const selectedOffer = offers.find((o) => o.code === selectedCode) ?? null;
  const previewPaise =
    selectedOffer?.eligible && selectedOffer.discount_preview_paise > 0
      ? selectedOffer.discount_preview_paise
      : 0;

  const handleCheck = async () => {
    const code = manualCode.trim().toUpperCase();
    if (!code) {
      setCheckMessage('Enter a coupon code');
      return;
    }
    setSelectedCode(code);
    setCheckMessage(null);
    const ok = await onApply(code);
    if (ok) onOpenChange(false);
    else setCheckMessage('Could not apply this code — check the message below the coupon row');
  };

  const handleApplySelected = async () => {
    if (!selectedCode) return;
    if (selectedOffer && !selectedOffer.eligible) return;
    const ok = await onApply(selectedCode);
    if (ok) onOpenChange(false);
    else setCheckMessage('Could not apply this offer — try another code');
  };

  const showSkeleton = loading && offers.length === 0;
  const keyboardOpen = isCompact && keyboardOffset > 80;
  const sheetMaxHeight =
    isCompact && viewportHeight != null
      ? Math.max(280, Math.min(viewportHeight - 8, Math.floor(viewportHeight * 0.96)))
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={
          isCompact
            ? {
                ...(sheetMaxHeight != null ? { maxHeight: `${sheetMaxHeight}px` } : null),
                bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 0,
              }
            : undefined
        }
        className={[
          'p-0 gap-0 border-neutral-200 bg-white text-neutral-900 shadow-2xl overflow-hidden',
          // Mobile: bottom sheet that shrinks with the visual viewport / keyboard
          'fixed inset-x-0 bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0',
          'w-full max-w-none rounded-t-2xl rounded-b-none max-h-[min(92dvh,100%)]',
          'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          'sm:inset-auto sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:right-auto',
          'sm:translate-x-[-50%] sm:translate-y-[-50%]',
          'sm:w-full sm:max-w-md sm:rounded-2xl sm:max-h-[85dvh]',
          'sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0',
          'flex flex-col',
          'transition-[max-height,bottom] duration-200 ease-out',
        ].join(' ')}
      >
        {/* Mobile drag hint — hide when keyboard open to save space */}
        {!keyboardOpen ? (
          <div className="sm:hidden flex justify-center pt-2 pb-0 shrink-0" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-neutral-300" />
          </div>
        ) : null}

        <DialogHeader
          className={`px-4 sm:px-5 border-b border-neutral-100 text-left pr-12 shrink-0 ${
            keyboardOpen ? 'pt-2 pb-2' : 'pt-3 sm:pt-5 pb-3'
          }`}
        >
          <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-neutral-900">
            Apply Coupon
          </DialogTitle>
          {!keyboardOpen ? (
            <DialogDescription className="text-xs sm:text-sm text-neutral-500 mt-1">
              One offer per order. Enter a code or pick from available offers.
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              Enter a coupon code or pick an offer.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="px-4 sm:px-5 py-3 border-b border-neutral-100 shrink-0">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-2 block">
            Have a coupon code?
          </label>
          <div className="flex gap-2">
            <input
              ref={codeInputRef}
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value.toUpperCase());
                setCheckMessage(null);
              }}
              onFocus={() => {
                // After keyboard animates, keep the field in the visible sheet
                window.setTimeout(() => {
                  codeInputRef.current?.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  });
                }, 300);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleCheck();
                }
              }}
              placeholder="Enter code"
              className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900 uppercase placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={() => void handleCheck()}
              disabled={applying}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-colors shrink-0 disabled:opacity-50"
            >
              {applying ? '…' : 'CHECK'}
            </button>
          </div>
          {checkMessage && (
            <p className="text-xs text-red-500 mt-2 font-medium break-words">{checkMessage}</p>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 overflow-y-auto flex-1 min-h-0 overscroll-contain touch-pan-y">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-3 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            Available offers
            {loading && offers.length > 0 ? (
              <Loader2 className="w-3 h-3 animate-spin text-neutral-400 ml-1" />
            ) : null}
          </p>

          {showSkeleton ? (
            <OffersSkeleton />
          ) : error ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-sm text-red-500 break-words px-2">{error}</p>
              <p className="text-xs text-neutral-500">
                You can still type a private code above.
              </p>
            </div>
          ) : offers.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center px-2">
              No public offers for this product right now. You can still enter a private code above.
            </p>
          ) : (
            <ul className="space-y-2 pb-1">
              {offers.map((offer) => {
                const selected = selectedCode === offer.code;
                const locked = !offer.eligible;
                return (
                  <li key={offer.id}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        if (locked) return;
                        setSelectedCode(offer.code);
                        setManualCode(offer.code);
                        setCheckMessage(null);
                        // Blur input so keyboard closes and full list / APPLY is usable
                        codeInputRef.current?.blur();
                      }}
                      className={`w-full text-left rounded-xl border px-3 py-3 sm:px-3.5 transition-colors ${
                        locked
                          ? 'border-neutral-100 bg-neutral-50 opacity-60 cursor-not-allowed'
                          : selected
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 bg-white hover:border-neutral-400 active:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-neutral-900 text-sm leading-snug break-words">
                            {offer.title}
                          </p>
                          <p className="text-xs font-mono font-bold text-neutral-500 mt-0.5 tracking-wide">
                            {offer.code}
                          </p>
                          {offer.description ? (
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed break-words">
                              {offer.description}
                            </p>
                          ) : null}
                          {locked && offer.reason ? (
                            <p className="text-xs text-amber-700 mt-1.5 font-medium break-words">
                              {offer.reason}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right shrink-0 max-w-[35%]">
                          <p className="text-[11px] sm:text-xs font-black text-emerald-700 tracking-wide">
                            {offerValueLabel(offer)}
                          </p>
                          {offer.eligible && offer.discount_preview_paise > 0 ? (
                            <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1">
                              Save {formatInr(offer.discount_preview_paise)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={`px-4 sm:px-5 border-t border-neutral-100 bg-neutral-50/90 flex flex-col gap-2 sm:gap-3 shrink-0 ${
            keyboardOpen ? 'py-2' : 'py-3 sm:py-4'
          } pb-[max(0.5rem,env(safe-area-inset-bottom))]`}
        >
          {!keyboardOpen ? (
            <div className="text-sm min-w-0">
              {appliedCode ? (
                <p className="font-medium text-neutral-700 break-words">
                  Applied:{' '}
                  <span className="font-mono font-bold text-neutral-900">{appliedCode}</span>
                </p>
              ) : previewPaise > 0 ? (
                <p className="font-bold text-emerald-700">You save {formatInr(previewPaise)}</p>
              ) : (
                <p className="text-neutral-500 text-xs sm:text-sm">Select an offer to apply</p>
              )}
            </div>
          ) : null}
          <div className="flex items-stretch sm:items-center gap-2 w-full">
            {appliedCode ? (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setSelectedCode(null);
                  setManualCode('');
                  setCheckMessage(null);
                }}
                className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-white transition-colors"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              disabled={
                applying || !selectedCode || (!!selectedOffer && !selectedOffer.eligible)
              }
              onClick={() => void handleApplySelected()}
              className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {applying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              APPLY
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
