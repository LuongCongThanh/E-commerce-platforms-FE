import { setRequestLocale } from 'next-intl/server';

import { SectionBestSellers } from '@/app/[locale]/(shop)/_components/home/SectionBestSellers';
import { SectionFeaturedCategories } from '@/app/[locale]/(shop)/_components/home/SectionFeaturedCategories';
import { SectionFlashSale } from '@/app/[locale]/(shop)/_components/home/SectionFlashSale';
import { SectionHero } from '@/app/[locale]/(shop)/_components/home/SectionHero';
import { SectionNewArrivals } from '@/app/[locale]/(shop)/_components/home/SectionNewArrivals';
import { SectionNewsletter } from '@/app/[locale]/(shop)/_components/home/SectionNewsletter';
import { SectionTestimonials } from '@/app/[locale]/(shop)/_components/home/SectionTestimonials';
import { SectionWhyChooseUs } from '@/app/[locale]/(shop)/_components/home/SectionWhyChooseUs';

export default async function HomePage({ params }: { readonly params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SectionHero />
      <SectionFeaturedCategories />
      <SectionFlashSale />
      <SectionBestSellers />
      <SectionNewArrivals />
      <SectionWhyChooseUs />
      <SectionTestimonials />
      <SectionNewsletter />
    </>
  );
}
