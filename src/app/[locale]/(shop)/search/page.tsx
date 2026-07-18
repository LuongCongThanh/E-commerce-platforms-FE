import { SearchClient } from '@/app/[locale]/(shop)/_lib/components/search/SearchClient';

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
        <SearchClient />
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
          <p className="text-muted-foreground">Nhập từ khóa vào ô tìm kiếm để bắt đầu.</p>
        </div>
      )}
    </main>
  );
}
