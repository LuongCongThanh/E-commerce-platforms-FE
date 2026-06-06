'use client';

import { useQuery } from '@tanstack/react-query';

import { orderActions } from '@/app/[locale]/(shop)/_lib/actions/order';

const orderKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const useOrder = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => orderActions.detail(id),
  });
