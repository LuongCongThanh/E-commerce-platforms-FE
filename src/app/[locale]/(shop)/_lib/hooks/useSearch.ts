'use client';

import { useMemo } from 'react';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';

interface UseSearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Hook to search products by name (static search)
 */
export function useSearch({ query = '', page = 1, pageSize = 12 }: UseSearchParams = {}) {
  return useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery === '') {
      return {
        products: [],
        total: 0,
        totalPages: 1,
        isLoading: false,
      };
    }

    const filtered = productsData.filter(p => p.name.toLowerCase().includes(trimmedQuery) || p.description.toLowerCase().includes(trimmedQuery));

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const products = filtered.slice(start, start + pageSize);

    return {
      products,
      total,
      totalPages,
      isLoading: false,
    };
  }, [query, page, pageSize]);
}
