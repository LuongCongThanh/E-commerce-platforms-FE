import type { Order, OrderStatus } from '@/shared/types/order';

export type AdminOrderStatus = Extract<OrderStatus, 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>;

export interface AdminCustomer {
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminOrder extends Order {
  customer: AdminCustomer;
}

export interface AdminDashboardStats {
  totalOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}
