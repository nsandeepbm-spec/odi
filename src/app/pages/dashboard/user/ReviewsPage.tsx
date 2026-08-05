import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, MessageSquare, Star, Trash2 } from 'lucide-react';
import { PageHeader, Card, EmptyState, DashboardSkeleton } from '../../../components/dashboard/shared';
import {
  createProductReview,
  deleteProductReview,
  listMyOrders,
  listMyReviews,
  updateProductReview,
  type MyReview,
  type UserOrder,
} from '../../../lib/api';

const REVIEWABLE_STATUSES = new Set(['paid', 'processing', 'shipped', 'delivered']);

type ReviewTarget = {
  slug: string;
  name: string;
  imageUrl: string | null;
  orderId: string;
  orderNumber: string;
};

function StarsInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`Rate ${n} stars`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function reviewTargetsFromOrders(orders: UserOrder[]): ReviewTarget[] {
  const seen = new Set<string>();
  const targets: ReviewTarget[] = [];

  for (const order of orders) {
    if (!REVIEWABLE_STATUSES.has(order.status)) continue;
    for (const item of order.order_items ?? []) {
      const slug = item.snapshot_slug;
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      targets.push({
        slug,
        name: item.snapshot_name,
        imageUrl: item.snapshot_image_url,
        orderId: order.id,
        orderNumber: order.order_number ?? order.id.slice(0, 8).toUpperCase(),
      });
    }
  }

  return targets;
}

export default function ReviewsPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, myReviews] = await Promise.all([listMyOrders(1, 50), listMyReviews()]);
      setOrders(orderRes.orders);
      setReviews(myReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reviewable = useMemo(() => {
    const reviewedSlugs = new Set(reviews.map((r) => r.product_slug).filter(Boolean));
    return reviewTargetsFromOrders(orders).filter((t) => !reviewedSlugs.has(t.slug));
  }, [orders, reviews]);

  const resetForm = () => {
    setActiveSlug(null);
    setEditingId(null);
    setRating(5);
    setTitle('');
    setBody('');
    setMessage(null);
  };

  const startNewReview = (target: ReviewTarget) => {
    setActiveSlug(target.slug);
    setEditingId(null);
    setRating(5);
    setTitle('');
    setBody('');
    setMessage(null);
  };

  const startEditReview = (review: MyReview) => {
    setActiveSlug(review.product_slug);
    setEditingId(review.id);
    setRating(review.rating);
    setTitle(review.title ?? '');
    setBody(review.body);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlug || body.trim().length < 3) {
      setMessage('Please write at least a few words in your review.');
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateProductReview(editingId, {
          rating,
          title: title.trim() || null,
          body: body.trim(),
        });
      } else {
        await createProductReview(activeSlug, {
          rating,
          title: title.trim() || null,
          body: body.trim(),
        });
      }
      resetForm();
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    setSaving(true);
    try {
      await deleteProductReview(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not delete review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardSkeleton cols={4} rows={5} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load reviews</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
      </div>
    );
  }

  const activeTarget = reviewable.find((t) => t.slug === activeSlug);
  const activeProductName =
    activeTarget?.name ??
    reviews.find((r) => r.product_slug === activeSlug)?.product_name ??
    'Product';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <PageHeader
        eyebrow="Your voice"
        title="Product"
        accent="Reviews."
        subtitle="Only kits from your paid orders can be reviewed. Reviews show on the product page."
      />

      <div className="space-y-6 relative z-10">
        <Card title="Purchased kits">
          {reviewable.length === 0 && !activeSlug ? (
            <EmptyState
              icon={MessageSquare}
              title="Nothing to review yet"
              subtitle="After you complete an order, that kit will appear here so you can write a review."
            />
          ) : activeSlug ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                {activeTarget?.imageUrl && (
                  <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0">
                    <img src={activeTarget.imageUrl} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{activeProductName}</p>
                  {activeTarget && (
                    <p className="text-[10px] text-neutral-500 font-bold mt-0.5">
                      Order #{activeTarget.orderNumber}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500 mb-2">
                  Rating
                </p>
                <StarsInput value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500 mb-2 block">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Perfect gift for my 8-year-old"
                  className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500 mb-2 block">
                  Review
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows={5}
                  placeholder="e.g. My child loved the 3D cards and kept asking questions about space…"
                  className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white outline-none focus:border-cyan-500/50 resize-y min-h-[120px]"
                />
              </div>

              {message && <p className="text-xs text-red-400 font-medium">{message}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Update review' : 'Publish review'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] bg-transparent text-sm font-bold text-neutral-300 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {reviewable.map((target) => (
                <li
                  key={`${target.orderId}-${target.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0">
                      {target.imageUrl ? (
                        <img src={target.imageUrl} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">
                          Kit
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{target.name}</p>
                      <p className="text-[10px] text-neutral-500 font-bold mt-0.5">
                        Order #{target.orderNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startNewReview(target)}
                    className="shrink-0 px-4 py-2 rounded-xl border border-white/20 bg-transparent text-xs font-bold text-neutral-300 hover:border-white/40 hover:bg-white/[0.04] transition-colors"
                  >
                    Write a review
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Your reviews">
          {reviews.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No reviews yet"
              subtitle="Published reviews appear here and on the product checkout page."
            />
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {reviews.map((review) => (
                <li key={review.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {review.product_name ?? 'Product'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-3.5 h-3.5 ${
                              n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditReview(review)}
                        className="px-3 py-1.5 rounded-lg border border-white/20 bg-transparent text-[10px] font-bold text-cyan-400 hover:bg-white/[0.04] uppercase tracking-wider"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(review.id)}
                        disabled={saving}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {review.title && (
                    <p className="text-sm font-bold text-neutral-200 mb-1">{review.title}</p>
                  )}
                  <p className="text-sm text-neutral-400 leading-relaxed">{review.body}</p>
                  <p className="text-[10px] text-neutral-600 mt-2">
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
