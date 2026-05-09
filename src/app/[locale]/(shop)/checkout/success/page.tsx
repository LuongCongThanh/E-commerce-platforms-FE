import { CheckoutSuccessClient } from '@/app/[locale]/(shop)/_components/checkout/CheckoutSuccessClient';

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ orderId?: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { orderId } = await searchParams;

  return <CheckoutSuccessClient locale={locale} orderId={orderId ?? null} />;
}
