'use client';

import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionNewArrivals = (): React.JSX.Element => {
  const locale = useLocale();
  const { newArrivals } = useHomeData();

  return (
    <section className="bg-neutral-50/70 dark:bg-neutral-900/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading title="Hàng mới về" ctaLabel="Xem thêm" ctaHref={`/${locale}/products`} />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map(product => (
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
      </div>
    </section>
  );
};
