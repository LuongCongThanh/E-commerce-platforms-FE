import { useLocale } from 'next-intl';

import { homeCategoriesData } from '@/app/[locale]/(shop)/_lib/data/home';
import { CategoryCard } from '@/shared/components/commerce/CategoryCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionFeaturedCategories = (): React.JSX.Element => {
  const locale = useLocale();

  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Danh mục nổi bật" />
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {homeCategoriesData.map(cat => (
          <CategoryCard
            key={cat.slug}
            name={cat.name}
            image={cat.image}
            productCount={cat.productCount}
            href={`/${locale}/products?category=${cat.slug}`}
          />
        ))}
      </div>
    </section>
  );
};
