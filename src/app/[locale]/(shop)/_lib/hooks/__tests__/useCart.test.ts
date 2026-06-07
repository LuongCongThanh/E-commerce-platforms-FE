import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { initCartFromStorage, resetCartState, useCart } from '@/app/[locale]/(shop)/_lib/hooks/useCart';

const itemA = { variantId: 'v1', productId: 'p1', name: 'Áo thun', image: '/a.jpg', price: 100_000, quantity: 1 };
const itemB = { variantId: 'v2', productId: 'p2', name: 'Quần jean', image: '/b.jpg', price: 200_000, quantity: 2 };

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
    resetCartState();
  });

  it('starts empty', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('adds a new item', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(100_000);
    expect(result.current.itemCount).toBe(1);
  });

  it('merges quantity when adding the same variant twice', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.addToCart({ ...itemA, quantity: 3 }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.quantity).toBe(4);
    expect(result.current.itemCount).toBe(4);
  });

  it('removes an item by variantId', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.addToCart(itemB));
    act(() => result.current.removeCartItem('v1'));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(400_000);
    expect(result.current.itemCount).toBe(2);
  });

  it('updates quantity for an existing item', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.updateQuantity('v1', 5));
    expect(result.current.items[0]?.quantity).toBe(5);
    expect(result.current.total).toBe(500_000);
    expect(result.current.itemCount).toBe(5);
  });

  it('clears the cart entirely', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.addToCart(itemB));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('totals multiple different items correctly', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA)); // 100_000 × 1
    act(() => result.current.addToCart(itemB)); // 200_000 × 2
    expect(result.current.total).toBe(500_000);
    expect(result.current.itemCount).toBe(3);
  });

  it('merges only the matched variant when cart has multiple items', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.addToCart(itemB));
    act(() => result.current.addToCart({ ...itemA, quantity: 2 }));
    expect(result.current.items.find((i) => i.variantId === 'v1')?.quantity).toBe(3);
    expect(result.current.items.find((i) => i.variantId === 'v2')?.quantity).toBe(2);
  });

  it('updates only the matched variant quantity when cart has multiple items', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    act(() => result.current.addToCart(itemB));
    act(() => result.current.updateQuantity('v1', 10));
    expect(result.current.items.find((i) => i.variantId === 'v1')?.quantity).toBe(10);
    expect(result.current.items.find((i) => i.variantId === 'v2')?.quantity).toBe(2);
  });

  it('persists cart to localStorage on mutation', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addToCart(itemA));
    const stored = localStorage.getItem('cart-storage');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? '') as unknown[];
    expect(parsed).toHaveLength(1);
  });

  it('restores cart from localStorage', () => {
    localStorage.setItem('cart-storage', JSON.stringify([itemA]));
    act(() => initCartFromStorage());
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.variantId).toBe('v1');
  });
});
