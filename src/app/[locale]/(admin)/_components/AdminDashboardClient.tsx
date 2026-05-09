'use client';

import Link from 'next/link';

import { Clock3, Package, ShoppingBag, TrendingUp } from 'lucide-react';

import { useAdminDashboard } from '@/app/[locale]/(admin)/_lib/hooks';
import { Button } from '@/shared/components/base/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/base/Card';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { formatCurrency } from '@/shared/lib/utils';

const METRICS = [
  { key: 'totalOrders', label: 'Tong don hang', description: 'Toan bo don da ghi nhan', icon: ShoppingBag },
  { key: 'todayRevenue', label: 'Doanh thu hom nay', description: 'Tong gia tri don trong ngay', icon: TrendingUp },
  { key: 'pendingOrders', label: 'Don cho xu ly', description: 'Can admin xu ly tiep', icon: Clock3 },
  { key: 'totalProducts', label: 'Tong san pham', description: 'Chi so doc-only tu backend', icon: Package },
] as const;

interface AdminDashboardClientProps {
  readonly locale: string;
}

export function AdminDashboardClient({ locale }: AdminDashboardClientProps): React.JSX.Element {
  const { data, isPending, refetch, isError } = useAdminDashboard();

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['metric-1', 'metric-2', 'metric-3', 'metric-4'].map(key => (
          <div key={key} className="h-40 animate-pulse rounded-3xl bg-orange-100/60" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Chua tai duoc dashboard"
        description="Kiem tra API admin dashboard hoac thu tai lai de lay so lieu van hanh moi nhat."
        actionLabel="Tai lai"
        onAction={() => {
          refetch().catch(() => undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-3xl border border-orange-200 bg-white/90 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium tracking-[0.24em] text-orange-600 uppercase">P1-06 Admin Core</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Dashboard van hanh MVP</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Tong hop cac chi so can thiet de theo doi doanh thu trong ngay va xu ly don hang nhanh hon.
          </p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href={`/${locale}/admin/orders`}>Mo bang don hang</Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map(metric => {
          const Icon = metric.icon;
          const value = metric.key === 'todayRevenue' ? formatCurrency(data.todayRevenue) : new Intl.NumberFormat('vi-VN').format(data[metric.key]);

          return (
            <Card key={metric.key} className="rounded-3xl border-orange-100 bg-white/95 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="mt-2 text-3xl font-semibold text-slate-950">{value}</CardTitle>
                  </div>
                  <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
