'use client';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { formatCurrency } from '@/shared/lib/utils';
import type { CartItem } from '@/shared/stores/cart-store';
import { useCartStore } from '@/shared/stores/cart-store';

export function CartTable() {
  const { items, updateQuantity, removeCartItem } = useCartStore();

  return (
    <div className="space-y-4">
      <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-white/10 pb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase sm:grid">
        <span>Sản phẩm</span>
        <span className="text-center">Đơn giá</span>
        <span className="text-center">Số lượng</span>
        <span className="text-right">Tổng</span>
      </div>

      <AnimatePresence initial={false}>
        {items.map(item => (
          <CartRow
            key={item.variantId}
            item={item}
            onUpdateQty={(qty: number) => {
              updateQuantity(item.variantId, qty);
            }}
            onRemove={() => {
              removeCartItem(item.variantId);
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface CartRowProps {
  readonly item: CartItem;
  readonly onUpdateQty: (qty: number) => void;
  readonly onRemove: () => void;
}

function CartRow({ item, onUpdateQty, onRemove }: CartRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-100 dark:bg-neutral-800">
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="line-clamp-1 font-semibold">{item.name}</p>
              {item.variantName !== undefined && item.variantName.length > 0 && <p className="mt-0.5 text-xs text-neutral-500">{item.variantName}</p>}
              <p className="text-primary-500 mt-1 text-sm font-bold sm:hidden">{formatCurrency(item.price)}</p>
            </div>
            <button type="button" onClick={onRemove} aria-label="Xóa sản phẩm" className="text-neutral-400 transition-colors hover:text-red-500">
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => {
                  onUpdateQty(Math.max(1, item.quantity - 1));
                }}
                disabled={item.quantity <= 1}
                aria-label="Giảm"
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => {
                  onUpdateQty(Math.min(99, item.quantity + 1));
                }}
                disabled={item.quantity >= 99}
                aria-label="Tăng"
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-3" />
              </button>
            </div>

            <div className="text-right">
              <p className="hidden text-xs text-neutral-500 sm:block">
                {formatCurrency(item.price)} × {item.quantity}
              </p>
              <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
