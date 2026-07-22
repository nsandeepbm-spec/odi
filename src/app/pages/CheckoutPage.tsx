import React, { useState } from 'react';
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

export default function CheckoutPage() {
  const { product, quantity, setQuantity, goToReview } = useCheckout();
  const [currentImg, setCurrentImg] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('description');
  const { addItem, toggleDrawer } = useCartStore();

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

  const off = discountPercent(product.pricePaise, product.compareAtPaise);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % product.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + product.images.length) % product.images.length);

  const cartPayload = {
    id: product.slug,
    name: product.name,
    pricePaise: product.pricePaise,
    quantity,
    imageUrl: product.images[0],
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setCouponMsg('Enter a coupon code');
      return;
    }
    if (code === 'ODI100' || code === 'SPACE50') {
      setCouponMsg(`Coupon ${code} applied`);
      return;
    }
    setCouponMsg('Invalid or expired coupon');
  };

  const scrollToReviews = () => {
    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full py-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: gallery + product details */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Gallery + price / rating / thumbs in one card */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="group relative w-full p-5 sm:p-6 flex items-center justify-center h-72 sm:h-96 lg:h-[500px]">
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous image"
              className="absolute left-3 z-10 p-2 rounded-full bg-white/95 shadow-sm border border-neutral-200 text-neutral-600 hover:text-black transition-all opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={product.images[currentImg]}
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
              className="absolute right-3 z-10 p-2 rounded-full bg-white/95 shadow-sm border border-neutral-200 text-neutral-600 hover:text-black transition-all opacity-70 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="absolute bottom-3 right-4 text-[11px] font-bold text-neutral-400 bg-white/80 px-2 py-0.5 rounded-md">
              {currentImg + 1} / {product.images.length}
            </span>
          </div>

          {/* Meta bar: price · rating · thumbnails */}
          <div className="border-t border-neutral-100 px-4 sm:px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="shrink-0 min-w-[140px]">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  {formatInr(product.pricePaise)}
                </span>
                {off !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wide border border-emerald-200">
                    {off}% OFF
                  </span>
                )}
              </div>
              {product.compareAtPaise && product.compareAtPaise > product.pricePaise && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  M.R.P.: <span className="line-through">{formatInr(product.compareAtPaise)}</span>
                </p>
              )}
              <p className="text-[10px] text-neutral-400">Inclusive of all taxes</p>
            </div>

            <div className="hidden sm:block w-px h-10 bg-neutral-100 shrink-0" />

            {product.ratingCount > 0 && (
              <button
                type="button"
                onClick={scrollToReviews}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <Stars rating={product.ratingAvg} size="md" />
                <span className="text-sm font-black text-neutral-900">{product.ratingAvg.toFixed(1)}</span>
                <span className="text-xs text-neutral-500 underline underline-offset-2 decoration-neutral-300">
                  {product.ratingCount} reviews
                </span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto overflow-x-auto pb-0.5 max-w-full">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setCurrentImg(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center bg-neutral-50 transition-all border shrink-0 ${
                    currentImg === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product details under gallery */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
            About this kit
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-5">{product.longDescription}</p>

          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">
            What&apos;s included
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.kitContents.map((item) => {
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

        {/* Tabs: Description / Publisher / Author */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
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
                <p className="text-sm text-neutral-600 leading-relaxed">{product.longDescription}</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1 text-sm">
                  <div className="flex gap-3 border-b border-neutral-100 pb-2">
                    <dt className="text-neutral-400 font-medium shrink-0">Language</dt>
                    <dd className="font-bold text-neutral-900">{product.language}</dd>
                  </div>
                  <div className="flex gap-3 border-b border-neutral-100 pb-2">
                    <dt className="text-neutral-400 font-medium shrink-0">Age range</dt>
                    <dd className="font-bold text-neutral-900">{product.ageRange}</dd>
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
                  {product.publisher} creates immersive stereoscopic learning kits for children —
                  combining print craftsmanship with spatial storytelling so kids can explore science
                  through depth, play, and discovery.
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
                  Written and curated by {product.author}, with educators and designers focused on clear
                  facts, age-appropriate reading, and hands-on 3D interaction.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews — separate section below description card */}
        <div id="product-reviews" className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Customer reviews
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black text-neutral-900">{product.ratingAvg.toFixed(1)}</span>
                <div>
                  <Stars rating={product.ratingAvg} size="md" />
                  <p className="text-xs text-neutral-500 mt-0.5">{product.ratingCount} ratings</p>
                </div>
              </div>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-sm text-neutral-500">No reviews yet for this kit.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {product.reviews.map((review) => (
                <li key={review.id} className="py-4 first:pt-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-bold text-neutral-900">{review.title}</span>
                    {review.verified && (
                      <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-2">{review.body}</p>
                  <p className="text-xs text-neutral-400">
                    {review.author} · {review.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: buy card + order summary */}
      <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-28">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              {product.volume}
            </span>
            {product.tag && (
              <span className="inline-flex px-2.5 py-0.5 rounded-md bg-[#00a680]/10 text-[#00a680] text-[10px] font-bold tracking-wide">
                {product.tag}
              </span>
            )}
          </div>

          <h1
            className="text-2xl font-black text-neutral-900 leading-tight mb-2"
            style={{ letterSpacing: '-0.03em' }}
          >
            {product.name}
          </h1>

          {product.ratingCount > 0 && (
            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
            >
              <Stars rating={product.ratingAvg} />
              <span className="text-sm font-bold text-neutral-900">{product.ratingAvg.toFixed(1)}</span>
              <span className="text-sm text-neutral-500 underline underline-offset-2">
                ({product.ratingCount} reviews)
              </span>
            </button>
          )}

          <p className="text-sm text-neutral-600 leading-relaxed mb-4">{product.description}</p>

          <div className="flex flex-wrap items-baseline gap-3 mb-0.5">
            <span className="text-3xl font-black text-neutral-900 tracking-tight">
              {formatInr(product.pricePaise)}
            </span>
            {off !== null && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wide border border-emerald-200">
                {off}% OFF
              </span>
            )}
          </div>
          {product.compareAtPaise && product.compareAtPaise > product.pricePaise && (
            <p className="text-sm text-neutral-500">
              M.R.P.: <span className="line-through">{formatInr(product.compareAtPaise)}</span>
            </p>
          )}
          <p className="text-xs text-neutral-500 mb-4">Inclusive of all taxes</p>

          <div className="mb-4">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponMsg(null);
                }}
                placeholder="Enter code"
                className="flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-900 bg-white placeholder:text-neutral-400 uppercase"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p
                className={`text-xs mt-1.5 font-medium ${
                  couponMsg.includes('applied') ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {couponMsg}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
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
                disabled={quantity >= 10}
                className="w-9 h-9 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
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
            ...product,
            quantity,
            imageUrl: product.images[0],
          }}
        />
      </div>
      </div>
    </div>
  );
}
