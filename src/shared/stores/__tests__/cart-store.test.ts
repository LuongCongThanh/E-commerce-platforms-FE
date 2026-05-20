import { beforeEach, describe, expect, it } from 'vitest';

import { selectCartItemCount, selectCartTotal, useCartStore } from '@/shared/stores/cart-store';

const itemA = { variantId: 'v1', productId: 'p1', name: 'Áo thun', image: '/a.jpg', price: 100000, quantity: 1 };
const itemB = { variantId: 'v2', productId: 'p2', name: 'Quần jean', image: '/b.jpg', price: 200000, quantity: 2 };

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts empty', () => {
    const state = useCartStore.getState();

    expect(state.items).toHaveLength(0);
    expect(selectCartTotal(state)).toBe(0);
    expect(selectCartItemCount(state)).toBe(0);
  });

  it('adds a new item and recalculates total and count', () => {
    useCartStore.getState().addToCart(itemA);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(selectCartTotal(state)).toBe(100000);
    expect(selectCartItemCount(state)).toBe(1);
  });

  it('increments quantity when adding the same variant twice', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart({ ...itemA, quantity: 3 });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(4);
    expect(selectCartItemCount(state)).toBe(4);
  });

  it('removes an item by variantId', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().removeCartItem('v1');

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(selectCartTotal(state)).toBe(400000);
    expect(selectCartItemCount(state)).toBe(2);
  });

  it('updates quantity for an existing item', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().updateQuantity('v1', 5);

    const state = useCartStore.getState();
    expect(state.items[0]?.quantity).toBe(5);
    expect(selectCartTotal(state)).toBe(500000);
    expect(selectCartItemCount(state)).toBe(5);
  });

  it('clears the cart entirely', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().clearCart();

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(selectCartTotal(state)).toBe(0);
    expect(selectCartItemCount(state)).toBe(0);
  });

  it('totals multiple different items correctly', () => {
    useCartStore.getState().addToCart(itemA); // 100000 × 1
    useCartStore.getState().addToCart(itemB); // 200000 × 2

    const state = useCartStore.getState();
    expect(selectCartTotal(state)).toBe(500000);
    expect(selectCartItemCount(state)).toBe(3);
  });

  it('increments only the matched variant when cart has multiple items', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().addToCart({ ...itemA, quantity: 2 });

    const { items } = useCartStore.getState();
    expect(items.find(i => i.variantId === 'v1')?.quantity).toBe(3);
    expect(items.find(i => i.variantId === 'v2')?.quantity).toBe(2);
  });

  it('updates only the matched variant quantity when cart has multiple items', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().updateQuantity('v1', 10);

    const { items } = useCartStore.getState();
    expect(items.find(i => i.variantId === 'v1')?.quantity).toBe(10);
    expect(items.find(i => i.variantId === 'v2')?.quantity).toBe(2);
  });
});
