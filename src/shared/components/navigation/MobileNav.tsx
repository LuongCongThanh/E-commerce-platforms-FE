'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Menu } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/base/accordion';
import { Button } from '@/shared/components/base/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/base/Sheet';
import { NAV_CATEGORIES } from '@/shared/constants/nav-categories';

interface MobileNavProps {
  readonly locale: string;
}

export function MobileNav({ locale }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 sm:max-w-xs">
        <SheetHeader className="border-b border-neutral-100 p-4 text-left dark:border-neutral-800">
          <SheetTitle className="from-primary-500 to-accent-500 bg-linear-to-r bg-clip-text text-xl font-black tracking-tighter text-transparent">
            ANTIGRAVITY<span className="text-neutral-900 dark:text-white">.STORE</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="mb-4">
            <Link
              href={`/${locale}/products`}
              onClick={() => {
                setOpen(false);
              }}
              className="hover:text-primary-600 dark:hover:text-primary-400 block rounded-lg px-2 py-3 text-sm font-semibold text-neutral-800 transition-colors dark:text-neutral-200"
            >
              Tất cả sản phẩm
            </Link>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {NAV_CATEGORIES.map(cat => (
              <AccordionItem value={cat.slug} key={cat.slug} className="border-b border-neutral-100 dark:border-neutral-800">
                <AccordionTrigger className="px-2 py-3 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{cat.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pr-2 pb-3 pl-11">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/${locale}/categories/${cat.slug}`}
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="hover:text-primary-600 dark:hover:text-primary-400 mb-2 py-1 text-xs font-bold text-neutral-400 transition-colors dark:text-neutral-500"
                    >
                      TẤT CẢ {cat.name.toUpperCase()} ({cat.productCount})
                    </Link>
                    {cat.sub.map(sub => (
                      <Link
                        key={sub.slug}
                        href={`/${locale}/categories/${sub.slug}`}
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="hover:text-primary-600 dark:hover:text-primary-400 block rounded-md py-2 text-sm text-neutral-600 transition-colors dark:text-neutral-400"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <Link
              href={`/${locale}/categories/sale`}
              onClick={() => {
                setOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-bold text-orange-500 transition-colors hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              <span className="text-lg">🔥</span>
              Flash Sale
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
