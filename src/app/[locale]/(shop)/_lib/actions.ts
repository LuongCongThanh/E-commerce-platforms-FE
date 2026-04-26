import type { CheckoutInput } from '@/app/[locale]/(shop)/_lib/schemas';
import type { Order, Product, ProductList, User } from '@/app/[locale]/(shop)/_lib/types';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/methods';

export const productActions = {
  list: (filters: object) => http.get<ProductList>(API.PRODUCTS.LIST, filters),
  detail: (slug: string) => http.get<Product>(API.PRODUCTS.DETAIL(slug)),
  categories: () => http.get<Array<{ id: number; name: string; slug: string }>>(API.PRODUCTS.CATEGORIES),
};

export const orderActions = {
  list: () => http.get<Order[]>(API.ORDERS.LIST),
  detail: (id: string) => http.get<Order>(API.ORDERS.DETAIL(id)),
  cancel: (id: string) => http.post<Order>(API.ORDERS.CANCEL(id)),
  create: (data: CheckoutInput & { items: Array<{ variantId: string; quantity: number }> }) => http.post<Order>(API.ORDERS.LIST, data),
};

export const profileActions = {
  get: () => http.get<User>(API.PROFILE.ME),
  update: (data: Partial<User>) => http.patch<User>(API.PROFILE.UPDATE, data),
};
