import type { Product, ProductList } from '@/shared/types/product';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/client';

export const productActions = {
  list: (filters: object) => http.get<ProductList>(API.PRODUCTS.LIST, filters),
  detail: (slug: string) => http.get<Product>(API.PRODUCTS.DETAIL(slug)),
  categories: () => http.get<Array<{ id: number; name: string; slug: string }>>(API.PRODUCTS.CATEGORIES),
};
