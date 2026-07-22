/** Storefront catalog — frontend source until GET /products is live. */

export interface KitItem {
  name: string;
  qty: number;
  detail: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
}

export interface StoreProduct {
  slug: string;
  name: string;
  volume: string;
  description: string;
  longDescription: string;
  /** Price in paise (129900 = ₹1,299) */
  pricePaise: number;
  /** MRP for strike-through / discount badge */
  compareAtPaise?: number;
  images: string[];
  features: string[];
  /** Physical items inside the kit */
  kitContents: KitItem[];
  publisher: string;
  author: string;
  language: string;
  ageRange: string;
  pages?: number;
  reviews: ProductReview[];
  ratingAvg: number;
  ratingCount: number;
  tag: string;
  available: boolean;
  /** Shop filter categories */
  categories: ProductCategory[];
}

export type ProductCategory =
  | 'space'
  | 'nature'
  | 'animals'
  | 'human-body'
  | 'science'
  | 'history'
  | 'art';

export const CATEGORY_FILTERS: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'animals', label: 'Animals' },
  { key: 'human-body', label: 'Human Body' },
  { key: 'space', label: 'Space' },
  { key: 'science', label: 'Science' },
  { key: 'history', label: 'History' },
  { key: 'nature', label: 'Nature' },
  { key: 'art', label: 'Art' },
];

export function getProductBadge(product: StoreProduct): { label: string; className: string } {
  if (!product.available) {
    return { label: 'COMING SOON', className: 'bg-neutral-800 text-white' };
  }
  if (product.tag === 'Bestseller') {
    return { label: 'BESTSELLER', className: 'bg-amber-400 text-neutral-900' };
  }
  return { label: 'IN STOCK', className: 'bg-emerald-500 text-white' };
}

const kitBase = (bookName: string): KitItem[] => [
  { name: 'Fact Book', qty: 1, detail: bookName },
  { name: 'Explorer Cards', qty: 5, detail: 'Interactive 3D discovery cards' },
  { name: '3D Glasses', qty: 1, detail: 'Included viewer' },
  { name: 'Sticker Sheet', qty: 1, detail: 'Collectible stickers' },
];

