import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';

import ProductsClient from '@/app/[locale]/(shop)/_components/products/ProductsClient';

interface ProductsPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ category?: string; sortBy?: string; page?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { category, sortBy, page } = await searchParams;

  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsClient category={category} sortBy={sortBy} page={page} />
    </Suspense>
  );
}

const SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

function ProductsPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {SKELETON_KEYS.map(k => (
          <div key={k} className="animate-pulse rounded-xl">
            <div className="aspect-square w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-3 space-y-2 px-1">
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
