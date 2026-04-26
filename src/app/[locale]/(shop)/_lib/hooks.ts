'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { orderActions, productActions, profileActions } from '@/app/[locale]/(shop)/_lib/actions';
import { orderKeys, productKeys, profileKey } from '@/app/[locale]/(shop)/_lib/query-keys';
import type { CheckoutInput } from '@/app/[locale]/(shop)/_lib/schemas';
import type { ProductFilters } from '@/app/[locale]/(shop)/_lib/types';
import { useCartStore } from '@/shared/stores/cart-store';

export const useProducts = (filters: ProductFilters) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productActions.list(filters),
    staleTime: 60_000,
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productActions.detail(slug),
    staleTime: 5 * 60_000,
  });

export const useCategories = () =>
  useQuery({
    queryKey: productKeys.categories(),
    queryFn: productActions.categories,
    staleTime: 10 * 60_000,
  });

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: orderActions.list,
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderActions.detail(id),
  });

export const useCreateOrder = (locale: string) => {
  const qc = useQueryClient();
  const router = useRouter();
  const clearCart = useCartStore(s => s.clearCart);
  const items = useCartStore(s => s.items);

  return useMutation({
    mutationFn: (data: CheckoutInput) =>
      orderActions.create({
        ...data,
        items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    onSuccess: async order => {
      clearCart();
      await qc.invalidateQueries({ queryKey: orderKeys.list() });
      toast.success('Đặt hàng thành công!');
      router.push(`/${locale}/checkout/success?orderId=${String(order.id)}`);
    },
  });
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

export const useProfile = () =>
  useQuery({
    queryKey: profileKey,
    queryFn: profileActions.get,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileActions.update,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: profileKey });
      toast.success('Cập nhật thông tin thành công');
    },
  });
};
