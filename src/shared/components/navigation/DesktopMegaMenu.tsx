'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

import type { NavCategory } from '@/shared/constants/nav-categories';
import { NAV_CATEGORIES } from '@/shared/constants/nav-categories';

interface DesktopMegaMenuProps {
  readonly locale: string;
}

export function DesktopMegaMenu({ locale }: DesktopMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NavCategory>(NAV_CATEGORIES[0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // slight delay to prevent accidental closing
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        type="button"
        aria-expanded={isOpen}
        className="group hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
      >
        Danh mục
        <ChevronDown
          className={`size-3.5 transition-transform duration-300 ease-out ${isOpen ? 'text-primary-600 dark:text-primary-400 rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full -left-16 z-50 mt-2 w-[600px] overflow-hidden rounded-2xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80"
          >
            <div className="flex h-[360px]">
              {/* Left Column: Categories */}
              <div className="w-[200px] shrink-0 border-r border-neutral-200/50 bg-neutral-50/50 py-3 dark:border-white/10 dark:bg-neutral-950/50">
                <ul className="relative flex flex-col px-2">
                  {NAV_CATEGORIES.map(cat => {
                    const isActive = activeCategory.slug === cat.slug;
                    return (
                      <li key={cat.slug} className="relative">
                        <button
                          type="button"
                          onMouseEnter={() => {
                            setActiveCategory(cat);
                          }}
                          className={`relative z-10 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'text-primary-700 dark:text-primary-300'
                              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base">{cat.icon}</span>
                            {cat.name}
                          </span>
                          <ChevronRight className={`size-3.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                        {isActive ? (
                          <motion.div
                            layoutId="mega-menu-active-bg"
                            className="bg-primary-100 dark:bg-primary-900/30 absolute inset-0 z-0 rounded-lg"
                            initial={false}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Column: Sub-categories */}
              <div className="relative flex-1 overflow-hidden p-6">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeCategory.slug}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-full flex-col"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                        <span>{activeCategory.icon}</span>
                        {activeCategory.name}
                      </h3>
                      <Link
                        href={`/${locale}/categories/${activeCategory.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="group text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors"
                      >
                        Xem tất cả
                        <span className="bg-primary-100 group-hover:bg-primary-200 dark:bg-primary-900/50 rounded-full px-1.5 py-0.5 text-[10px]">
                          {activeCategory.productCount}
                        </span>
                      </Link>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {activeCategory.sub.map((sub, i) => (
                        <motion.li
                          key={sub.slug}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 + 0.1, duration: 0.2 }}
                        >
                          <Link
                            href={`/${locale}/categories/${sub.slug}`}
                            onClick={() => {
                              setIsOpen(false);
                            }}
                            className="group flex items-center rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
                          >
                            <div className="flex flex-col">
                              <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-sm font-medium text-neutral-700 transition-colors dark:text-neutral-300">
                                {sub.name}
                              </span>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Promotional Banner for specific categories */}
                    {activeCategory.slug === 'sale' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="relative mt-auto overflow-hidden rounded-xl bg-linear-to-r from-orange-500 to-red-500 p-4 text-white shadow-md"
                      >
                        <div className="relative z-10">
                          <p className="text-sm font-bold tracking-wider text-white/90 uppercase">Flash Sale</p>
                          <p className="mt-1 text-lg leading-tight font-black">Giảm đến 70%</p>
                          <Link
                            href={`/${locale}/categories/sale/flash-sale`}
                            onClick={() => {
                              setIsOpen(false);
                            }}
                            className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
                          >
                            Mua ngay <ChevronRight className="size-3" />
                          </Link>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-white/10 blur-2xl" />
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
