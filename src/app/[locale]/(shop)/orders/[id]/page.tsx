'use client';

import { use } from 'react';

import { OrderStatusBadge } from '@/app/[locale]/(shop)/_components/OrderStatusBadge';
import { useCancelOrder, useOrder } from '@/app/[locale]/(shop)/_lib/hooks';
import { Button } from '@/shared/components/base/Button';
import { Separator } from '@/shared/components/base/Separator';

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function OrderDetailPage({ params }: { readonly params: Promise<{ locale: string; id: string }> }): React.JSX.Element {
  const { id } = use(params);
  const { data: order, isPending } = useOrder(id);
  const cancelOrder = useCancelOrder(id);

  if (isPending) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-center">Đang tải...</div>;
  }

  if (order == null) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-center">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Đơn #{order.code}</h1>
          <p className="text-muted-foreground text-sm">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product_name} x{item.quantity}
            </span>
            <span className="font-medium">{formatVND(item.subtotal)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatVND(order.total)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1 rounded-xl border p-4 text-sm">
        <p>
          <span className="font-medium">Địa chỉ:</span> {order.address}
        </p>
        <p>
          <span className="font-medium">Thanh toán:</span> {order.payment_method.toUpperCase()}
        </p>
        {order.note.length > 0 ? (
          <p>
            <span className="font-medium">Ghi chú:</span> {order.note}
          </p>
        ) : null}
      </div>

      {order.status === 'pending' && (
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => {
            cancelOrder.mutate();
          }}
          disabled={cancelOrder.isPending}
        >
          {cancelOrder.isPending ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
        </Button>
      )}
    </main>
  );
}
