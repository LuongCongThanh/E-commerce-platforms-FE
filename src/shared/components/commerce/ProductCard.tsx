import Image from 'next/image';
import Link from 'next/link';

import { Star } from 'lucide-react';

import { cn, formatCurrency } from '@/shared/lib/utils';

type BadgeValue = 'best-seller' | 'new' | 'sale' | 'low-stock';

interface BadgeLabels {
  'best-seller': string;
  new: string;
  sale: string;
  'low-stock': string;
}

interface ProductCardProps {
  readonly id: number | string;
  readonly name: string;
  readonly slug: string;
  readonly price: number;
  readonly salePrice?: number | null;
  readonly images: string[];
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly badges?: BadgeValue[];
  readonly locale: string;
  readonly badgeLabels?: Partial<BadgeLabels>;
}

const BADGE_STYLES: Record<BadgeValue, string> = {
  'best-seller': 'bg-amber-100 text-amber-800',
  new: 'bg-blue-100 text-blue-800',
  sale: 'bg-red-100 text-red-800',
  'low-stock': 'bg-orange-100 text-orange-800',
};

const DEFAULT_BADGE_LABELS: BadgeLabels = {
  'best-seller': 'Bán chạy',
  new: 'Mới',
  sale: 'Giảm giá',
  'low-stock': 'Sắp hết',
};

export const ProductCard = ({
  id,
  name,
  slug,
  price,
  salePrice,
  images,
  rating,
  reviewCount,
  badges,
  locale,
  badgeLabels,
}: ProductCardProps): React.JSX.Element => {
  const hasDiscount = typeof salePrice === 'number' && salePrice > 0 && salePrice < price;
  const displayPrice = hasDiscount ? salePrice : price;
  const coverImage = images[0] ?? '/placeholder-product.png';
  const resolvedBadgeLabels = { ...DEFAULT_BADGE_LABELS, ...badgeLabels };

  return (
    <Link href={`/${locale}/products/${slug}`} className="group block" data-product-id={String(id)}>
      <div className="bg-card text-card-foreground overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {badges != null && badges.length > 0 ? (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {badges.map(badge => (
                <span key={badge} className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', BADGE_STYLES[badge])}>
                  {resolvedBadgeLabels[badge]}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 p-3">
          <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">{name}</p>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-primary text-base font-bold">{formatCurrency(displayPrice)}</span>
            {hasDiscount ? <span className="text-muted-foreground text-xs line-through">{formatCurrency(price)}</span> : null}
          </div>

          {/* Rating */}
          {rating != null ? (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="text-foreground ml-0.5 text-xs font-medium">{rating.toFixed(1)}</span>
              </div>
              {reviewCount != null && reviewCount > 0 ? <span className="text-muted-foreground text-xs">({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
