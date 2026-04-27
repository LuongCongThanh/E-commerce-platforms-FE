'use client';

import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { useHomeFlashSaleCountdown } from '@/app/[locale]/(shop)/_lib/hooks/useHomeFlashSaleCountdown';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { CountdownTimer } from '@/shared/components/marketing/CountdownTimer';

export const SectionFlashSale = (): React.JSX.Element => {
  const locale = useLocale();
  const { targetDate } = useHomeFlashSaleCountdown();
  const { flashSale } = useHomeData();

  return (
    <section className="bg-destructive/90">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-destructive-foreground text-2xl font-bold tracking-tight">Flash Sale</h2>
            <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-red-600">Hôm nay thôi</span>
          </div>
          <CountdownTimer targetDate={targetDate} variant="compact" />
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {flashSale.map(product => (
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
