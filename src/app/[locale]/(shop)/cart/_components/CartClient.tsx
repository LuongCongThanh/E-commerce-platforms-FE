'use client';

import Link from 'next/link';

import { ShoppingBag } from 'lucide-react';

import { CartSummary } from '@/app/[locale]/(shop)/cart/_components/CartSummary';
import { CartTable } from '@/app/[locale]/(shop)/cart/_components/CartTable';
import { Button } from '@/shared/components/base/Button';
import { useCartStore } from '@/shared/stores/cart-store';

interface CartClientProps {
  readonly locale: string;
}

export function CartClient({ locale }: CartClientProps) {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <ShoppingBag className="size-10 text-neutral-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Giỏ hàng của bạn đang trống</h2>
          <p className="mt-2 text-sm text-neutral-500">Hãy khám phá các sản phẩm của chúng tôi và thêm vào giỏ hàng!</p>
        </div>
        <Button asChild size="lg">
          <Link href={`/${locale}/products`}>Khám phá sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="flex-1">
        <CartTable />
      </div>
      <div className="w-full lg:w-80 lg:shrink-0">
        <div className="lg:sticky lg:top-24">
          <CartSummary locale={locale} />
        </div>
      </div>
    </div>
  );
}
