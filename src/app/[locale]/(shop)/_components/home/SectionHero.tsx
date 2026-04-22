import Link from 'next/link';

import { homeHeroData } from '@/app/[locale]/(shop)/_lib/data/home';
import { Button } from '@/shared/components/base/Button';
import { TrustBadgeList } from '@/shared/components/marketing/TrustBadgeList';

export const SectionHero = (): React.JSX.Element => {
  const titleLines = homeHeroData.title.split('\n');

  return (
    <section className="from-primary to-primary/80 bg-gradient-to-br">
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 md:flex-row md:gap-12 md:py-24">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-6">
          <span className="bg-primary-foreground/20 text-primary-foreground w-fit rounded-full px-4 py-1 text-sm font-medium">
            {homeHeroData.badge}
          </span>
          <h1 className="text-primary-foreground text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {titleLines.map((line, idx) => (
              <span key={line}>
                {line}
                {idx < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="text-primary-foreground/80 text-lg">{homeHeroData.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="text-primary bg-white hover:bg-white/90">
              <Link href="/vi/products">{homeHeroData.cta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/vi/products?flash-sale=true">{homeHeroData.ctaSale}</Link>
            </Button>
          </div>
          <TrustBadgeList items={homeHeroData.trustItems} />
        </div>

        {/* Right column — placeholder image */}
        <div className="flex flex-1 justify-center">
          <div className="aspect-square w-full max-w-xs rounded-2xl bg-white/20" />
        </div>
      </div>
    </section>
  );
};
