'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, PackageSearch, ShieldCheck } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { cn } from '@/shared/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Đơn hàng', icon: PackageSearch },
] as const;

interface AdminShellProps {
  readonly locale: string;
  readonly children: React.ReactNode;
}

export function AdminShell({ locale, children }: AdminShellProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#fffaf5_38%,#ffffff_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-3xl border border-orange-200 bg-white/90 p-4 shadow-sm backdrop-blur lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
            <div className="rounded-2xl bg-orange-500 p-3 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Admin Console</p>
              <p className="text-xs text-slate-600">Theo doi van hanh don hang MVP</p>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const href = `/${locale}${item.href}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-orange-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Button asChild variant="outline" className="mt-4 w-full justify-center border-orange-200 text-slate-700 hover:bg-orange-50">
            <Link href={`/${locale}/home`}>Quay về storefront</Link>
          </Button>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
