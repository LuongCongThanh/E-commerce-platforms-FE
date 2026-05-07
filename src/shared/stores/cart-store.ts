import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export interface CartItem {
  lineId: string;
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartActions {
  addToCart: (item: CartItem) => void;
  removeCartItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

function calcTotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
function calcItemCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

export const useCartStore = create<CartState & CartActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        itemCount: 0,

        addToCart: item => {
          const items = get().items;
          const existing = items.find(i => i.lineId === item.lineId);
          const updated =
            existing != null ? items.map(i => (i.lineId === item.lineId ? { ...i, quantity: i.quantity + item.quantity } : i)) : [...items, item];
          set({ items: updated, total: calcTotal(updated), itemCount: calcItemCount(updated) });
        },

        removeCartItem: lineId => {
          const updated = get().items.filter(i => i.lineId !== lineId);
          set({ items: updated, total: calcTotal(updated), itemCount: calcItemCount(updated) });
        },

        updateQuantity: (lineId, quantity) => {
          const updated = get().items.map(i => (i.lineId === lineId ? { ...i, quantity } : i));
          set({ items: updated, total: calcTotal(updated), itemCount: calcItemCount(updated) });
        },

        clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
      }),
      { name: 'cart-storage' }
    )
  )
);
