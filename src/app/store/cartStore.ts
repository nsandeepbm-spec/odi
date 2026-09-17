import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminProductStatus } from '../lib/api';

export const CART_MAX_QTY = 10;

export interface CartItem {
  id: string; // product slug
  name: string;
  pricePaise: number;
  quantity: number;
  imageUrl: string;
  status?: AdminProductStatus;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  /** Set absolute quantity for an existing line, or insert if missing (Buy Now). */
  upsertItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

function isLive(item: CartItem) {
  return !item.status || item.status === 'live';
}

function clampQty(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(CART_MAX_QTY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          if (!isLive(newItem)) return state;
          const qty = clampQty(newItem.quantity);
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: clampQty(item.quantity + qty) }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: qty }] };
        }),
      upsertItem: (newItem) =>
        set((state) => {
          if (!isLive(newItem)) return state;
          const next = { ...newItem, quantity: clampQty(newItem.quantity) };
          const exists = state.items.some((item) => item.id === newItem.id);
          if (exists) {
            return {
              items: state.items.map((item) => (item.id === newItem.id ? { ...item, ...next } : item)),
            };
          }
          return { items: [...state.items, next] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: clampQty(quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.pricePaise * item.quantity, 0);
      },
      isDrawerOpen: false,
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: 'odi-cart',
      // Drawer UI state is session-only; persist line items for refresh-safe cart.
      partialize: (state) => ({ items: state.items }),
    }
  )
);
