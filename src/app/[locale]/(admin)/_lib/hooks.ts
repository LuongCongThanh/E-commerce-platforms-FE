'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { adminActions } from '@/app/[locale]/(admin)/_lib/actions';
import { adminKeys } from '@/app/[locale]/(admin)/_lib/query-keys';
import type { AdminOrderStatus } from '@/app/[locale]/(admin)/_lib/types';

export const useAdminDashboard = () =>
  useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: adminActions.dashboard,
  });

export const useAdminOrders = () =>
  useQuery({
    queryKey: adminKeys.orders(),
    queryFn: adminActions.orders,
  });

export const useAdminOrder = (id: string) =>
  useQuery({
    queryKey: adminKeys.orderDetail(id),
    queryFn: () => adminActions.orderDetail(id),
    enabled: id.length > 0,
  });

export const useUpdateAdminOrderStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: AdminOrderStatus) => adminActions.updateOrderStatus(id, status),
    onSuccess: async order => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
      await queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      await queryClient.invalidateQueries({ queryKey: adminKeys.orderDetail(id) });
      queryClient.setQueryData(adminKeys.orderDetail(id), order);
      toast.success('Đã cập nhật trạng thái đơn hàng');
    },
  });
};
