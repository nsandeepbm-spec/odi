import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { CheckCircle2, Star, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import {
  createProductReview,
  listMyOrders,
  listMyReviews,
  type UserOrder,
} from '../lib/api';
import { deliveryStageFromDelhivery } from '../lib/deliveryStage';

const SESSION_SHOWN_KEY = 'odi-review-prompt-session';
const SESSION_DISMISS_KEY = 'odi-review-prompt-dismissed-session';

type PendingReview = {
  slug: string;
  name: string;
  imageUrl: string | null;
  orderNumber: string;
};

/** Once per browser-tab login session. */
function wasShownThisSession(userId: string): boolean {
  try {
    return sessionStorage.getItem(`${SESSION_SHOWN_KEY}:${userId}`) === '1';
  } catch {
    return false;
  }
}

function markShownThisSession(userId: string) {
  try {
    sessionStorage.setItem(`${SESSION_SHOWN_KEY}:${userId}`, '1');
  } catch {
    /* ignore */
  }
}

function loadSessionDismissed(userId: string): Set<string> {
  try {
    const raw = sessionStorage.getItem(`${SESSION_DISMISS_KEY}:${userId}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSessionDismissed(userId: string, slug: string) {
  try {
    const next = loadSessionDismissed(userId);
    next.add(slug);
    sessionStorage.setItem(`${SESSION_DISMISS_KEY}:${userId}`, JSON.stringify([...next]));
  } catch {
    /* ignore */
  }
}

/** Delivered for review: order status or live Delhivery stage. */
function isDeliveredForReview(order: UserOrder): boolean {
  if (order.status === 'delivered') return true;
  return (
    deliveryStageFromDelhivery({
      status: order.delhivery_status,
      statusType: null,
    }) === 'delivered'
  );
}

function pendingFromOrders(orders: UserOrder[], reviewedSlugs: Set<string>): PendingReview[] {
  const seen = new Set<string>();
  const out: PendingReview[] = [];
  for (const order of orders) {
    if (!isDeliveredForReview(order)) continue;
    for (const item of order.order_items ?? []) {
      const slug = item.snapshot_slug;
      if (!slug || seen.has(slug) || reviewedSlugs.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        name: item.snapshot_name,
        imageUrl: item.snapshot_image_url ?? null,
        orderNumber: order.order_number ?? order.id.slice(0, 8).toUpperCase(),
      });
    }
  }
  return out;
}

function StarsInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label={`Rate ${n} stars`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Centered review modal — once per login session when a delivered kit
 * still needs a review. Email `?review=1` can force it open.
 * "Not now" dismisses for this session only; next login can prompt again.
 */
export function ReviewPrompt() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewQuery = searchParams.get('review') === '1';
  const productQuery = searchParams.get('product');

  const hideOnPath =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/dashboard/admin');

  const [pending, setPending] = useState<PendingReview[]>([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = pending[0] ?? null;
  const userId = user?.id ?? null;

  // Clear session flags on logout so the next login can prompt again.
  // Also drop the old permanent localStorage dismiss key (pre-fix).
  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setPending([]);
      setOpen(false);
      setExpanded(false);
      setDone(false);
      return;
    }
    try {
      localStorage.removeItem('odi-review-prompt-dismissed');
    } catch {
      /* ignore */
    }
  }, [authLoading, userId]);

  useEffect(() => {
    if (authLoading || !userId || !user) return;
    // Wait until we leave auth screens so we don't mark "shown" while hidden.
    if (hideOnPath && !reviewQuery) return;
    if (!reviewQuery && wasShownThisSession(userId)) return;

    let cancelled = false;

    (async () => {
      try {
        const [orderRes, myReviews] = await Promise.all([
          listMyOrders(1, 50),
          listMyReviews(),
        ]);
        if (cancelled) return;

        const reviewed = new Set(
          myReviews.map((r) => r.product_slug).filter((s): s is string => Boolean(s))
        );
        const dismissed = loadSessionDismissed(userId);
        let list = pendingFromOrders(orderRes.orders, reviewed).filter((p) => !dismissed.has(p.slug));

        if (reviewQuery && productQuery) {
          const forced = pendingFromOrders(orderRes.orders, reviewed).find(
            (p) => p.slug === productQuery
          );
          if (forced) {
            list = [forced, ...list.filter((p) => p.slug !== forced.slug)];
          }
        }

        if (cancelled) return;

        setPending(list);
        if (list.length > 0) {
          setOpen(true);
          if (reviewQuery) setExpanded(true);
          markShownThisSession(userId);
        } else {
          setOpen(false);
          if (!reviewQuery) markShownThisSession(userId);
        }
      } catch (err) {
        console.warn('[ReviewPrompt] failed to load pending reviews', err);
        if (!cancelled) {
          setPending([]);
          setOpen(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, userId, hideOnPath, reviewQuery, productQuery]);

  // After logout, clear session keys for the previous user (best-effort via last id in storage is hard —
  // clear on next login mismatch by wiping known key when user becomes null after having been set).
  useEffect(() => {
    if (authLoading || userId) return;
    // Wipe any leftover keys from common pattern (cannot enumerate sessionStorage keys safely for prefix on all browsers)
    try {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (
          k &&
          (k.startsWith(`${SESSION_SHOWN_KEY}:`) || k.startsWith(`${SESSION_DISMISS_KEY}:`))
        ) {
          keys.push(k);
        }
      }
      keys.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }, [authLoading, userId]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const clearReviewQuery = () => {
    if (!reviewQuery) return;
    const next = new URLSearchParams(searchParams);
    next.delete('review');
    setSearchParams(next, { replace: true });
  };

  const closePrompt = () => {
    setOpen(false);
    setExpanded(false);
    setDone(false);
    setError(null);
    setRating(5);
    setTitle('');
    setBody('');
    setPending([]);
    clearReviewQuery();
    if (userId) markShownThisSession(userId);
  };

  const dismiss = () => {
    if (userId && current) saveSessionDismissed(userId, current.slug);
    closePrompt();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    if (body.trim().length < 3) {
      setError('Please write a short review (a few words is enough).');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createProductReview(current.slug, {
        rating,
        title: title.trim() || null,
        body: body.trim(),
      });
      setDone(true);
      if (userId) saveSessionDismissed(userId, current.slug);
      window.setTimeout(() => {
        closePrompt();
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish review');
    } finally {
      setSaving(false);
    }
  };

  if (hideOnPath || !user || !open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Review your purchase"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/55 backdrop-blur-[2px]"
        aria-label="Close review dialog"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-[52rem] max-h-[min(92vh,44rem)] overflow-y-auto rounded-3xl bg-white shadow-2xl shadow-black/25 border border-neutral-200/80">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-sm transition-colors"
          aria-label="Close review prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative bg-gradient-to-br from-neutral-100 via-neutral-50 to-white border-b md:border-b-0 md:border-r border-neutral-100 min-h-[12rem] md:min-h-[28rem] flex flex-col">
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10">
              {current.imageUrl ? (
                <img
                  src={current.imageUrl}
                  alt={current.name}
                  className="max-h-44 sm:max-h-56 md:max-h-72 w-auto max-w-full object-contain drop-shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-neutral-200/80 flex items-center justify-center text-neutral-400 text-xs font-bold tracking-wider uppercase">
                  ODI
                </div>
              )}
            </div>
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                Delivered kit
              </p>
              <p className="text-lg sm:text-xl font-black text-neutral-900 leading-snug">
                {current.name}
              </p>
              <p className="text-xs text-neutral-500 mt-1.5 font-medium">
                Order {current.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            {done ? (
              <div className="flex flex-col items-center text-center py-8 gap-3">
                <CheckCircle2 className="w-11 h-11 text-emerald-500" />
                <p className="text-lg font-black text-neutral-900">Thank you</p>
                <p className="text-sm text-neutral-500">Your review is now live.</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  ODI Kids
                </p>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2">
                  How was your kit?
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-7 max-w-sm">
                  A short review helps other families choose with confidence.
                </p>

                {expanded ? (
                  <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Rating
                      </p>
                      <StarsInput value={rating} onChange={setRating} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                        Title (optional)
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. My child loved it"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                        Your review
                      </label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows={4}
                        placeholder="What did you enjoy?"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900 resize-y min-h-[96px]"
                      />
                    </div>
                    {error ? <p className="text-sm text-red-500 font-medium">{error}</p> : null}
                    <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={dismiss}
                        className="sm:flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
                      >
                        Later
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="sm:flex-[1.35] py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 disabled:opacity-60"
                      >
                        {saving ? 'Publishing…' : 'Publish review'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="w-full py-3.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800"
                    >
                      Write a review
                    </button>
                    <div className="flex items-center justify-center gap-3 text-xs font-bold pt-0.5">
                      <Link
                        to={`/dashboard/reviews?product=${encodeURIComponent(current.slug)}`}
                        onClick={closePrompt}
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        Open in dashboard
                      </Link>
                      <span className="text-neutral-300">·</span>
                      <button
                        type="button"
                        onClick={dismiss}
                        className="text-neutral-400 hover:text-neutral-700"
                      >
                        Not now
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
