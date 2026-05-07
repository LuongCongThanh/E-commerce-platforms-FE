import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SlidersHorizontal } from 'lucide-react';

import { CategoryClient } from '@/app/[locale]/(shop)/_components/categories/CategoryClient';
import { FilterSidebar } from '@/app/[locale]/(shop)/_components/categories/FilterSidebar';
import { getCategoryBySlug } from '@/app/[locale]/(shop)/_lib/queries';
import { Button } from '@/shared/components/base/Button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/base/Sheet';
import { Skeleton } from '@/shared/components/base/Skeleton';

interface CategoryPageProps {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (category === null) {
    return {
      title: 'Danh mục không tồn tại | ANTIGRAVITY.STORE',
    };
  }

  const description = category.description ?? `Khám phá danh mục ${category.name} với các sản phẩm nổi bật được tuyển chọn cho storefront MVP.`;

  return {
    title: `${category.name} | ANTIGRAVITY.STORE`,
    description,
    openGraph: {
      title: `${category.name} | ANTIGRAVITY.STORE`,
      description,
      images: [category.image],
    },
  };
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
        <div className="hidden w-full lg:block lg:w-64 lg:shrink-0">
          <FilterSidebar />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-6 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <SlidersHorizontal className="size-4" />
                  Lọc sản phẩm
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl px-4 pt-10 pb-8">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle>Bộ lọc danh mục</SheetTitle>
                  <SheetDescription>Tùy chỉnh sắp xếp và khoảng giá để thu gọn danh sách sản phẩm.</SheetDescription>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>
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
