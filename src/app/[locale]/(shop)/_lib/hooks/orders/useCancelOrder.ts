'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { orderActions } from '@/app/[locale]/(shop)/_lib/actions/order';

const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const useCancelOrder = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => orderActions.cancel(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      await qc.invalidateQueries({ queryKey: orderKeys.list() });
      toast.success('Đã huỷ đơn hàng');
    },
  });
};
