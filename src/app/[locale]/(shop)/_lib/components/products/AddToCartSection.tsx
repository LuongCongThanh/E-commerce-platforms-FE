'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';

import { useAddToCart } from '@/app/[locale]/(shop)/_lib/hooks/products/useAddToCart';
import type { ProductDisplay } from '@/app/[locale]/(shop)/_lib/types/product';
import { Button } from '@/shared/components/base/Button';

import { VariantSelector } from './VariantSelector';

interface AddToCartSectionProps {
  readonly product: ProductDisplay;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { selectedVariant, quantity, isAdded, maxStock, selectVariant, setQuantity, add, buyNow } = useAddToCart(product);

  return (
    <div className="space-y-8">
      {product.variants.length > 0 && <VariantSelector variants={product.variants} selectedVariant={selectedVariant} onSelect={selectVariant} />}

      <div>
        <h3 className="mb-4 text-sm font-bold tracking-wider text-neutral-500 uppercase">Số lượng</h3>
        <div className="flex items-center gap-4">
          <div className="border-muted-foreground/20 bg-muted/50 flex items-center rounded-xl border p-1">
            <button
              onClick={() => {
                setQuantity(prev => Math.max(1, prev - 1));
              }}
              className="hover:bg-muted flex size-10 items-center justify-center rounded-lg transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <button
              onClick={() => {
                setQuantity(prev => Math.min(maxStock, prev + 1));
              }}
              className="hover:bg-muted flex size-10 items-center justify-center rounded-lg transition-colors"
              disabled={quantity >= maxStock}
            >
              <Plus className="size-4" />
            </button>
          </div>
          {maxStock > 0 && <span className="text-muted-foreground text-sm">{maxStock.toString()} sản phẩm có sẵn</span>}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="relative h-14 flex-1 overflow-hidden transition-all active:scale-95"
          onClick={add}
          disabled={isAdded || maxStock === 0}
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
                Đã thêm
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
                Thêm vào giỏ
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 flex-1"
          onClick={buyNow}
          disabled={maxStock === 0}
        >
          <div className="flex items-center gap-2 font-bold tracking-wide uppercase">
            <Zap className="size-5 fill-current" />
            Mua ngay
          </div>
        </Button>
      </div>
    </div>
  );
}
