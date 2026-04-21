import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/base/Button';

export function HeroBanner() {
  const t = useTranslations('home');

  return (
    <section className="from-primary-500 to-secondary-600 relative overflow-hidden bg-gradient-to-br">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:flex-row lg:py-28 lg:text-left">
        {/* Text */}
        <div className="flex-1 text-white">
          <p className="mb-2 text-sm font-semibold tracking-widest uppercase opacity-80">{t('hero.badge')}</p>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight lg:text-5xl">{t('hero.title')}</h1>
          <p className="mt-4 max-w-lg text-lg opacity-90">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button asChild size="lg" className="text-primary-600 bg-white hover:bg-neutral-100">
              <Link href="/products">{t('hero.cta')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/products?category=sale">{t('hero.ctaSale')}</Link>
            </Button>
          </div>
        </div>

        {/* Image placeholder */}
        <div className="flex-1">
          <div className="mx-auto aspect-square w-64 rounded-2xl bg-white/20 lg:w-80" />
        </div>
      </div>
    </section>
  );
}
