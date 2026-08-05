import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { listNotifyMe, subscribeNotifyMe, unsubscribeNotifyMe } from '../lib/api';

export class NotifyMeAuthError extends Error {
  constructor() {
    super('NOT_SIGNED_IN');
    this.name = 'NotifyMeAuthError';
  }
}

interface NotifyMeState {
  slugs: string[];
  isHydrated: boolean;
  hydrateFromServer: () => Promise<void>;
  subscribe: (slug: string) => Promise<'subscribed' | 'already'>;
  unsubscribe: (slug: string) => Promise<void>;
  isSubscribed: (slug: string) => boolean;
}

export const useNotifyMeStore = create<NotifyMeState>((set, get) => ({
  slugs: [],
  isHydrated: false,

  isSubscribed: (slug) => get().slugs.includes(slug),

  hydrateFromServer: async () => {
    if (!auth.currentUser) {
      set({ slugs: [], isHydrated: true });
      return;
    }
    try {
      const requests = await listNotifyMe();
      const slugs = requests.map((r) => r.slug).filter((s): s is string => !!s);
      set({ slugs, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  subscribe: async (slug) => {
    if (!auth.currentUser) throw new NotifyMeAuthError();

    const prev = get().slugs;
    if (!prev.includes(slug)) {
      set({ slugs: [...prev, slug] });
    }

    try {
      const res = await subscribeNotifyMe(slug);
      return res.alreadySubscribed ? 'already' : 'subscribed';
    } catch (err) {
      set({ slugs: prev });
      throw err;
    }
  },

  unsubscribe: async (slug) => {
    if (!auth.currentUser) throw new NotifyMeAuthError();

    const prev = get().slugs;
    set({ slugs: prev.filter((s) => s !== slug) });

    try {
      await unsubscribeNotifyMe(slug);
    } catch (err) {
      set({ slugs: prev });
      throw err;
    }
  },
}));

/** Sync Notify Me waitlist whenever auth state changes. */
export function bindNotifyMeAuthSync() {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      void useNotifyMeStore.getState().hydrateFromServer();
    } else {
      useNotifyMeStore.setState({ slugs: [], isHydrated: true });
    }
  });
}
