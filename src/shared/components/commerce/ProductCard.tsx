'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { MouseEvent } from 'react';

import { cn, formatCurrency } from '@/shared/lib/utils';
import type { BadgeValue } from '@/shared/types/product';

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
  'best-seller': 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
  new: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  sale: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
  'low-stock': 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
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

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/${locale}/products/${slug}`} className="block" data-product-id={String(id)}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass spatial-depth group shadow-spatial-sm hover:shadow-spatial-lg relative overflow-hidden rounded-2xl transition-all duration-300"
      >
        {/* Shine/Glare Effect */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Image */}
        <div className="relative aspect-square overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {badges != null && badges.length > 0 ? (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {badges.map(badge => (
                <span
                  key={badge}
                  className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase', BADGE_STYLES[badge])}
                >
                  {resolvedBadgeLabels[badge]}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4" style={{ transform: 'translateZ(30px)' }}>
          <p className="group-hover:text-primary-500 line-clamp-2 text-sm leading-tight font-semibold text-neutral-800 transition-colors dark:text-neutral-200">
            {name}
          </p>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-primary-600 dark:text-primary-400 text-lg font-black">{formatCurrency(displayPrice)}</span>
            {hasDiscount ? <span className="text-xs font-medium text-neutral-400 line-through">{formatCurrency(price)}</span> : null}
          </div>

          {/* Footer Card */}
          <div className="mt-1 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
            {rating != null ? (
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{rating.toFixed(1)}</span>
                {reviewCount != null && reviewCount > 0 ? <span className="text-[10px] text-neutral-400">({reviewCount})</span> : null}
              </div>
            ) : (
              <div />
            )}

            <div className="bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full p-1.5 opacity-0 transition-all group-hover:opacity-100">
              <ShoppingCart className="size-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
