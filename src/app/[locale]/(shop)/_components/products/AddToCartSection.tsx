'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';

import type { HomeProductHighlight } from '@/app/[locale]/(shop)/_lib/types/home';
import { Button } from '@/shared/components/base/Button';
import { useCartStore } from '@/shared/stores/cart-store';

interface AddToCartSectionProps {
  readonly product: HomeProductHighlight;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id.toString(),
      variantId: `v-${product.id.toString()}`, // Placeholder variant
      name: product.name,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      quantity: quantity,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div>
        <h3 className="mb-4 text-sm font-bold tracking-wider text-neutral-500 uppercase">Số lượng</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-white/10 bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              onClick={() => {
                setQuantity(prev => Math.max(1, prev - 1));
              }}
              className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <button
              onClick={() => {
                setQuantity(prev => prev + 1);
              }}
              className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="relative h-14 flex-1 overflow-hidden transition-all active:scale-95"
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="success"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="size-5" />
                Đã thêm vào giỏ
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="size-5" />
                Thêm vào giỏ hàng
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle glow effect */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </Button>
      </div>
    </div>
  );
}
