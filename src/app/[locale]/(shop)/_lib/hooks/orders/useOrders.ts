'use client';

import { useQuery } from '@tanstack/react-query';

import { orderActions } from '@/app/[locale]/(shop)/_lib/actions/order';

const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
};

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: orderActions.list,
  });
