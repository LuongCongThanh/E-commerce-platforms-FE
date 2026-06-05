import type { CheckoutInput } from '@/app/[locale]/(shop)/_lib/schemas/checkout';
import type { Order } from '@/shared/types/order';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/client';

export const orderActions = {
  list: () => http.get<Order[]>(API.ORDERS.LIST),
  detail: (id: string) => http.get<Order>(API.ORDERS.DETAIL(id)),
  cancel: (id: string) => http.post<Order>(API.ORDERS.CANCEL(id)),
  create: (data: CheckoutInput & { items: Array<{ variantId: string; quantity: number }> }) => http.post<Order>(API.ORDERS.LIST, data),
};
