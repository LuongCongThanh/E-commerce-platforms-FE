'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/app/[locale]/(shop)/_components/products/Pagination';
import { ProductGrid } from '@/app/[locale]/(shop)/_components/products/ProductGrid';
import { useSearch } from '@/app/[locale]/(shop)/_lib/hooks/useSearch';
import { Skeleton } from '@/shared/components/base/Skeleton';

export const SearchResults = (): React.JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const pageParam = searchParams.get('page');
  const page = pageParam !== null ? Math.max(1, Number(pageParam)) : 1;

  const { products, totalPages, isLoading } = useSearch({ query, page, pageSize: 12 });

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={`skeleton-${i.toString()}`} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
        <div className="mb-4 text-4xl">🔍</div>
        <h3 className="text-lg font-medium">Không tìm thấy kết quả nào cho "{query}"</h3>
        <p className="text-muted-foreground mt-1">Vui lòng kiểm tra lại chính tả hoặc thử với từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Tìm thấy <span className="text-foreground font-medium">{products.length}</span> sản phẩm phù hợp
        </p>
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
};
