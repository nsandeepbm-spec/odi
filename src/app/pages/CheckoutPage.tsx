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
  Banknote,
  Truck,
  Star,
  BookOpen,
  Glasses,
  Layers,
  Sticker,
} from 'lucide-react';
import { useCheckout } from '../lib/checkout';
import { discountPercent, formatInr, isProductPurchasable, type KitItem } from '../data/products';
import { getPublicProductReviews, listCouponOffers, type CouponOffer, type PublicReview } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { CouponOffersModal } from '../components/checkout/CouponOffersModal';
import { ODILoader } from '../components/ODILoader';

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
    couponMessage,
    couponApplying,
    couponCode,
    applyCoupon,
    clearCoupon,
    discountPaise,
    subtotalPaise,
    totalPaise,
  } = useCheckout();
  const [currentImg, setCurrentImg] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>('description');
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [offersOpen, setOffersOpen] = useState(false);
  const [offers, setOffers] = useState<CouponOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const { addItem, upsertItem, toggleDrawer } = useCartStore();

  useEffect(() => {
    if (!product?.slug) return;
    getPublicProductReviews(product.slug)
      .then((data) => setReviews(data.reviews))
      .catch(() => setReviews([]));
  }, [product?.slug]);

  // Load available offers as soon as the checkout product page is ready (guests OK)
  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    setOffersLoading(true);
    listCouponOffers({ productId: product.id, quantity })
      .then((res) => {
        if (!cancelled) setOffers(res.offers);
      })
      .catch(() => {
        if (!cancelled) setOffers([]);
      })
      .finally(() => {
        if (!cancelled) setOffersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product?.id, quantity]);

  if (isLoadingProduct) {
    return <ODILoader size="md" label="Loading kit details…" />;
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
  const canBuy = isProductPurchasable(product);

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
    status: product.status,
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
                {canBuy ? (
                <button
                  type="button"
                  onClick={() => {
                    upsertItem(cartPayload);
                    goToReview();
                  }}
                  className="w-full sm:w-auto shrink-0 px-5 py-3 sm:py-2.5 rounded-xl bg-[#f05a13] text-white text-sm font-bold tracking-wide hover:bg-[#e0500e] active:scale-[0.99] transition-colors"
                >
                  BUY NOW
                </button>
                ) : (
                <span className="w-full sm:w-auto shrink-0 px-5 py-3 sm:py-2.5 rounded-xl bg-neutral-800 text-white text-sm font-bold tracking-wide text-center">
                  COMING SOON
                </span>
                )}

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
                        Save {formatInr(product.compare_at_paise - product.price_paise)} 
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
                  {product.weight_grams != null && (
                    <div className="flex gap-3 border-b border-neutral-100 pb-2">
                      <dt className="text-neutral-400 font-medium shrink-0">Package weight</dt>
                      <dd className="font-bold text-neutral-900">{product.weight_grams} g</dd>
                    </div>
                  )}
                  {product.length_cm != null &&
                    product.width_cm != null &&
                    product.height_cm != null && (
                      <div className="flex gap-3 border-b border-neutral-100 pb-2">
                        <dt className="text-neutral-400 font-medium shrink-0">Package size</dt>
                        <dd className="font-bold text-neutral-900">
                          {product.length_cm} × {product.width_cm} × {product.height_cm} cm
                        </dd>
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

        {/* Sticky sidebar — roomy enough to read, short enough for Buy Now */}
        <div className="order-2 lg:order-none lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-4 lg:sticky lg:top-24 flex flex-col">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1
              className="text-[1.35rem] font-black text-neutral-900 leading-tight min-w-0"
              style={{ letterSpacing: '-0.03em' }}
            >
              {product.name}
            </h1>
            {(product.volume || product.tag) && (
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold tracking-wide whitespace-nowrap">
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
              <span className="text-xs text-neutral-500 underline underline-offset-2">
                ({product.rating_count} reviews)
              </span>
            </button>
          )}

          <p className="text-sm text-neutral-600 leading-snug mb-4 line-clamp-2">{product.description}</p>

          {/* Unit price + quantity */}
          <div className="flex items-end justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[1.75rem] leading-none font-black text-neutral-900 tracking-tight"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {formatInr(product.price_paise)}
                </span>
                {off !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black">
                    {off}% OFF
                  </span>
                )}
              </div>
              {product.compare_at_paise != null && product.compare_at_paise > product.price_paise && (
                <p className="text-xs text-neutral-500 mt-1.5">
                  M.R.P. <span className="line-through">{formatInr(product.compare_at_paise)}</span>
                  <span className="text-emerald-600 font-bold ml-2">
                    Save {formatInr(product.compare_at_paise - product.price_paise)}
                  </span>
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Qty</p>
              <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                  aria-label="Decrease quantity"
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
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] mt-1.5 font-medium text-emerald-600">
                {product.stock_qty > 0 && product.stock_qty <= 10 ? 'Few left in stock' : 'In stock'}
              </p>
            </div>
          </div>

          {/* Coupon */}
          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Coupon
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                {couponCode ? (
                  <p className="text-sm font-bold text-neutral-900 font-mono truncate">
                    {couponCode}
                    {discountPaise > 0 ? (
                      <span className="font-sans text-emerald-700 ml-2 text-xs">
                        −{formatInr(discountPaise)}
                      </span>
                    ) : null}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500 truncate">
                    {offersLoading
                      ? 'Loading offers…'
                      : offers.length > 0
                        ? `${offers.length} offer${offers.length === 1 ? '' : 's'} available`
                        : 'Have a coupon code?'}
                  </p>
                )}
              </div>
              {couponCode ? (
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[11px] font-bold text-neutral-600 hover:bg-white shrink-0"
                >
                  Remove
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOffersOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-bold hover:bg-neutral-800 shrink-0"
              >
                {couponCode ? 'Change' : 'View offers'}
              </button>
            </div>
            {couponMessage ? (
              <p
                className={`text-xs mt-1.5 font-medium break-words ${
                  couponCode ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {couponMessage}
              </p>
            ) : null}
            <CouponOffersModal
              open={offersOpen}
              onOpenChange={setOffersOpen}
              productId={product.id}
              quantity={quantity}
              appliedCode={couponCode}
              applying={couponApplying}
              onApply={applyCoupon}
              onClear={clearCoupon}
              initialOffers={offers}
              initialOffersKey={product.id ? `${product.id}:${quantity}` : undefined}
            />
          </div>

          {/* Live total */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3 mb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Qty {quantity}
                  {couponCode && discountPaise > 0 ? ` · saved ${formatInr(discountPaise)}` : ''}
                  {' · '}shipping next
                </p>
              </div>
              <div className="text-right shrink-0">
                {couponCode && discountPaise > 0 ? (
                  <p className="text-xs text-neutral-400 line-through mb-0.5">{formatInr(subtotalPaise)}</p>
                ) : null}
                <span
                  className="text-[1.65rem] leading-none font-black text-neutral-900 tracking-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {formatInr(totalPaise)}
                </span>
              </div>
            </div>
          </div>

          {canBuy ? (
            <div className="flex flex-col gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => {
                  upsertItem(cartPayload);
                  goToReview();
                }}
                className="w-full py-3.5 rounded-xl bg-[#f05a13] text-white font-bold tracking-wide hover:bg-[#e0500e] transition-colors text-sm shadow-sm shadow-[#f05a13]/20"
              >
                BUY NOW
              </button>
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
            </div>
          ) : (
            <p className="text-sm text-neutral-500 font-medium text-center py-3 mb-4">
              Coming soon — checkout when this kit goes live.
            </p>
          )}

          <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-neutral-100">
            <div className="flex flex-col items-center text-center gap-1.5 px-1 py-2">
              <Banknote className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 px-1 py-2">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">Delhivery shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 px-1 py-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span className="text-[10px] font-bold text-neutral-700 leading-tight">Safe payments</span>
            </div>
          </div>
        </div>
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
