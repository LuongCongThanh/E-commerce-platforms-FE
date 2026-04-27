'use client';

import type { ProductVariant } from '@/app/[locale]/(shop)/_lib/types/product';
import { cn } from '@/shared/lib/utils';

interface VariantSelectorProps {
  readonly variants: ProductVariant[];
  readonly selectedVariant: ProductVariant | null;
  readonly onSelect: (variant: ProductVariant) => void;
}

export const VariantSelector = ({ variants, selectedVariant, onSelect }: VariantSelectorProps): React.JSX.Element | null => {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">Phân loại</h3>
        {selectedVariant !== null && <span className="text-sm font-semibold">{selectedVariant.label}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map(variant => {
          const isOutOfStock = variant.stock === 0;
          const isSelected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => {
                if (!isOutOfStock) {
                  onSelect(variant);
                }
              }}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? `${variant.label} - hết hàng` : variant.label}
              className={cn(
                'relative min-w-13 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150',
                isSelected && !isOutOfStock
                  ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 scale-105 shadow-md'
                  : !isOutOfStock
                    ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    : 'cursor-not-allowed border-white/5 bg-white/5 line-through opacity-40'
              )}
            >
              {variant.label}
              {isOutOfStock ? <span className="sr-only"> (Hết hàng)</span> : null}
            </button>
          );
        })}
      </div>

      {selectedVariant !== null && selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
          <span className="inline-block size-1.5 rounded-full bg-orange-400" />
          Chỉ còn {selectedVariant.stock.toString()} sản phẩm!
        </p>
      )}
    </div>
  );
};
