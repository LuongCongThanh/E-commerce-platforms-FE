'use client';

import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { CategoryCard } from '@/shared/components/commerce/CategoryCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionFeaturedCategories = (): React.JSX.Element => {
  const locale = useLocale();
  const { categories } = useHomeData();

  return (
    <section className="bg-neutral-50/70 dark:bg-neutral-900/20">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <SectionHeading title="Danh mục nổi bật" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map(cat => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              image={cat.image}
              productCount={cat.productCount}
              href={`/${locale}/products?category=${cat.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
