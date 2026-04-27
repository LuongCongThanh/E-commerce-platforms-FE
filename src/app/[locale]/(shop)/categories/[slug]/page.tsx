import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { CategoryClient } from '@/app/[locale]/(shop)/_components/categories/CategoryClient';
import { FilterSidebar } from '@/app/[locale]/(shop)/_components/categories/FilterSidebar';
import { getCategoryBySlug } from '@/app/[locale]/(shop)/_lib/queries';
import { Skeleton } from '@/shared/components/base/Skeleton';

interface CategoryPageProps {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (category === null) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumbs placeholder */}
      <nav className="text-muted-foreground mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>Trang chủ</li>
          <li>/</li>
          <li>Danh mục</li>
          <li>/</li>
          <li className="text-foreground font-medium">{category.name}</li>
        </ol>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
        {category.description !== undefined && category.description !== '' && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{category.description}</p>
        )}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 lg:shrink-0">
          <FilterSidebar />
        </div>

        {/* Content */}
        <div className="flex-1">
          <Suspense fallback={<CategoryLoadingSkeleton />}>
            <CategoryClient categorySlug={slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function CategoryLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={`skeleton-${i.toString()}`} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
