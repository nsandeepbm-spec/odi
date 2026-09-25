import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, MessageSquare, Pencil, Star, Trash2 } from 'lucide-react';
import {
  Card,
  EmptyState,
  TableSkeleton,
  ListPager,
} from '../../../components/dashboard/shared';
import {
  deleteAdminReview,
  listAdminReviews,
  updateAdminReview,
  type AdminReview,
} from '../../../lib/api';

const PER_PAGE = 20;
const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

export default function AdminReviewsPage() {
  const [items, setItems] = useState<AdminReview[]>([]);
  const [page, setPage] = useState(1);
  const [productSlug, setProductSlug] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: PER_PAGE, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminReviews(page, PER_PAGE, productSlug || undefined);
      setItems(result.reviews);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, productSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const openEdit = (review: AdminReview) => {
    setEditing(review);
    setRating(review.rating);
    setTitle(review.title ?? '');
    setBody(review.body);
    setFormError(null);
  };

  const closeEdit = () => {
    setEditing(null);
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (body.trim().length < 3) {
      setFormError('Review text must be at least a few words.');
      return;
    }
    setBusyId(editing.id);
    setFormError(null);
    try {
      await updateAdminReview(editing.id, {
        rating,
        title: title.trim() || null,
        body: body.trim(),
      });
      closeEdit();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save review');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (review: AdminReview) => {
    const label = review.product_name ?? 'this product';
    if (!window.confirm(`Delete review for “${label}” by ${review.author_name}?`)) return;
    setBusyId(review.id);
    try {
      await deleteAdminReview(review.id);
      if (editing?.id === review.id) closeEdit();
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not delete review');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
              <MessageSquare className="w-3 h-3" />
              Catalog
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
              Customer reviews
            </span>
          </div>
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            Product{' '}
            <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Reviews.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
            Edit or remove customer reviews shown on product pages. Customers can edit their own reviews but cannot delete them.
          </p>
        </div>
      </header>

      <Card className={`relative z-10 min-w-0 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-500/40 flex flex-col sm:flex-row gap-3 sm:items-center">
          <form
            className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setProductSlug(slugInput.trim());
            }}
          >
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="Filter by product slug (e.g. space-explorer)"
              className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white outline-none focus:border-cyan-500/50"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-black hover:bg-cyan-400"
              >
                Apply
              </button>
              {(productSlug || slugInput) && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugInput('');
                    setProductSlug('');
                    setPage(1);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-neutral-300 hover:bg-white/[0.04]"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
            {meta.total} review{meta.total === 1 ? '' : 's'}
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <div className="p-10 flex flex-col items-center text-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="font-bold text-sm text-white">Could not load reviews</p>
            <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            subtitle="When customers publish reviews after delivery, they appear here."
          />
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {items.map((review) => (
              <li key={review.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {review.product_name ?? 'Product'}
                      {review.product_slug && (
                        <span className="text-neutral-500 font-medium"> · {review.product_slug}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {review.author_name}
                      {review.author_email ? ` · ${review.author_email}` : ''}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
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
                      onClick={() => openEdit(review)}
                      disabled={busyId === review.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-transparent text-[10px] font-bold text-cyan-400 hover:bg-white/[0.04] uppercase tracking-wider disabled:opacity-50"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(review)}
                      disabled={busyId === review.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-[10px] font-bold text-red-400 hover:bg-red-500/10 uppercase tracking-wider disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
                {review.title && (
                  <p className="text-sm font-bold text-neutral-200 mb-1">{review.title}</p>
                )}
                <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{review.body}</p>
                <p className="text-[10px] text-neutral-600 mt-2">{formatDate(review.created_at)}</p>
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && meta.totalPages > 1 && (
          <ListPager
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={closeEdit}
          />
          <form
            onSubmit={handleSave}
            className="relative w-full sm:max-w-lg bg-[#0A0A0A] border border-white/[0.08] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500 mb-1">
                Edit review
              </p>
              <p className="text-sm font-bold text-white">
                {editing.product_name ?? 'Product'} · {editing.author_name}
              </p>
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
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white outline-none focus:border-cyan-500/50 resize-y min-h-[120px]"
              />
            </div>

            {formError && <p className="text-xs text-red-400 font-medium">{formError}</p>}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={busyId === editing.id}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400 disabled:opacity-60"
              >
                {busyId === editing.id ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm font-bold text-neutral-300 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}
