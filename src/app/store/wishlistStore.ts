import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/firebase';
import { addFavorite, listFavorites, removeFavorite } from '../lib/api';

export class WishlistAuthError extends Error {
  constructor() {
    super('NOT_SIGNED_IN');
    this.name = 'WishlistAuthError';
  }
}

interface WishlistState {
  slugs: string[];
  isHydrated: boolean;
  hydrateFromServer: () => Promise<void>;
  toggle: (slug: string) => Promise<'added' | 'removed'>;
  isFavorite: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      isHydrated: false,

      isFavorite: (slug) => get().slugs.includes(slug),

      hydrateFromServer: async () => {
        if (!auth.currentUser) {
          set({ isHydrated: true });
          return;
        }
        try {
          const favorites = await listFavorites();
          const slugs = favorites.map((f) => f.slug).filter((s): s is string => !!s);
          set({ slugs, isHydrated: true });
        } catch {
          set({ isHydrated: true });
        }
      },

      toggle: async (slug) => {
        if (!auth.currentUser) throw new WishlistAuthError();

        const wasLiked = get().slugs.includes(slug);
        const prevSlugs = get().slugs;
        const nextSlugs = wasLiked
          ? prevSlugs.filter((s) => s !== slug)
          : [...prevSlugs, slug];

        set({ slugs: nextSlugs });

        try {
          if (wasLiked) {
            await removeFavorite(slug);
            return 'removed';
          }
          await addFavorite(slug);
          return 'added';
        } catch (err) {
          set({ slugs: prevSlugs });
          throw err;
        }
      },
    }),
    {
      name: 'odi-wishlist',
      partialize: (state) => ({ slugs: state.slugs }),
    }
  )
);

/** Sync favorites whenever auth state changes. Call once near app root or products page. */
export function bindWishlistAuthSync() {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      void useWishlistStore.getState().hydrateFromServer();
    } else {
      useWishlistStore.setState({ slugs: [], isHydrated: true });
    }
  });
}
