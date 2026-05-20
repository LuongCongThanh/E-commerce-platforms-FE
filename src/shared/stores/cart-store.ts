import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export interface CartItem {
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
}

interface CartActions {
  addToCart: (item: CartItem) => void;
  removeCartItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const selectCartTotal = (state: CartState & CartActions): number => state.items.reduce((s, i) => s + i.price * i.quantity, 0);

export const selectCartItemCount = (state: CartState & CartActions): number => state.items.reduce((s, i) => s + i.quantity, 0);

export const useCartStore = create<CartState & CartActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        items: [],

        addToCart: item => {
          const items = get().items;
          const existing = items.find(i => i.variantId === item.variantId);
          const updated =
            existing == null
              ? [...items, item]
              : items.map(i => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
          set({ items: updated });
        },

        removeCartItem: variantId => {
          set({ items: get().items.filter(i => i.variantId !== variantId) });
        },

        updateQuantity: (variantId, quantity) => {
          set({ items: get().items.map(i => (i.variantId === variantId ? { ...i, quantity } : i)) });
        },

        clearCart: () => set({ items: [] }),
      }),
      { name: 'cart-storage' }
    )
  )
);
