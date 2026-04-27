import { Suspense } from 'react';

import { SearchResults } from '@/app/[locale]/(shop)/search/_components/SearchResults';
import { Skeleton } from '@/shared/components/base/Skeleton';

interface SearchPageProps {
  readonly searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          {query !== undefined && query !== '' ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
        </h1>
      </header>

      {query !== undefined && query !== '' ? (
        <Suspense fallback={<SearchLoadingSkeleton />}>
          <SearchResults />
        </Suspense>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
          <p className="text-muted-foreground">Nhập từ khóa vào ô tìm kiếm để bắt đầu.</p>
        </div>
      )}
    </main>
  );
}

function SearchLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={`skeleton-${i.toString()}`} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
