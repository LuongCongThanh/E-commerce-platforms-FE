'use client';

import { useLocale } from 'next-intl';

import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';
import { ProductCard } from '@/shared/components/commerce/ProductCard';

interface ProductGridProps {
  readonly products: Product[];
  readonly isLoading?: boolean;
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps): React.JSX.Element => {
  const locale = useLocale();

  if (isLoading === true) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i.toString()}`} className="bg-muted aspect-3/4 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          salePrice={product.salePrice}
          images={product.images}
          rating={product.rating}
          reviewCount={product.reviewCount}
          badges={product.badges}
          locale={locale}
        />
      ))}
    </div>
  );
};
