'use client';

import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { VariantSelector } from '@/app/[locale]/(shop)/_components/products/VariantSelector';
import type { Product, ProductVariant } from '@/app/[locale]/(shop)/_lib/types/product';
import { Button } from '@/shared/components/base/Button';
import { useCartStore } from '@/shared/stores/cart-store';

interface AddToCartSectionProps {
  readonly product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const router = useRouter();
  const locale = useLocale();
  const addToCartButtonRef = useRef<HTMLButtonElement | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = () => {
    if (product.variants.length > 0 && selectedVariant === null) {
      toast.error('Vui lòng chọn phân loại sản phẩm');
      return;
    }

    addToCart({
      lineId: `${product.id.toString()}:${selectedVariant?.id ?? 'default'}`,
      productId: product.id.toString(),
      variantId: selectedVariant?.id ?? `v-${product.id.toString()}`,
      name: product.name,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      quantity: quantity,
      variantName: selectedVariant?.label,
    });

    const startRect = addToCartButtonRef.current?.getBoundingClientRect();
    if (startRect !== undefined) {
      window.dispatchEvent(
        new CustomEvent('cart-fly', {
          detail: {
            image: product.images[0],
            startRect: {
              left: startRect.left,
              top: startRect.top,
              width: startRect.width,
              height: startRect.height,
            },
          },
        })
      );
    }

    setIsAdded(true);
    toast.success(`Đã thêm ${quantity.toString()} sản phẩm vào giỏ hàng`, {
      description: product.name + (selectedVariant !== null ? ` (${selectedVariant.label})` : ''),
      action: {
        label: 'Giỏ hàng',
        onClick: () => {
          router.push(`/${locale}/cart`);
        },
      },
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (product.variants.length > 0 && selectedVariant === null) {
      toast.error('Vui lòng chọn phân loại sản phẩm');
      return;
    }
    handleAddToCart();
    router.push(`/${locale}/checkout`);
  };

  const hasVariants = product.variants.length > 0;
  const maxStock = selectedVariant?.stock ?? 0;
  const requiresVariantSelection = hasVariants && selectedVariant === null;

  return (
    <div className="space-y-8">
      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelect={v => {
            setSelectedVariant(v);
            setQuantity(1);
          }}
        />
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="mb-4 text-sm font-bold tracking-wider text-neutral-500 uppercase">Số lượng</h3>
        <div className="flex items-center gap-4">
          <div className="border-muted-foreground/20 bg-muted/50 flex items-center rounded-xl border p-1">
            <button
              onClick={() => {
                setQuantity(prev => Math.max(1, prev - 1));
              }}
              className="hover:bg-muted flex size-10 items-center justify-center rounded-lg transition-colors"
              disabled={requiresVariantSelection || quantity <= 1}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <button
              onClick={() => {
                setQuantity(prev => Math.min(maxStock, prev + 1));
              }}
              className="hover:bg-muted flex size-10 items-center justify-center rounded-lg transition-colors"
              disabled={requiresVariantSelection || quantity >= maxStock}
            >
              <Plus className="size-4" />
            </button>
          </div>
          {requiresVariantSelection ? (
            <span className="text-muted-foreground text-sm">Chọn phân loại để xem tồn kho.</span>
          ) : maxStock > 0 ? (
            <span className="text-muted-foreground text-sm">{maxStock.toString()} sản phẩm có sẵn</span>
          ) : (
            <span className="text-sm font-medium text-red-500">Phân loại này đã hết hàng</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          ref={addToCartButtonRef}
          variant="outline"
          size="lg"
          className="relative h-14 flex-1 overflow-hidden transition-all active:scale-95"
          onClick={handleAddToCart}
          disabled={isAdded || requiresVariantSelection || maxStock === 0}
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
          onClick={handleBuyNow}
          disabled={requiresVariantSelection || maxStock === 0}
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
