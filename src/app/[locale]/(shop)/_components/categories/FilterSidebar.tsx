'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import type { SyntheticEvent } from 'react';

import type { SortBy } from '@/app/[locale]/(shop)/_lib/hooks/useProducts';
import { Button } from '@/shared/components/base/Button';
import { Input } from '@/shared/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/base/Select';

export const FilterSidebar = (): React.JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortByParam = searchParams.get('sort') ?? searchParams.get('sortBy');
  const currentSort = (sortByParam as SortBy | null) !== null ? (sortByParam as SortBy) : 'newest';
  const currentMinPrice = searchParams.get('min_price') ?? searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('max_price') ?? searchParams.get('maxPrice') ?? '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const legacyKeys: Record<string, string[]> = {
      sort: ['sortBy'],
      min_price: ['minPrice'],
      max_price: ['maxPrice'],
    };

    for (const legacyKey of legacyKeys[key] ?? []) {
      params.delete(legacyKey);
    }

    if (value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filter changes
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handlePriceSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const minPriceValue = formData.get('minPrice');
    const maxPriceValue = formData.get('maxPrice');
    const minPrice = typeof minPriceValue === 'string' ? minPriceValue : '';
    const maxPrice = typeof maxPriceValue === 'string' ? maxPriceValue : '';

    params.delete('minPrice');
    params.delete('maxPrice');

    if (minPrice !== '') {
      params.set('min_price', minPrice);
    } else {
      params.delete('min_price');
    }

    if (maxPrice !== '') {
      params.set('max_price', maxPrice);
    } else {
      params.delete('max_price');
    }

    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <aside className="space-y-8">
      {/* Sorting */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">Sắp xếp theo</h3>
        <Select
          value={currentSort}
          onValueChange={val => {
            updateFilters('sort', val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn kiểu sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price_asc">Giá tăng dần</SelectItem>
            <SelectItem value="price_desc">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-wider text-neutral-500 uppercase">Khoảng giá (VNĐ)</h3>
        <form onSubmit={handlePriceSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <Input name="minPrice" type="number" placeholder="Từ" defaultValue={currentMinPrice} className="h-9" />
            <span className="text-muted-foreground">-</span>
            <Input name="maxPrice" type="number" placeholder="Đến" defaultValue={currentMaxPrice} className="h-9" />
          </div>
          <Button type="submit" size="sm" className="w-full">
            Áp dụng
          </Button>
        </form>
      </div>

      {/* Clear Filters */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground w-full"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('sort');
          params.delete('sortBy');
          params.delete('min_price');
          params.delete('minPrice');
          params.delete('max_price');
          params.delete('maxPrice');
          params.delete('page');
          params.delete('subcategory');
          router.push(params.size > 0 ? `?${params.toString()}` : window.location.pathname);
        }}
      >
        Xóa tất cả bộ lọc
      </Button>
    </aside>
  );
};
