import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductGridSkeleton';

interface FeaturedProductsProps {
  readonly isLoading?: boolean;
}

export function FeaturedProducts({ isLoading }: FeaturedProductsProps): React.JSX.Element {
  const t = useTranslations('home');
  const placeholderCards = Array.from({ length: 8 }, (_, index) => `featured-product-placeholder-${String(index + 1)}`);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">{t('featured.title')}</h2>
        <Link href="/products" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
          {t('featured.viewAll')} →
        </Link>
      </div>

      {isLoading === true ? (
        <ProductGridSkeleton count={8} />
      ) : (
        /* Placeholder grid — sẽ được thay bằng ProductGrid khi có API */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {placeholderCards.map(placeholderId => (
            <div key={placeholderId} className="border-border rounded-card border bg-white p-3">
              <div className="mb-3 aspect-square w-full rounded-lg bg-neutral-100" />
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
              <div className="mt-2 h-5 w-1/2 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
