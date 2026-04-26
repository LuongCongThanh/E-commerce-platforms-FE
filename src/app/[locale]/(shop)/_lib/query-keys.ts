import type { ProductFilters } from '@/app/[locale]/(shop)/_lib/types';

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const profileKey = ['profile'] as const;
