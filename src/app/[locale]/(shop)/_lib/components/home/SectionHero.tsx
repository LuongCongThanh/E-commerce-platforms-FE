'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLocale } from 'next-intl';

import { TrustBadgeList } from '@/app/[locale]/(shop)/_lib/components/home/TrustBadgeList';
import { homeHeroData } from '@/app/[locale]/(shop)/_lib/data/home';
import { Button } from '@/shared/components/base/Button';

export function SectionHero(): React.JSX.Element {
  const locale = useLocale();
  const titleLines = homeHeroData.title.split('\n');

  return (
    <section className="container mx-auto px-4 pt-6 md:pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white">
        <Image src={homeHeroData.image} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center md:py-24">
          <span className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-white/80">
            {homeHeroData.badge}
          </span>
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="max-w-md text-base text-white/70 md:text-lg">{homeHeroData.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-base font-semibold text-neutral-950 hover:bg-white/90">
              <Link href={`/${locale}/products`}>{homeHeroData.cta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={`/${locale}/products?flash-sale=true`}>{homeHeroData.ctaSale}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="py-6">
        <TrustBadgeList items={homeHeroData.trustItems} />
      </div>
    </section>
  );
}
