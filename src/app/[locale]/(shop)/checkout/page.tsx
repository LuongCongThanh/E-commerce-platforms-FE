import { use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';

import { CheckoutForm } from '@/app/[locale]/(shop)/_components/checkout/CheckoutForm';
import { OrderSummary } from '@/app/[locale]/(shop)/_components/checkout/OrderSummary';

export default function CheckoutPage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('checkout');

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href={`/${locale}/cart`}
          className="group text-muted-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t('backToCart')}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <h1 className="mb-8 text-4xl font-bold tracking-tight">{t('title')}</h1>
            <CheckoutForm />
          </div>

          <div className="relative">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
