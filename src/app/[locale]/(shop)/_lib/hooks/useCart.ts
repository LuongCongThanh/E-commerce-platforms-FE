'use client';

import { useSyncExternalStore } from 'react';

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

const CART_STORAGE_KEY = 'cart-storage';

type Listener = () => void;

function readPersistedCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw === null ? [] : (JSON.parse(raw) as CartItem[]);
  } catch {
    return [];
  }
}

// readPersistedCart is SSR-safe via try/catch — localStorage throws ReferenceError in Node.js
let _items: CartItem[] = readPersistedCart();
const _listeners = new Set<Listener>();

function getSnapshot(): CartItem[] {
  return _items;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

function subscribeCart(listener: Listener): () => void {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

function setItems(updater: (prev: CartItem[]) => CartItem[]): void {
  _items = updater(_items);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(_items));
  _listeners.forEach((l) => {
    l();
  });
}

export function resetCartState(): void {
  _items = [];
  _listeners.forEach((l) => {
    l();
  });
}

export function initCartFromStorage(): void {
  _items = readPersistedCart();
  _listeners.forEach((l) => {
    l();
  });
}

export function addToCart(item: CartItem): void {
  setItems((prev) => {
    const existing = prev.find((i) => i.variantId === item.variantId);
    return existing === undefined
      ? [...prev, item]
      : prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
  });
}

export function removeCartItem(variantId: string): void {
  setItems((prev) => prev.filter((i) => i.variantId !== variantId));
}

export function updateQuantity(variantId: string, quantity: number): void {
  setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
}

export function clearCart(): void {
  setItems(() => []);
}

export function useCart() {
  const items = useSyncExternalStore(subscribeCart, getSnapshot, getServerSnapshot);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return { items, addToCart, removeCartItem, updateQuantity, clearCart, total, itemCount };
}
