'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { CartDrawer } from '@/shared/components/commerce/CartDrawer';
import { useCartStore } from '@/shared/stores/cart-store';

export function Header() {
  const t = useTranslations('common');
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore(state => state.itemCount);

  return (
    <header className="glass sticky top-0 z-50 w-full transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="from-primary-500 to-accent-500 bg-linear-to-r bg-clip-text text-xl font-black tracking-tighter text-transparent transition-transform group-hover:scale-105">
            ANTIGRAVITY<span className="text-neutral-900 dark:text-white">.STORE</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="hover:text-primary-500 text-sm font-medium text-neutral-600 transition-colors">
            Sản phẩm
          </Link>
          <Link href="/products?category=sale" className="text-secondary-500 hover:text-secondary-600 text-sm font-medium transition-colors">
            Flash Sale
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" aria-label={t('search')} className="hidden sm:inline-flex">
            <Search className="size-5" />
          </Button>

          {/* Cart */}
          <CartDrawer>
            <Button variant="ghost" size="icon" aria-label="Giỏ hàng" className="relative">
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="bg-primary-500 absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          {/* User */}
          <Button variant="ghost" size="icon" aria-label="Tài khoản">
            <User className="size-5" />
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => {
              setMobileOpen(v => !v);
            }}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen ? (
        <nav className="border-border bg-background border-t px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="/products"
                className="hover:text-primary-500 block text-sm font-medium text-neutral-700"
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=sale"
                className="text-secondary-500 block text-sm font-medium"
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                Flash Sale
              </Link>
            </li>
            <li>
              <Link
                href="/auth/login"
                className="hover:text-primary-500 block text-sm font-medium text-neutral-700"
                onClick={() => {
                  setMobileOpen(false);
                }}
              >
                Đăng nhập
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
