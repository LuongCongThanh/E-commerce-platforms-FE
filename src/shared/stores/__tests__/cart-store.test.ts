import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/shared/stores/cart-store';

const itemA = { variantId: 'v1', productId: 'p1', name: 'Áo thun', image: '/a.jpg', price: 100000, quantity: 1 };
const itemB = { variantId: 'v2', productId: 'p2', name: 'Quần jean', image: '/b.jpg', price: 200000, quantity: 2 };

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0 });
  });

  it('starts empty', () => {
    const { items, total, itemCount } = useCartStore.getState();

    expect(items).toHaveLength(0);
    expect(total).toBe(0);
    expect(itemCount).toBe(0);
  });

  it('adds a new item and recalculates total and count', () => {
    useCartStore.getState().addToCart(itemA);

    const { items, total, itemCount } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(total).toBe(100000);
    expect(itemCount).toBe(1);
  });

  it('increments quantity when adding the same variant twice', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart({ ...itemA, quantity: 3 });

    const { items, itemCount } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(4);
    expect(itemCount).toBe(4);
  });

  it('removes an item by variantId', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().removeCartItem('v1');

    const { items, total, itemCount } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(total).toBe(400000);
    expect(itemCount).toBe(2);
  });

  it('updates quantity for an existing item', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().updateQuantity('v1', 5);

    const { items, total, itemCount } = useCartStore.getState();
    expect(items[0]?.quantity).toBe(5);
    expect(total).toBe(500000);
    expect(itemCount).toBe(5);
  });

  it('clears the cart entirely', () => {
    useCartStore.getState().addToCart(itemA);
    useCartStore.getState().addToCart(itemB);
    useCartStore.getState().clearCart();

    const { items, total, itemCount } = useCartStore.getState();
    expect(items).toHaveLength(0);
    expect(total).toBe(0);
    expect(itemCount).toBe(0);
  });

  it('totals multiple different items correctly', () => {
    useCartStore.getState().addToCart(itemA); // 100000 × 1
    useCartStore.getState().addToCart(itemB); // 200000 × 2

    expect(useCartStore.getState().total).toBe(500000);
    expect(useCartStore.getState().itemCount).toBe(3);
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
