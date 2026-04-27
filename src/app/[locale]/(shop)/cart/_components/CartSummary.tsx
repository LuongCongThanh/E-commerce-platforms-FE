'use client';

import Link from 'next/link';

import { ArrowRight, Truck } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { Separator } from '@/shared/components/base/Separator';
import { formatCurrency } from '@/shared/lib/utils';
import { useCartStore } from '@/shared/stores/cart-store';

interface CartSummaryProps {
  readonly locale: string;
}

export function CartSummary({ locale }: CartSummaryProps) {
  const { items, total } = useCartStore();
  const isEmpty = items.length === 0;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="mb-5 text-lg font-bold">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Tạm tính ({totalQty} sản phẩm)</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Phí vận chuyển</span>
          <span className="flex items-center gap-1.5 font-medium text-green-500">
            <Truck className="size-3.5" />
            Miễn phí
          </span>
        </div>

        <Separator className="my-2 opacity-20" />

        <div className="flex justify-between text-base font-bold">
          <span>Tổng cộng</span>
          <span className="text-primary-500">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button asChild className="mt-6 h-12 w-full text-base font-semibold" disabled={isEmpty}>
        <Link href={`/${locale}/checkout`} aria-disabled={isEmpty}>
          Tiến hành thanh toán
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>

      <Link href={`/${locale}/home`} className="mt-3 block text-center text-sm text-neutral-500 transition-colors hover:text-neutral-300">
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
