import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/shared/stores/cart-store';

import { useCart } from '@/shared/hooks/useCart';

const item1 = { variantId: 'v1', productId: 'p1', name: 'Áo', image: '/img.jpg', price: 100000, quantity: 1 };
const item2 = { variantId: 'v2', productId: 'p2', name: 'Quần', image: '/img2.jpg', price: 200000, quantity: 2 };

describe('useCart', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0, itemCount: 0 });
  });

  it('returns empty state when cart has no items', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.isEmpty).toBe(true);
  });

  it('updates total and item count when items are added', () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(item1));
    act(() => result.current.addItem(item2));

    expect(result.current.isEmpty).toBe(false);
    expect(result.current.total).toBe(500000);
    expect(result.current.itemCount).toBe(3);
  });

  it('removes an item by variant id', () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(item1));
    act(() => result.current.removeItem('v1'));

    expect(result.current.items).toHaveLength(0);
  });

  it('updates quantity for an existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(item1));
    act(() => result.current.updateQuantity('v1', 5));

    expect(result.current.items[0]?.quantity).toBe(5);
  });

  it('clears the entire cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => result.current.addItem(item1));
    act(() => result.current.clearCart());

    expect(result.current.isEmpty).toBe(true);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });
});
