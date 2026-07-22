import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronDown,
  Glasses,
  Heart,
  Layers,
  Package,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sticker,
  Truck,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import {
  CATEGORY_FILTERS,
  PRODUCTS,
  discountPercent,
  formatInr,
  getProductBadge,
  type ProductCategory,
  type StoreProduct,
} from '../data/products';
import { persistCheckoutProduct } from '../lib/checkout';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const CTA = '#f05a13';
const ACCENT = '#1a4fd6';

const INTEREST_TILES: { label: string; category: ProductCategory; slug: string; tall?: boolean }[] = [
  { label: 'Space', category: 'space', slug: 'space-explorer', tall: true },
  { label: 'Ocean', category: 'nature', slug: 'ocean-explorer' },
  { label: 'Dinosaurs', category: 'animals', slug: 'dinosaur-explorer' },
  { label: 'Anatomy', category: 'human-body', slug: 'human-body' },
  { label: 'Animals', category: 'animals', slug: 'wildlife' },
];

const FAQS = [
  {
    q: 'How does the 3D learning work?',
    a: 'Each kit includes a stereoscopic book and 3D glasses. Pages and explorer cards use depth layers so kids see content pop off the page.',
  },
  {
    q: 'What age group is ODI Kids for?',
    a: 'Our kits are designed for ages 6–14 depending on the volume. Space Explorer is ideal for ages 6–12.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes — pay when your kit arrives. Free shipping is included on all orders across India.',
  },
];

const KIT_ICONS: Record<string, React.ElementType> = {
  'Fact Book': BookOpen,
  'Explorer Cards': Layers,
  'Cardboard 3D Glasses': Glasses,
  'Plastic 3D Glasses': Glasses,
  'Sticker Sheet': Sticker,
  '3D Glasses': Glasses,
};

