'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

import { useCartStore } from '@/shared/stores/cart-store';

export default function CheckoutPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const itemCount = useCartStore(s => s.itemCount);

  if (itemCount === 0) {
    redirect(`/${locale}/cart`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Thanh toán</h1>
      {/* CheckoutForm sẽ được thêm khi có _components/CheckoutForm */}
      <p className="text-muted-foreground">Form thanh toán đang được phát triển.</p>
    </main>
  );
}
