import Link from 'next/link';

import { OrderStatusBadge } from '@/app/[locale]/(shop)/_components/OrderStatusBadge';
import type { Order } from '@/app/[locale]/(shop)/_lib/types';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/methods';

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

async function getOrders(): Promise<Order[]> {
  try {
    return await http.get<Order[]>(API.ORDERS.LIST);
  } catch {
    return [];
  }
}

export default async function OrdersPage({ params }: { readonly params: Promise<{ locale: string }> }): Promise<React.JSX.Element> {
  const { locale } = await params;
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} href={`/${locale}/orders/${String(order.id)}`} className="block rounded-xl border p-4 transition hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Đơn #{order.code}</p>
                  <p className="text-muted-foreground text-sm">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-primary font-semibold">{formatVND(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