function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
        />
      ))}
    </span>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const navigate = useNavigate();
  const { addItem, toggleDrawer } = useCartStore();
  const liked = useWishlistStore((s) => s.slugs.includes(product.slug));
  const toggleLike = useWishlistStore((s) => s.toggle);
  const [notifyMsg, setNotifyMsg] = useState<string | null>(null);
  const badge = getProductBadge(product);
  const off = discountPercent(product.pricePaise, product.compareAtPaise);

  const goToProduct = () => {
    if (!product.available) return;
    persistCheckoutProduct(product.slug, 1);
    navigate(`/checkout?product=${product.slug}`);
  };

  const addToCart = () => {
    if (!product.available) return;
    addItem({
      id: product.slug,
      name: product.name,
      pricePaise: product.pricePaise,
      quantity: 1,
      imageUrl: product.images[0],
    });
    toggleDrawer();
  };

  const notifyMe = () => {
    setNotifyMsg(`We'll email you when ${product.name} launches.`);
    setTimeout(() => setNotifyMsg(null), 3000);
  };

  return (
    <article className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-row md:flex-col h-full">
      <div className="relative w-[38%] max-w-[148px] md:w-full md:max-w-none shrink-0 p-3 md:p-4 md:pb-0">
        <span
          className={`absolute top-4 left-4 md:top-6 md:left-6 z-10 px-2 py-0.5 text-[8px] md:text-[9px] font-black tracking-widest rounded ${badge.className}`}
        >
          {badge.label}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(product.slug);
          }}
          className="absolute top-3 right-3 md:top-5 md:right-5 z-20 w-8 h-8 rounded-full bg-white/95 border border-neutral-200/80 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={liked}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-400'
            }`}
          />
        </button>
        <button
          type="button"
          onClick={goToProduct}
          disabled={!product.available}
          className="w-full h-full min-h-[128px] md:min-h-0 md:aspect-[4/3] bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center disabled:cursor-default"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`max-h-full max-w-full ${
              product.slug === 'space-explorer' ? 'object-contain p-2 md:p-4' : 'object-cover w-full h-full'
            }`}
          />
        </button>
      </div>

      <div className="p-3 md:p-4 md:pt-3 flex flex-col flex-1 min-w-0 justify-center md:justify-start">
        <button
          type="button"
          onClick={goToProduct}
          disabled={!product.available}
          className="text-left disabled:cursor-default"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{product.volume}</p>
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug hover:text-[#1a4fd6] transition-colors mt-0.5">
            {product.name}
          </h3>
        </button>

        {product.ratingCount > 0 ? (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Stars rating={product.ratingAvg} />
            <span className="text-xs text-neutral-500">({product.ratingCount})</span>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 mt-1.5">Launching soon</p>
        )}

        <p className="text-xs text-neutral-500 mt-2 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-black text-neutral-900">{formatInr(product.pricePaise)}</span>
          {product.compareAtPaise && product.compareAtPaise > product.pricePaise && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatInr(product.compareAtPaise)}
              </span>
              {off !== null && (
                <span className="text-[10px] font-bold text-emerald-600">{off}% off</span>
              )}
            </>
          )}
        </div>

        {notifyMsg && <p className="text-[10px] text-emerald-600 font-medium mt-2">{notifyMsg}</p>}

        <div className="flex gap-2 mt-3">
          {product.available ? (
            <>
              <button
                type="button"
                onClick={goToProduct}
                className="flex-1 py-2.5 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity"
                style={{ background: CTA }}
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={addToCart}
                className="w-10 h-10 shrink-0 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-600" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={notifyMe}
              className="w-full py-2.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Notify Me
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const shopRef = useRef<HTMLElement>(null);
  const { addItem, toggleDrawer } = useCartStore();

  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'rating'>('default');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const featured = PRODUCTS.find((p) => p.slug === 'space-explorer')!;
  const featuredSeries = PRODUCTS.slice(0, 3);
  const featuredOff = discountPercent(featured.pricePaise, featured.compareAtPaise);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectCategory = (key: ProductCategory | 'all') => {
    setCategory(key);
  };

  const products = useMemo(() => {
    let list = [...PRODUCTS];

    if (category !== 'all') {
      list = list.filter((p) => p.categories.includes(category));
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.volume.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.replace(/-/g, ' ').includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => a.pricePaise - b.pricePaise);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else {
      list.sort((a, b) => Number(b.available) - Number(a.available));
    }

    return list;
  }, [category, debouncedSearch, sort]);

  const goToProduct = (slug: string) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    if (!p?.available) {
      scrollToShop();
      return;
    }
    persistCheckoutProduct(slug, 1);
    navigate(`/checkout?product=${slug}`);
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero — compact */}
      <section className="relative pt-24 sm:pt-28 min-h-[360px] sm:min-h-[400px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80"
          alt="Kids learning in classroom"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg text-white"
          >
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3">
              Learning Beyond the Page
            </h1>
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              Immersive 3D books, explorer cards, and glasses for curious kids.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToShop}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white"
                style={{ background: CTA }}
              >
                Shop All Kits
              </button>
              <Link
                to="/learn-more"
                className="px-6 py-2.5 rounded-lg border border-white/40 text-white text-sm font-bold hover:bg-white/10 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky search + filters — stays under navbar while scrolling */}
      <div className="sticky top-[4.75rem] sm:top-[5.25rem] z-[90] bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kits…"
              className="w-full pl-9 pr-8 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-sm outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              aria-label="Search products"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="shrink-0 px-3 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-700 outline-none focus:border-neutral-900"
            aria-label="Sort products"
          >
            <option value="default">Available</option>
            <option value="price-asc">Price ↑</option>
            <option value="rating">Top rated</option>
          </select>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide min-w-0 flex-1">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => selectCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  category === cat.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured — from PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
        <h2 className="text-xl font-black mb-6">Featured Immersive Series</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredSeries.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => (item.available ? goToProduct(item.slug) : selectCategory(item.categories[0]))}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              {!item.available && (
                <span className="absolute top-4 left-4 px-2 py-0.5 bg-white/90 text-[9px] font-black tracking-widest rounded text-neutral-900">
                  COMING SOON
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-black">{item.name}</h3>
                <p className="text-xs text-white/70 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-black">{formatInr(item.pricePaise)}</span>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Shop grid */}
      <section
        id="shop"
        ref={shopRef}
        className="bg-[#f7f8fa] py-8 sm:py-10 scroll-mt-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {(search || category !== 'all') && (
            <p className="text-xs text-neutral-500 mb-4">
              {products.length} kit{products.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
              {category !== 'all' && ` in ${CATEGORY_FILTERS.find((c) => c.key === category)?.label}`}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-sm mb-3">No products found.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="text-sm font-bold hover:underline"
                style={{ color: ACCENT }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interest tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
        <h2 className="text-xl font-black mb-6">Discover by Interest</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[130px] sm:auto-rows-[150px]">
          {INTEREST_TILES.map((tile) => {
            const product = PRODUCTS.find((p) => p.slug === tile.slug);
            return (
              <button
                key={tile.label}
                type="button"
                onClick={() => {
                  selectCategory(tile.category);
                  scrollToShop();
                }}
                className={`relative rounded-2xl overflow-hidden group ${tile.tall ? 'row-span-2' : ''}`}
              >
                <img
                  src={product?.images[0] ?? ''}
                  alt={tile.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-black">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Spotlight + FAQ */}
      <section className="relative overflow-hidden bg-[#f7f8fa]">
        {/* Spotlight */}
        <div className="relative bg-[#0b1220] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(26,79,214,0.25),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_20%,rgba(240,90,19,0.12),transparent)]" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-black/20">
                  <img
                    src={featured.images[0]}
                    alt={featured.name}
                    loading="lazy"
                    className="w-full max-h-64 sm:max-h-80 object-contain mx-auto"
                  />
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-amber-400 text-neutral-900">
                      BESTSELLER
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-neutral-100 border border-neutral-200 text-neutral-700">
                      {featured.volume}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="order-1 lg:order-2"
              >
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-300 mb-3">
                  Featured Kit
                </p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">{featured.name}</h2>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Stars rating={featured.ratingAvg} />
                    <span className="text-sm text-white/70">
                      {featured.ratingAvg} ({featured.ratingCount} reviews)
                    </span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
                  <span className="text-sm text-white/60">Ages {featured.ageRange}</span>
                </div>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                  {featured.description}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {featured.kitContents.slice(0, 4).map((item) => {
                    const Icon = KIT_ICONS[item.name] ?? Package;
                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5"
                      >
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-amber-300" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.qty}× {item.name}
                          </p>
                          <p className="text-[10px] text-white/45 truncate">{item.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 border border-white/10 text-white/80"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {f}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-400/20 text-emerald-300">
                    <Truck className="w-3 h-3" />
                    Free Shipping
                  </span>
                </div>

                <div className="flex flex-wrap items-end gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-black">{formatInr(featured.pricePaise)}</span>
                  {featured.compareAtPaise && featured.compareAtPaise > featured.pricePaise && (
                    <>
                      <span className="text-lg text-white/40 line-through mb-0.5">
                        {formatInr(featured.compareAtPaise)}
                      </span>
                      {featuredOff !== null && (
                        <span className="mb-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300">
                          Save {featuredOff}%
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => goToProduct(featured.slug)}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ background: CTA }}
                  >
                    Buy Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: featured.slug,
                        name: featured.name,
                        pricePaise: featured.pricePaise,
                        quantity: 1,
                        imageUrl: featured.images[0],
                      });
                      toggleDrawer();
                    }}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl border border-white/20 text-sm font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">
                Support
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-3">
                Frequently asked questions
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                Quick answers for parents before you order. Need more help?{' '}
                <Link to="/contact" className="font-bold text-[#1a4fd6] hover:underline">
                  Contact us
                </Link>
                .
              </p>
            </div>

            <div className="lg:col-span-3 space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    className={`rounded-2xl border bg-white overflow-hidden transition-shadow ${
                      isOpen ? 'border-neutral-300 shadow-md' : 'border-neutral-200 shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                            isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-neutral-900">{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-neutral-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 pl-[3.25rem] text-sm text-neutral-500 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
