import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Minus,
  Plus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  Tag,
  RefreshCw,
  Banknote,
  Truck,
  Star,
  BookOpen,
  Glasses,
  Layers,
  Sticker,
} from 'lucide-react';
import { useCheckout } from '../lib/checkout';
import { discountPercent, formatInr, type KitItem } from '../data/products';
import { getPublicProductReviews, type PublicReview } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';

type DetailTab = 'description' | 'publisher' | 'author';

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'author', label: 'Author' },
];

const KIT_ICONS: Record<string, React.ElementType> = {
  'Fact Book': BookOpen,
  'Explorer Cards': Layers,
  'Cardboard 3D Glasses': Glasses,
  'Plastic 3D Glasses': Glasses,
  'Sticker Sheet': Sticker,
  'Sticker Set': Sticker,
  '3D Glasses': Glasses,
  'Glow Poster': Layers,
};

function kitIcon(item: KitItem) {
  return KIT_ICONS[item.name] ?? Check;
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${cls} ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
        />
      ))}
    </span>
  );
}

function reviewInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CheckoutPage() {
  const {
    product,
    isLoadingProduct,
    quantity,
    setQuantity,
    goToReview,
    couponInput,
    setCouponInput,
    couponMessage,
    couponApplying,
    couponCode,
    applyCoupon,
    clearCoupon,
    discountPaise,
  } = useCheckout();
  const [currentImg, setCurrentImg] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>('description');
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const { addItem, toggleDrawer } = useCartStore();

  useEffect(() => {
    if (!product?.slug) return;
    getPublicProductReviews(product.slug)
      .then((data) => setReviews(data.reviews))
      .catch(() => setReviews([]));
  }, [product?.slug]);

  if (isLoadingProduct) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Loading kit details...</p>
      </div>
    );
  }

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

  const off = discountPercent(product.price_paise, product.compare_at_paise);

  const productImages = product.media?.gallery?.map((g) => g.url) ?? [];
  if (product.media?.card?.url && !productImages.includes(product.media.card.url)) {
    productImages.unshift(product.media.card.url);
  }
  if (productImages.length === 0 && product.images.length > 0) {
    productImages.push(...product.images.map((img) => img.url));
  }

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % productImages.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + productImages.length) % productImages.length);

  const cartPayload = {
    id: product.slug,
    name: product.name,
    pricePaise: product.price_paise,
    quantity,
    imageUrl: productImages[0] ?? '',
  };

  const scrollToReviews = () => {
    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-5 items-start">
        {/* Gallery card — 1st on mobile */}
        <div className="order-1 lg:order-none lg:col-start-1 lg:col-span-8 lg:row-start-1 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="group relative w-full p-4 sm:p-5 md:p-6 flex items-center justify-center h-64 sm:h-80 md:h-96 lg:h-[500px]">
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous image"
              className="absolute left-2 sm:left-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/95 shadow-sm border border-neutral-200 text-neutral-600 hover:text-black transition-all opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={productImages[currentImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={nextImg}
              aria-label="Next image"
              className="absolute right-2 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/95 shadow-sm border border-neutral-200 text-neutral-600 hover:text-black transition-all opacity-70 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <span className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-[10px] sm:text-[11px] font-bold text-neutral-400 bg-white/80 px-2 py-0.5 rounded-md">
              {currentImg + 1} / {Math.max(1, productImages.length)}
            </span>
          </div>

          {/* Meta bar: Buy now · price · thumbnails — responsive */}
          <div className="border-t border-neutral-100 px-3 sm:px-5 py-3 sm:py-3.5">
            <div className="flex flex-col gap-3 sm:gap-3.5 lg:flex-row lg:items-center lg:gap-4">
              {/* Row 1 on mobile / left cluster on desktop: Buy now + price */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0">
                <button
                  type="button"
                  disabled={!product.available}
                  onClick={() => {
                    addItem(cartPayload);
                    goToReview();
                  }}
                  className="w-full sm:w-auto shrink-0 px-5 py-3 sm:py-2.5 rounded-xl bg-[#f05a13] text-white text-sm font-bold tracking-wide hover:bg-[#e0500e] active:scale-[0.99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.available ? 'BUY NOW' : 'COMING SOON'}
                </button>

                <div className="hidden sm:block w-px h-10 bg-neutral-100 shrink-0" />

                <div className="min-w-0 flex-1 sm:flex-none">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-none"
                      style={{ letterSpacing: '-0.03em' }}
                    >
                      {formatInr(product.price_paise)}
                    </span>
                    {off !== null && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black tracking-wide">
                        {off}% OFF
                      </span>
                    )}
                  </div>
                  {product.compare_at_paise != null && product.compare_at_paise > product.price_paise && (
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-1.5 leading-snug">
                      M.R.P.:{' '}
                      <span className="line-through decoration-neutral-400">
                        {formatInr(product.compare_at_paise)}
                      </span>
                      <span className="text-emerald-600 font-bold ml-1.5 sm:ml-2">
                        Save {formatInr(product.compare_at_paise - product.price_paise)} vs M.R.P.
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnails: full-width scroll on mobile, right-aligned on desktop */}
              <div className="-mx-3 sm:mx-0 px-3 sm:px-0 lg:ml-auto overflow-x-auto overscroll-x-contain scrollbar-thin">
                <div className="flex items-center gap-2 w-max sm:w-auto pb-0.5">
                  {productImages.map((img: string, idx: number) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setCurrentImg(idx)}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-neutral-50 transition-all border shrink-0 ${
                        currentImg === idx
                          ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1 sm:p-1.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About this kit — 3rd on mobile */}
        <div className="order-3 lg:order-none lg:col-start-1 lg:col-span-8 lg:row-start-2 bg-white border border-neutral-200 rounded-2xl p-5 md:p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
            About this kit
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-5">{product.long_description}</p>

          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">
            What&apos;s included
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(product.kit_contents ?? []).map((item) => {
              const Icon = kitIcon(item);
              return (
                <li key={item.name} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-neutral-700" />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-bold text-neutral-900">
                      {item.qty > 1 ? `${item.qty}× ` : ''}
                      {item.name}
                    </span>
                    <span className="block text-xs text-neutral-500">{item.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tabs: Description / Publisher / Author — 4th on mobile */}
        <div className="order-4 lg:order-none lg:col-start-1 lg:col-span-8 lg:row-start-3 bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="flex overflow-x-auto border-b border-neutral-100">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDetailTab(tab.id)}
                className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  detailTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 md:p-6">
            {detailTab === 'description' && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                  Product description
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">{product.long_description}</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1 text-sm">
                  <div className="flex gap-3 border-b border-neutral-100 pb-2">
                    <dt className="text-neutral-400 font-medium shrink-0">Language</dt>
                    <dd className="font-bold text-neutral-900">{product.language}</dd>
                  </div>
                  <div className="flex gap-3 border-b border-neutral-100 pb-2">
                    <dt className="text-neutral-400 font-medium shrink-0">Age range</dt>
                    <dd className="font-bold text-neutral-900">{product.age_range}</dd>
                  </div>
                  {product.pages != null && (
                    <div className="flex gap-3 border-b border-neutral-100 pb-2">
                      <dt className="text-neutral-400 font-medium shrink-0">Pages</dt>
                      <dd className="font-bold text-neutral-900">{product.pages}</dd>
                    </div>
                  )}
                  <div className="flex gap-3 border-b border-neutral-100 pb-2">
                    <dt className="text-neutral-400 font-medium shrink-0">Volume</dt>
                    <dd className="font-bold text-neutral-900">{product.volume}</dd>
                  </div>
                </dl>
              </div>
            )}

            {detailTab === 'publisher' && (
              <div className="space-y-3">
                <h2 className="text-lg font-black text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                  Publisher
                </h2>
                <p className="text-base font-bold text-neutral-900">{product.publisher}</p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {product.publisher_bio ??
                    `${product.publisher} creates immersive stereoscopic learning kits for children — combining print craftsmanship with spatial storytelling so kids can explore science through depth, play, and discovery.`}
                </p>
              </div>
            )}

            {detailTab === 'author' && (
              <div className="space-y-3">
                <h2 className="text-lg font-black text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                  Author
                </h2>
                <p className="text-base font-bold text-neutral-900">{product.author}</p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {product.author_bio ??
                    `Written and curated by ${product.author}, with educators and designers focused on clear facts, age-appropriate reading, and hands-on 3D interaction.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews — e-commerce style (read-only) — 5th on mobile */}
        <div id="product-reviews" className="order-5 lg:order-none lg:col-start-1 lg:col-span-8 lg:row-start-4 bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 scroll-mt-28">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">
            Customer reviews
          </p>

          {product.rating_count > 0 ? (
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
              <span className="text-3xl font-black text-neutral-900">{product.rating_avg.toFixed(1)}</span>
              <div>
                <Stars rating={product.rating_avg} size="md" />
                <p className="text-xs text-neutral-500 mt-0.5">
                  Based on {product.rating_count} {product.rating_count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 mb-6">No reviews yet for this kit.</p>
          )}

          {reviews.length > 0 && (
            <ul className="space-y-4">
              {reviews.map((review) => {
                const name = review.author_name?.trim() || 'Customer';
                return (
                  <li
                    key={review.id}
                    className="rounded-xl border border-neutral-100 bg-neutral-50/40 p-4 md:p-5"
                  >
                    <div className="flex items-start gap-3.5">
                      {review.author_avatar_url ? (
                        <img
                          src={review.author_avatar_url}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                          {reviewInitials(name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-1.5">
                          <p className="text-sm font-black text-neutral-900">{name}</p>
                          <time
                            dateTime={review.created_at}
                            className="text-xs font-medium text-neutral-400"
                          >
                            {formatReviewDate(review.created_at)}
                          </time>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Stars rating={review.rating} />
                          {review.title && (
                            <span className="text-sm font-bold text-neutral-800">{review.title}</span>
                          )}
                        </div>

                        <p className="text-sm text-neutral-600 leading-relaxed">{review.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Sticky sidebar: buy card + order summary — 2nd on mobile, spans full left-column height on desktop */}
        <div className="order-2 lg:order-none lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-4 lg:sticky lg:top-28 flex flex-col gap-5">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1
              className="text-2xl font-black text-neutral-900 leading-tight min-w-0"
              style={{ letterSpacing: '-0.03em' }}
            >
              {product.name}
            </h1>
            {(product.volume || product.tag) && (
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold tracking-wide whitespace-nowrap mt-1">
                {[product.volume?.replace(/^Vol\.\s*/i, ''), product.tag]
                  .filter(Boolean)
                  .join(' ')}
              </span>
            )}
          </div>

          {product.rating_count > 0 && (
            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
            >
              <Stars rating={product.rating_avg} />
              <span className="text-sm font-bold text-neutral-900">{product.rating_avg.toFixed(1)}</span>
              <span className="text-sm text-neutral-500 underline underline-offset-2">
                ({product.rating_count} reviews)
              </span>
            </button>
          )}

          <p className="text-sm text-neutral-600 leading-relaxed mb-4">{product.description}</p>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3.5 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="text-[2rem] leading-none font-black text-neutral-900 tracking-tight"
                style={{ letterSpacing: '-0.04em' }}
              >
                {formatInr(product.price_paise)}
              </span>
              {off !== null && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-black tracking-wide shadow-sm shadow-emerald-500/25">
                  {off}% OFF
                </span>
              )}
            </div>
            {product.compare_at_paise != null && product.compare_at_paise > product.price_paise && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-neutral-500">
                  M.R.P.:{' '}
                  <span className="line-through decoration-neutral-400">
                    {formatInr(product.compare_at_paise)}
                  </span>
                </p>
                {off !== null && (
                  <p className="text-sm font-bold text-emerald-600">
                    Save {formatInr(product.compare_at_paise - product.price_paise)} vs M.R.P.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-4 mt-4">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-2 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Coupon offer
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void applyCoupon();
                  }
                }}
                placeholder="Enter code here"
                disabled={!!couponCode}
                className="flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900 bg-white placeholder:text-neutral-400 uppercase disabled:bg-neutral-50"
              />
              {couponCode ? (
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-bold hover:bg-neutral-50 transition-colors shrink-0"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void applyCoupon()}
                  disabled={couponApplying}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors shrink-0 disabled:opacity-50"
                >
                  {couponApplying ? '…' : 'Apply'}
                </button>
              )}
            </div>
            {couponMessage && (
              <p
                className={`text-xs mt-1.5 font-medium ${
                  couponCode ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {couponMessage}
              </p>
            )}
            {couponCode && discountPaise > 0 && (
              <p className="text-xs mt-1 font-bold text-emerald-700">
                Saving {formatInr(discountPaise)} on this order
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900">Quantity</span>
              <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-9 h-9 flex items-center justify-center border-l border-r border-neutral-300 text-sm font-bold">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock_qty}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {product.stock_qty > 0 && product.stock_qty <= 10 && (
              <p className="text-xs text-amber-600 font-medium mt-1.5">
                {/* Only {product.stock_qty} left in stock */}
                Few items left in stock
              </p>
            )}
            {product.stock_qty > 10 && (
              <p className="text-xs text-emerald-600 font-medium mt-1.5">In stock</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 mb-4">
            <button
              type="button"
              onClick={() => {
                addItem(cartPayload);
                toggleDrawer();
              }}
              className="w-full py-3 rounded-xl border-2 border-neutral-900 text-neutral-900 font-bold tracking-wide hover:bg-neutral-50 transition-colors text-sm"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              disabled={!product.available}
              onClick={() => {
                addItem(cartPayload);
                goToReview();
              }}
              className="w-full py-3 rounded-xl bg-[#f05a13] text-white font-bold tracking-wide hover:bg-[#e0500e] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.available ? 'BUY NOW' : 'COMING SOON'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-100 mb-3">
            <div className="flex flex-col items-center text-center gap-1.5 px-1">
              <RefreshCw className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">7 Day Replacement</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 px-1 border-x border-neutral-100">
              <Banknote className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 px-1">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">Free Shipping</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe and Secure Payments</span>
          </div>
        </div>

        <CheckoutOrderSummary
          currentItem={{
            id: product.slug,
            name: product.name,
            pricePaise: product.price_paise,
            quantity,
            imageUrl: productImages[0] ?? '',
            tag: product.tag ?? undefined,
          }}
        />
        </div>
      </div>

      <div className="mt-8 pt-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-600 bg-transparent hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to shop
        </Link>
      </div>
    </div>
  );
}
