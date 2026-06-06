'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { orderActions } from '@/app/[locale]/(shop)/_lib/actions/order';
import type { CheckoutInput } from '@/app/[locale]/(shop)/_lib/schemas/checkout';
import { clearCart, useCart } from '@/shared/hooks/useCart';

const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
};

export const useCreateOrder = (locale: string) => {
  const qc = useQueryClient();
  const router = useRouter();
  const { items } = useCart();

  return useMutation({
    mutationFn: async (data: CheckoutInput) =>
      orderActions.create({
        ...data,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    onSuccess: async (order) => {
      clearCart();
      await qc.invalidateQueries({ queryKey: orderKeys.list() });
      toast.success('Đặt hàng thành công!');
      router.push(`/${locale}/checkout/success?orderId=${String(order.id)}`);
    },
  });
};
