import { calculateDiscountPercent, cn, formatCurrency } from '@/shared/lib/utils';

interface PriceDisplayProps {
  readonly price: number;
  readonly salePrice?: number | null;
  readonly className?: string;
  readonly showDiscountBadge?: boolean;
}

export function PriceDisplay({ price, salePrice, className, showDiscountBadge = false }: PriceDisplayProps): React.JSX.Element {
  const hasDiscount = typeof salePrice === 'number' && salePrice > 0 && salePrice < price;
  const finalPrice = hasDiscount ? salePrice : price;
  const discountPercent = hasDiscount ? calculateDiscountPercent(price, salePrice) : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-foreground text-base font-semibold">{formatCurrency(finalPrice)}</span>
      {hasDiscount ? <span className="text-muted-foreground text-sm line-through">{formatCurrency(price)}</span> : null}
      {hasDiscount && showDiscountBadge && discountPercent > 0 ? (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">-{discountPercent}%</span>
      ) : null}
    </div>
  );
}
