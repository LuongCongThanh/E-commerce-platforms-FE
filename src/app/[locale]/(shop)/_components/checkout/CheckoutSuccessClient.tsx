'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CheckCircle } from 'lucide-react';

import { useOrder } from '@/app/[locale]/(shop)/_lib/hooks';
import { Button } from '@/shared/components/base/Button';
import { formatCurrency } from '@/shared/lib/utils';

interface CheckoutSuccessClientProps {
  readonly locale: string;
  readonly orderId: string | null;
}

export function CheckoutSuccessClient({ locale, orderId }: CheckoutSuccessClientProps) {
  const router = useRouter();
  const resolvedOrderId = orderId ?? '';
  const { data: order, isPending } = useOrder(resolvedOrderId);

  useEffect(() => {
    if (orderId == null || orderId.length === 0) {
      router.replace(`/${locale}/home`);
    }
  }, [locale, orderId, router]);

  if (orderId == null || orderId.length === 0) {
    return null;
  }

  if (isPending) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">Đang tải thông tin đơn hàng...</div>;
  }

  if (order == null) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Không thể tải thông tin đơn hàng</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Đơn hàng có thể đã được tạo nhưng dữ liệu chưa sẵn sàng. Bạn vẫn có thể kiểm tra trong danh sách đơn hàng của mình.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={`/${locale}/orders`}>Xem đơn hàng</Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/products`}>Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center gap-6 px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="h-20 w-20 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground mt-1">Mã đơn hàng: #{order.code}</p>
        </div>
        <p className="text-muted-foreground max-w-md">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
      </div>

      <div className="space-y-4 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Tổng thanh toán</span>
          <span className="text-primary text-lg font-semibold">{formatCurrency(order.total)}</span>
        </div>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-muted-foreground">
                  {item.variant_name} x{item.quantity}
                </p>
              </div>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 border-t pt-4 text-sm">
          <p>
            <span className="font-medium">Địa chỉ giao hàng:</span> {order.address}
          </p>
          {order.note.length > 0 ? (
            <p>
              <span className="font-medium">Ghi chú:</span> {order.note}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/${locale}/orders/${String(order.id)}`}>Xem chi tiết đơn</Link>
        </Button>
        <Button asChild>
          <Link href={`/${locale}/products`}>Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
}
