'use client';

import { useRef } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { motion, useScroll, useTransform } from 'framer-motion';

import { homeHeroData } from '@/app/[locale]/(shop)/_lib/data/home';
import { Button } from '@/shared/components/base/Button';
import { TrustBadgeList } from '@/shared/components/marketing/TrustBadgeList';

export const SectionHero = (): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const titleLines = homeHeroData.title.split('\n');

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section ref={containerRef} className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Dynamic Background Elements */}
      <motion.div
        aria-hidden="true"
        style={{ y: y1 }}
        className="bg-primary-500/10 absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: y2 }}
        className="bg-accent-500/10 absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full blur-[100px]"
      />

      <div className="container mx-auto flex flex-col items-center gap-12 px-4 md:flex-row lg:gap-20">
        {/* Left column: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-1 flex-col gap-8"
        >
          <div className="glass text-primary-600 dark:text-primary-400 w-fit rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide">
            {homeHeroData.badge}
          </div>

          <h1 className="bg-linear-to-b from-neutral-900 to-neutral-500 bg-clip-text text-5xl leading-[1.1] font-black tracking-tighter text-transparent md:text-6xl lg:text-7xl dark:from-white dark:to-neutral-500">
            {titleLines.map(line => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">{homeHeroData.subtitle}</p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary-500 shadow-spatial-lg hover:bg-primary-600 h-14 px-8 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95"
            >
              <Link href={`/${locale}/products`}>{homeHeroData.cta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass h-14 px-8 text-lg font-semibold transition-all hover:bg-white/20">
              <Link href={`/${locale}/products?flash-sale=true`}>{homeHeroData.ctaSale}</Link>
            </Button>
          </div>

          <div className="mt-4 opacity-70 transition-opacity hover:opacity-100">
            <TrustBadgeList items={homeHeroData.trustItems} />
          </div>
        </motion.div>

        {/* Right column: 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="spatial-depth relative flex flex-1 justify-center"
        >
          <div className="relative aspect-square w-full max-w-lg">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_center,black,transparent)] opacity-20 dark:opacity-40">
              <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
            </div>

            {/* Main Floating Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass shadow-spatial-lg relative z-20 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] p-8"
            >
              <div className="from-primary-500/20 absolute inset-0 -z-10 rounded-[2.5rem] bg-linear-to-br to-transparent opacity-50" />

              {/* Product Image with Glow */}
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="bg-primary-500 absolute h-64 w-64 rounded-full opacity-20 blur-[60px]" />
                <div className="relative z-10 h-full w-full transition-transform duration-500 hover:scale-110">
                  <Image
                    src={homeHeroData.image}
                    alt={homeHeroData.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Blobs */}
            <motion.div
              animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="glass shadow-spatial-lg absolute -top-10 -right-10 z-30 flex h-32 w-32 flex-col items-center justify-center rounded-3xl border border-white/20"
              aria-label="Ưu đãi 20%"
            >
              <span className="text-primary-500 text-3xl font-bold">20%</span>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">Off</span>
            </motion.div>

            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="glass shadow-spatial-lg absolute -bottom-8 -left-8 z-10 h-40 w-40 rounded-full border border-white/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
