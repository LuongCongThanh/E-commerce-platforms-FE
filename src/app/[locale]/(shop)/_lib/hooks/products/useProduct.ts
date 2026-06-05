'use client';

import { useQuery } from '@tanstack/react-query';

import { productActions } from '@/app/[locale]/(shop)/_lib/actions/product';

const productKeys = {
  all: ['products'] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productActions.detail(slug),
    staleTime: 5 * 60_000,
  });
