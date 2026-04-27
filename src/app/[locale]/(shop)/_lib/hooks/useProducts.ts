'use client';

import { useMemo } from 'react';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';

export type SortBy = 'newest' | 'price_asc' | 'price_desc';

interface UseProductsParams {
  categorySlug?: string;
  sortBy?: SortBy;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

/**
 * Hook to filter, sort and paginate products from the static dataset
 */
export function useProducts({
  categorySlug,
  sortBy = 'newest',
  minPrice = 0,
  maxPrice = 10_000_000,
  page = 1,
  pageSize = 12,
}: UseProductsParams = {}) {
  return useMemo(() => {
    let filtered: Product[] = productsData;

    // Filter by category
    if (categorySlug !== undefined && categorySlug !== '' && categorySlug !== 'all') {
      filtered = filtered.filter(p => p.categorySlug === categorySlug);
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const effectivePrice = p.salePrice ?? p.price;
      return effectivePrice >= minPrice && effectivePrice <= maxPrice;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aPrice = a.salePrice ?? a.price;
      const bPrice = b.salePrice ?? b.price;
      if (sortBy === 'price_asc') return aPrice - bPrice;
      if (sortBy === 'price_desc') return bPrice - aPrice;
      // Newest (higher ID means newer in our mock)
      return b.id - a.id;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const products = sorted.slice(start, start + pageSize);

    return {
      products,
      total,
      totalPages,
      currentPage,
      isLoading: false, // Static data, so no loading state
    };
  }, [categorySlug, sortBy, minPrice, maxPrice, page, pageSize]);
}
