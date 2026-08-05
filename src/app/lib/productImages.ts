import type { AdminProduct, AdminProductImage } from './api';

export function cardImageUrl(product: AdminProduct): string | null {
  if (product.media?.card?.url) return product.media.card.url;
  const card = product.images?.find((i) => i.kind === 'card' || i.is_primary);
  return card?.url ?? product.images?.[0]?.url ?? null;
}

export function galleryImageUrls(product: AdminProduct): string[] {
  if (product.media?.gallery?.length) {
    return product.media.gallery.map((g) => g.url);
  }
  return (product.images ?? [])
    .filter((i) => i.kind === 'gallery' || (!i.is_primary && i.kind !== 'card'))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
}

export function imagesFromEditor(cardUrl: string, galleryUrls: string[], alt: string) {
  const images: Array<{
    url: string;
    alt: string;
    kind: 'card' | 'gallery';
    sort_order: number;
  }> = [];

  if (cardUrl.trim()) {
    images.push({ url: cardUrl.trim(), alt, kind: 'card', sort_order: 0 });
  }

  galleryUrls
    .map((u) => u.trim())
    .filter(Boolean)
    .forEach((url, i) => {
      images.push({ url, alt, kind: 'gallery', sort_order: i + 1 });
    });

  return images;
}

export function editorImagesFromProduct(product: AdminProduct) {
  return {
    cardUrl: cardImageUrl(product) ?? '',
    galleryUrls: galleryImageUrls(product),
  };
}

export type GallerySlot = { id: string; url: string };

export function galleryFromUrls(urls: string[]): GallerySlot[] {
  return urls.map((url, i) => ({ id: `g-${i}-${url.slice(-12)}`, url }));
}

export function urlsFromGallery(slots: GallerySlot[]): string[] {
  return slots.map((s) => s.url).filter(Boolean);
}