export const PRODUCTS: StoreProduct[] = [
  {
    slug: 'space-explorer',
    name: 'Space Explorer',
    volume: 'Vol. 01',
    description: 'Journey through the cosmos in immersive 3D. A complete interactive kit for kids.',
    longDescription:
      'The Space Explorer kit combines a premium stereoscopic fact book, interactive Explorer Cards, cardboard 3D glasses, and stickers. Designed for ages 6–12, it turns learning into a hands-on adventure across planets, stars, and deep-space missions.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: [
      '/product-image/4.png',
      '/product-image/1.png',
      '/product-image/2.png',
      '/product-image/3.png',
      '/Book Mockup3.png',
    ],
    features: ['3D Glasses Included', 'Interactive Explorer Cards', 'Premium Fact Book', 'Free Shipping'],
    kitContents: [
      { name: 'Fact Book', qty: 1, detail: 'Premium stereoscopic Space Explorer book' },
      { name: 'Explorer Cards', qty: 5, detail: 'Interactive 3D discovery cards' },
      { name: 'Cardboard 3D Glasses', qty: 1, detail: 'Paper red-cyan viewer' },
      { name: 'Plastic 3D Glasses', qty: 1, detail: 'Comfortable reusable frames' },
      { name: 'Sticker Sheet', qty: 1, detail: 'Space-themed collectible stickers' },
    ],
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '6–12 years',
    pages: 48,
    ratingAvg: 4.8,
    ratingCount: 126,
    reviews: [
      {
        id: 'r1',
        author: 'Priya S.',
        rating: 5,
        title: 'Kids loved the 3D cards',
        body: 'My daughter spent the whole evening with the book and glasses.',
        date: '12 Jun 2026',
        verified: true,
      },
    ],
    tag: 'Bestseller',
    available: true,
    categories: ['space', 'science'],
  },
  {
    slug: 'ocean-explorer',
    name: 'Ocean Explorer',
    volume: 'Vol. 02',
    description: 'Dive into the deep blue and discover marine life popping right off the page.',
    longDescription: 'Explore coral reefs, whales, and deep-sea creatures in stunning stereoscopic 3D.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: ['/Ocean Explorer.png'],
    features: ['3D Glasses Included', 'Marine Fact Cards', 'Glow Poster', 'Free Shipping'],
    kitContents: kitBase('Ocean Explorer stereoscopic book'),
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '6–12 years',
    ratingAvg: 0,
    ratingCount: 0,
    reviews: [],
    tag: 'Coming Soon',
    available: false,
    categories: ['nature', 'science'],
  },
  {
    slug: 'dinosaur-explorer',
    name: 'Dinosaur Explorer',
    volume: 'Vol. 03',
    description: 'Step back in time and walk with the dinosaurs in stunning stereoscopic depth.',
    longDescription: 'Prehistoric worlds come alive with T-Rex, raptors, and fossil facts in immersive 3D.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: ['/Dinosaur Explorer.png'],
    features: ['3D Glasses Included', 'Fossil Guide Cards', 'Sticker Set', 'Free Shipping'],
    kitContents: kitBase('Dinosaur Explorer stereoscopic book'),
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '6–12 years',
    ratingAvg: 0,
    ratingCount: 0,
    reviews: [],
    tag: 'Coming Soon',
    available: false,
    categories: ['animals', 'history'],
  },
  {
    slug: 'human-body',
    name: 'Human Body',
    volume: 'Vol. 04',
    description: 'Explore organs, bones, and how the body works — all in eye-popping 3D.',
    longDescription: 'An educational journey through anatomy designed for curious young minds.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: ['/Human Body.png'],
    features: ['3D Glasses Included', 'Anatomy Cards', 'Fact Book', 'Free Shipping'],
    kitContents: kitBase('Human Body stereoscopic book'),
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '8–14 years',
    ratingAvg: 0,
    ratingCount: 0,
    reviews: [],
    tag: 'Coming Soon',
    available: false,
    categories: ['human-body', 'science'],
  },
  {
    slug: 'wildlife',
    name: 'Wildlife',
    volume: 'Vol. 05',
    description: 'Safari across jungles and savannas — animals leap off every page in 3D.',
    longDescription: 'Meet lions, elephants, and rare species through stereoscopic photography and facts.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: ['/Wildlife.png'],
    features: ['3D Glasses Included', 'Wildlife Cards', 'Sticker Sheet', 'Free Shipping'],
    kitContents: kitBase('Wildlife stereoscopic book'),
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '6–12 years',
    ratingAvg: 0,
    ratingCount: 0,
    reviews: [],
    tag: 'Coming Soon',
    available: false,
    categories: ['animals', 'nature'],
  },
  {
    slug: 'ancient-egypt',
    name: 'Ancient Egypt',
    volume: 'Vol. 06',
    description: 'Walk among pyramids, pharaohs, and tombs in immersive stereoscopic history.',
    longDescription: 'Discover ancient civilizations with 3D scenes, cards, and collectible stickers.',
    pricePaise: 129_900,
    compareAtPaise: 159_900,
    images: ['/Ancient Egypt.png'],
    features: ['3D Glasses Included', 'History Cards', 'Poster Insert', 'Free Shipping'],
    kitContents: kitBase('Ancient Egypt stereoscopic book'),
    publisher: 'ODI Stereo Labs',
    author: 'ODI Kids Editorial',
    language: 'English',
    ageRange: '8–14 years',
    ratingAvg: 0,
    ratingCount: 0,
    reviews: [],
    tag: 'Coming Soon',
    available: false,
    categories: ['history', 'art'],
  },
];

export function getProductBySlug(slug: string | null | undefined): StoreProduct | undefined {
  if (!slug) return undefined;
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function discountPercent(pricePaise: number, compareAtPaise?: number): number | null {
  if (!compareAtPaise || compareAtPaise <= pricePaise) return null;
  return Math.round(((compareAtPaise - pricePaise) / compareAtPaise) * 100);
}
