import { orderActions } from '@/app/[locale]/(shop)/_lib/api/order';
import { OrdersClient } from '@/app/[locale]/(shop)/_lib/components/orders/OrdersClient';
import type { Order } from '@/shared/types/order';

async function getOrders(): Promise<Order[]> {
  try {
    return await orderActions.list();
  } catch {
    return [];
  }
}

export default async function OrdersPage(): Promise<React.JSX.Element> {
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Đơn hàng của tôi</h1>
      <OrdersClient orders={orders} />
    </main>
  );
}
