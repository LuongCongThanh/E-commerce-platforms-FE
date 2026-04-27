import { setRequestLocale } from 'next-intl/server';

import { CartClient } from '@/app/[locale]/(shop)/cart/_components/CartClient';

interface CartPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Giỏ hàng</h1>
      <CartClient locale={locale} />
    </div>
  );
}
