import type { AdminDashboardStats, AdminOrder } from '@/app/[locale]/(admin)/_lib/types';
import { normalizeAdminDashboardStats, normalizeAdminOrder, normalizeAdminOrders } from '@/app/[locale]/(admin)/_lib/utils';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http';
import type { OrderStatus } from '@/shared/types/order';

export const adminActions = {
  dashboard: async (): Promise<AdminDashboardStats> => normalizeAdminDashboardStats(await http.get<unknown>(API.ADMIN.DASHBOARD_STATS)),
  orders: async (): Promise<AdminOrder[]> => normalizeAdminOrders(await http.get<unknown>(API.ADMIN.ORDERS)),
  orderDetail: async (id: string): Promise<AdminOrder> => normalizeAdminOrder(await http.get<AdminOrder>(API.ADMIN.ORDER_DETAIL(id))),
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<AdminOrder> =>
    normalizeAdminOrder(await http.patch<AdminOrder>(API.ADMIN.ORDER_STATUS(id), { status })),
};
