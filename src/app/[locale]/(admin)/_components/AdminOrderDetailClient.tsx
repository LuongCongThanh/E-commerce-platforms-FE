'use client';

import { use } from 'react';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { AdminOrderStatusSelect } from '@/app/[locale]/(admin)/_components/AdminOrderStatusSelect';
import { useAdminOrder } from '@/app/[locale]/(admin)/_lib/hooks';
import { OrderTimeline } from '@/app/[locale]/(shop)/_components/OrderTimeline';
import { Button } from '@/shared/components/base/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/base/Card';
import { Separator } from '@/shared/components/base/Separator';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { OrderStatusBadge } from '@/shared/components/common/OrderStatusBadge';
import { PAYMENT_METHOD_LABEL } from '@/shared/constants/app-config';
import { formatCurrency, formatDateTime } from '@/shared/lib/utils';

export function AdminOrderDetailClient({ params }: { readonly params: Promise<{ locale: string; id: string }> }): React.JSX.Element {
  const { locale, id } = use(params);
  const { data: order, isPending, isError, refetch } = useAdminOrder(id);

  if (isPending) {
    return (
      <div className="space-y-4">
        {['order-detail-1', 'order-detail-2', 'order-detail-3'].map(key => (
          <div key={key} className="h-32 animate-pulse rounded-3xl bg-orange-100/60" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Khong tai duoc chi tiet don"
        description="Co the ban khong co quyen hoac backend admin detail chua san sang."
        actionLabel="Tai lai"
        onAction={() => {
          refetch().catch(() => undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-4 text-slate-600 hover:bg-orange-50 hover:text-slate-950">
            <Link href={`/${locale}/admin/orders`}>
              <ArrowLeft className="h-4 w-4" />
              Quay lai danh sach don
            </Link>
          </Button>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Don #{order.code}</h1>
          <p className="mt-1 text-sm text-slate-600">Tao luc {formatDateTime(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status === 'processing' ? 'confirmed' : order.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Card className="rounded-3xl border-orange-100 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">San pham trong don</CardTitle>
            <CardDescription>Kiem tra thong tin line item truoc khi cap nhat trang thai.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-950">{item.product_name}</p>
                    <p className="text-sm text-slate-500">{item.variant_name}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-950">x{item.quantity}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Don gia {formatCurrency(item.price)}</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(item.subtotal)}</span>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tam tinh</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phi van chuyen</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                <span>Tong cong</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl border-orange-100 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Khach hang va giao van</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div>
                <p className="font-medium text-slate-950">{order.customer.name}</p>
                <p>{order.customer.email}</p>
                {order.customer.phone != null ? <p>{order.customer.phone}</p> : null}
              </div>
              <Separator />
              <div>
                <p className="font-medium text-slate-950">Dia chi giao hang</p>
                <p>{order.address}</p>
              </div>
              <div>
                <p className="font-medium text-slate-950">Phuong thuc thanh toan</p>
                <p>{PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method.toUpperCase()}</p>
              </div>
              {order.note.length > 0 ? (
                <div>
                  <p className="font-medium text-slate-950">Ghi chu</p>
                  <p>{order.note}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-orange-100 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Cap nhat workflow</CardTitle>
              <CardDescription>Chi cho phep cac buoc chuyen trang thai hop le theo luong MVP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminOrderStatusSelect orderId={id} currentStatus={order.status} />
              <OrderTimeline status={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
