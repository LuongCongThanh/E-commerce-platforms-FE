'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Search, ShoppingCart, X } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { CartDrawer } from '@/shared/components/commerce/CartDrawer';
import { DesktopMegaMenu } from '@/shared/components/layouts/DesktopMegaMenu';
import { MobileNav } from '@/shared/components/layouts/MobileNav';
import { useCartStore } from '@/shared/stores/cart-store';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCartStore(state => state.itemCount);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="glass sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href={`/${locale}/home`} className="group flex items-center gap-2">
            <span className="from-primary-500 to-accent-500 bg-linear-to-r bg-clip-text text-xl font-black tracking-tighter text-transparent transition-transform group-hover:scale-105">
              ANTIGRAVITY<span className="text-neutral-900 dark:text-white">.STORE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href={`/${locale}/products`}
              className="group hover:text-primary-600 dark:hover:text-primary-400 relative rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
            >
              Tất cả sản phẩm
            </Link>

            <DesktopMegaMenu locale={locale} />

            <Link
              href={`/${locale}/categories/sale`}
              className="rounded-lg px-3 py-2 text-sm font-bold text-orange-500 transition-colors hover:text-orange-400"
            >
              🔥 Flash Sale
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-9 w-48 rounded-lg border border-white/20 bg-white/10 px-3 text-sm backdrop-blur-sm outline-none focus:border-white/40 sm:w-64"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
              >
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('search')}
              onClick={() => {
                setSearchOpen(true);
              }}
              className="hidden sm:inline-flex"
            >
              <Search className="size-5" />
            </Button>
          )}

          <CartDrawer>
            <Button variant="ghost" size="icon" aria-label="Giỏ hàng" className="relative">
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="bg-primary-500 absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
