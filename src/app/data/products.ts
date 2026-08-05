import type { AdminProduct, AdminProductMedia } from '../lib/api';

/** Storefront catalog — StoreProduct is now an alias for the live API product. */
export type StoreProduct = AdminProduct;

export interface KitItem {
  name: string;
  qty: number;
  detail: string;
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
  if (product.status === 'coming_soon' || !product.available) {
    return { label: 'COMING SOON', className: 'bg-neutral-800 text-white' };
  }
  if (product.tag?.toLowerCase() === 'bestseller') {
    return { label: 'BESTSELLER', className: 'bg-amber-400 text-neutral-900' };
  }
  return { label: 'IN STOCK', className: 'bg-emerald-500 text-white' };
}

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function discountPercent(pricePaise: number, compareAtPaise?: number | null): number | null {
  if (!compareAtPaise || compareAtPaise <= pricePaise) return null;
  return Math.round(((compareAtPaise - pricePaise) / compareAtPaise) * 100);
}
