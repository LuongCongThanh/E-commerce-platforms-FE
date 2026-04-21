import { useCartStore } from '@/shared/stores/cart-store';

export function useCart() {
  const { items, total, itemCount, addToCart, removeCartItem, updateQuantity, clearCart } = useCartStore();

  return {
    items,
    total,
    itemCount,
    isEmpty: items.length === 0,
    addItem: addToCart,
    removeItem: removeCartItem,
    updateQuantity,
    clearCart,
  };
}
