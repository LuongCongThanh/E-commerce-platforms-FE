import { setRequestLocale } from 'next-intl/server';

import { CategoryGrid } from './_components/CategoryGrid';
import { FeaturedProducts } from './_components/FeaturedProducts';
import { FlashSaleBanner } from './_components/FlashSaleBanner';
import { HeroBanner } from './_components/HeroBanner';

export default async function HomePage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FlashSaleBanner />
      <FeaturedProducts />
    </>
  );
}
