'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { orderActions } from '@/app/[locale]/(shop)/_lib/api/order';
import { ApiError } from '@/shared/lib/errors/api-error';

const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const useCancelOrder = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => orderActions.cancel(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      await qc.invalidateQueries({ queryKey: orderKeys.list() });
      toast.success('Đã huỷ đơn hàng');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Huỷ đơn hàng thất bại. Vui lòng thử lại.');
    },
  });
};
