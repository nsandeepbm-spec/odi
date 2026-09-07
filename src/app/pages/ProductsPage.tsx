import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Heart,
  Play,
  RefreshCw,
  Search,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import {
  CATEGORY_FILTERS,
  discountPercent,
  formatInr,
  getProductBadge,
  type ProductCategory,
  type StoreProduct,
} from '../data/products';
import { persistCheckoutProduct } from '../lib/checkout';
import { invalidatePublicCache, peekPublicProductsCache } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore, WishlistAuthError, bindWishlistAuthSync } from '../store/wishlistStore';
import { useNotifyMeStore, NotifyMeAuthError, bindNotifyMeAuthSync } from '../store/notifyMeStore';
import { ODILoader } from '../components/ODILoader';

const CTA = '#f05a13';
const ACCENT = '#1a4fd6';

/** Static interest tiles — images live in `public/` (see mock.ts + seed catalog). */
const INTEREST_TILES: {
  label: string;
  category: ProductCategory;
  image: string;
  tall?: boolean;
  thumbnails?: string[];
}[] = [
  {
    label: 'Space',
    category: 'space',
    image: '/product-image/4.png',
    tall: true,
    thumbnails: ['/Ocean Explorer.png', '/Dinosaur Explorer.png', '/Human Body.png'],
  },
  { label: 'Ocean', category: 'nature', image: '/Ocean Explorer.png' },
  { label: 'Dinosaurs', category: 'animals', image: '/Dinosaur Explorer.png' },
  { label: 'Anatomy', category: 'human-body', image: '/Human Body.png' },
  { label: 'Animals', category: 'animals', image: '/Wildlife.png' },
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
  const liked = useWishlistStore((s) => s.isFavorite(product.slug));
  const toggleLike = useWishlistStore((s) => s.toggle);
  const subscribed = useNotifyMeStore((s) => s.isSubscribed(product.slug));
  const subscribeNotify = useNotifyMeStore((s) => s.subscribe);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [notifyBusy, setNotifyBusy] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState<string | null>(null);
  const badge = getProductBadge(product);
  const off = discountPercent(product.price_paise, product.compare_at_paise);

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
      pricePaise: product.price_paise,
      quantity: 1,
      imageUrl: product.media?.card?.url ?? product.images?.[0]?.url ?? '',
    });
    toggleDrawer();
  };

  const notifyMe = async () => {
    if (subscribed) {
      setNotifyMsg(`You're on the list for ${product.name}.`);
      setTimeout(() => setNotifyMsg(null), 3000);
      return;
    }
    setNotifyBusy(true);
    try {
      const result = await subscribeNotify(product.slug);
      setNotifyMsg(
        result === 'already'
          ? `You're already on the list for ${product.name}.`
          : `We'll email you when ${product.name} launches.`
      );
      setTimeout(() => setNotifyMsg(null), 3000);
    } catch (err) {
      if (err instanceof NotifyMeAuthError) {
        navigate(`/login?redirect=${encodeURIComponent('/products')}`);
        return;
      }
      setNotifyMsg('Could not save Notify Me. Try again.');
      setTimeout(() => setNotifyMsg(null), 3000);
    } finally {
      setNotifyBusy(false);
    }
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
          disabled={wishlistBusy}
          onClick={async (e) => {
            e.stopPropagation();
            setWishlistBusy(true);
            try {
              await toggleLike(product.slug);
            } catch (err) {
              if (err instanceof WishlistAuthError) {
                navigate(`/login?redirect=${encodeURIComponent('/products')}`);
                return;
              }
            } finally {
              setWishlistBusy(false);
            }
          }}
          className="absolute top-3 right-3 md:top-5 md:right-5 z-20 w-8 h-8 rounded-full bg-white/95 border border-neutral-200/80 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
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
            src={product.media?.card?.url ?? product.images?.[0]?.url ?? ''}
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

        {(product.rating_count || 0) > 0 ? (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Stars rating={product.rating_avg || 0} />
            <span className="text-xs text-neutral-500">({product.rating_count})</span>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 mt-1.5">Launching soon</p>
        )}

        <p className="text-xs text-neutral-500 mt-2 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-black text-neutral-900">{formatInr(product.price_paise)}</span>
          {product.compare_at_paise != null && product.compare_at_paise > product.price_paise && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatInr(product.compare_at_paise)}
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
              onClick={() => void notifyMe()}
              disabled={notifyBusy}
              className="w-full py-2.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Bell className={`w-3.5 h-3.5 ${subscribed ? 'fill-neutral-600' : ''}`} />
              {subscribed ? 'Subscribed' : 'Notify Me'}
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
  // Seed from the module-level cache so re-visits show data instantly (no skeleton flash).
  const [allProducts, setAllProducts] = useState<StoreProduct[]>(() => peekPublicProductsCache() ?? []);
  const [isLoading, setIsLoading] = useState(() => peekPublicProductsCache() === null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = useCallback((opts?: { force?: boolean }) => {
    let cancelled = false;
    if (opts?.force) {
      invalidatePublicCache('public:products');
      setIsRefreshing(true);
    }
    import('../lib/api').then(({ listPublicProducts }) => {
      listPublicProducts()
        .then((res) => {
          if (!cancelled) {
            setAllProducts(res.products);
            setIsLoading(false);
            setIsRefreshing(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setIsLoading(false);
            setIsRefreshing(false);
          }
        });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshCatalog = () => {
    if (isRefreshing || isLoading) return;
    fetchProducts({ force: true });
  };

  useEffect(() => {
    const unsubWishlist = bindWishlistAuthSync();
    const unsubNotify = bindNotifyMeAuthSync();
    void useWishlistStore.getState().hydrateFromServer();
    void useNotifyMeStore.getState().hydrateFromServer();
    return () => {
      unsubWishlist();
      unsubNotify();
    };
  }, []);

  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'rating'>('default');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const debouncedSearch = useDebouncedValue(search);

  // Featured Immersive Series: admin toggles `is_featured` on Product Editor (Publish panel).
  // Only live / coming_soon products with the flag appear — pick up to 3 kits.
  const featuredSeries = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          Boolean(p.is_featured) &&
          (p.status === 'live' || p.status === 'coming_soon')
      )
      .slice(0, 3);
  }, [allProducts]);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectCategory = (key: ProductCategory | 'all') => {
    setCategory(key);
  };

  const products = useMemo(() => {
    let list = [...allProducts];

    if (category !== 'all') {
      list = list.filter((p) => p.categories.includes(category));
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.volume ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          p.slug.replace(/-/g, ' ').includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') {
      list.sort((a, b) => a.price_paise - b.price_paise);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating_avg - a.rating_avg);
    } else {
      list.sort((a, b) => Number(b.available) - Number(a.available));
    }

    return list;
  }, [allProducts, category, debouncedSearch, sort]);

  const goToProduct = (slug: string) => {
    const p = allProducts.find((x) => x.slug === slug);
    if (!p?.available) {
      scrollToShop();
      return;
    }
    persistCheckoutProduct(slug, 1);
    navigate(`/checkout?product=${slug}`);
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero — full-bleed banner */}
      <section className="relative flex items-end overflow-hidden min-h-[520px] sm:min-h-[560px] lg:min-h-[640px]">
        <img
          src="/shop-banner.png"
          alt="Kids exploring an immersive 3D learning book"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 pb-14 sm:pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-3 text-white">
              Learning Beyond the Page
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-md">
              Immersive 3D books, explorer cards, and glasses for curious kids.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToShop}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-none [text-shadow:none]"
                style={{ background: CTA }}
              >
                Shop All Kits
              </button>
              <Link
                to="/learn-more"
                className="px-6 py-2.5 rounded-lg border border-white/70 text-white text-sm font-bold hover:bg-white/10 flex items-center gap-2 [text-shadow:none]"
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

          <button
            type="button"
            onClick={refreshCatalog}
            disabled={isRefreshing || isLoading}
            title="Refresh catalog"
            aria-label="Refresh catalog"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
        <h2 className="text-xl font-black mb-6">Featured Immersive Series</h2>
        {isLoading ? (
          <ODILoader size="sm" label="Loading…" className="py-16" />
        ) : featuredSeries.length === 0 ? (
          <p className="text-sm text-neutral-500 py-8">
            No featured kits yet. In admin, open a product and turn on <strong>Featured series</strong> next to Status
            (live or coming soon).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredSeries.map((item) => {
              const isComingSoon = item.status === 'coming_soon' || !item.available;
              return (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  if (item.available) {
                    goToProduct(item.slug);
                    return;
                  }
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  selectCategory('all');
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left bg-neutral-100"
              >
                <img
                  src={item.media?.card?.url ?? item.images?.[0]?.url}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                {isComingSoon ? (
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-neutral-900 text-white text-[9px] font-black tracking-widest rounded">
                    COMING SOON
                  </span>
                ) : item.tag?.toLowerCase() === 'bestseller' ? (
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-amber-400 text-neutral-900 text-[9px] font-black tracking-widest rounded">
                    BESTSELLER
                  </span>
                ) : null}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
                    {item.volume}
                  </p>
                  <h3 className="text-xl font-black">{item.name}</h3>
                  <p className="text-xs text-white/70 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <span className="font-black">{formatInr(item.price_paise)}</span>
                    {isComingSoon ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/90 bg-white/15 border border-white/20 px-2.5 py-1 rounded-lg">
                        <Bell className="w-3 h-3" /> Notify
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
                    )}
                  </div>
                </div>
              </button>
              );
            })}
          </div>
        )}
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
            {isLoading ? (
              <div className="col-span-full">
                <ODILoader size="sm" label="Loading products…" className="py-16" />
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))
            )}
          </div>

          {!isLoading && products.length === 0 && (
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
          {INTEREST_TILES.map((tile) =>
            tile.tall ? (
              <button
                key={tile.label}
                type="button"
                onClick={() => {
                  selectCategory(tile.category);
                  scrollToShop();
                }}
                className="relative row-span-2 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex flex-col group hover:shadow-md transition-shadow"
              >
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 min-h-0">
                  <img
                    src={tile.image}
                    alt={tile.label}
                    loading="lazy"
                    className="w-full max-h-[52%] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <span className="mt-3 text-lg font-black text-neutral-900">{tile.label}</span>
                </div>
                {tile.thumbnails && (
                  <div className="grid grid-cols-3 gap-2 p-3 pt-0">
                    {tile.thumbnails.map((thumb) => (
                      <div
                        key={thumb}
                        className="rounded-lg overflow-hidden aspect-[3/4] bg-white border border-neutral-200/60"
                      >
                        <img src={thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ) : (
              <button
                key={tile.label}
                type="button"
                onClick={() => {
                  selectCategory(tile.category);
                  scrollToShop();
                }}
                className="relative rounded-2xl overflow-hidden group"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-black">
                  {tile.label}
                </span>
              </button>
            )
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#f7f8fa]">
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
