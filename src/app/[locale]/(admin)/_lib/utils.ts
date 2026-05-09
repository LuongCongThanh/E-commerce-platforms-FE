import type { AdminCustomer, AdminDashboardStats, AdminOrder } from '@/app/[locale]/(admin)/_lib/types';
import type { Order } from '@/shared/types/order';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? (value as UnknownRecord) : null;
}

function readString(record: UnknownRecord | null, keys: string[], fallback = ''): string {
  if (record === null) return fallback;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
}

function readNumber(record: UnknownRecord | null, keys: string[], fallback = 0): number {
  if (record === null) return fallback;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

function firstNonEmpty(values: Array<string | null | undefined>, fallback: string): string {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return fallback;
}

function buildCustomer(order: Order, record: UnknownRecord | null): AdminCustomer {
  const customerRecord = asRecord(record?.customer);
  const userRecord = asRecord(record?.user);
  const userFullName = [readString(userRecord, ['firstName', 'first_name']), readString(userRecord, ['lastName', 'last_name'])]
    .filter(part => part.length > 0)
    .join(' ');

  const customerName = firstNonEmpty(
    [readString(customerRecord, ['name', 'full_name']), readString(record, ['customer_name', 'customerName']), userFullName],
    'Khách hàng chưa rõ tên'
  );
  const customerEmail = firstNonEmpty(
    [readString(customerRecord, ['email']), readString(record, ['customer_email', 'customerEmail']), readString(userRecord, ['email'])],
    'Chưa có email'
  );
  const rawPhone = firstNonEmpty(
    [readString(customerRecord, ['phone']), readString(record, ['customer_phone', 'customerPhone']), readString(userRecord, ['phone'])],
    ''
  );

  return {
    name: customerName,
    email: customerEmail,
    phone: rawPhone.length > 0 ? rawPhone : null,
  };
}

export function normalizeAdminOrder(order: Order): AdminOrder {
  const record = asRecord(order);
  return {
    ...order,
    customer: buildCustomer(order, record),
  };
}

export function normalizeAdminOrders(payload: unknown): AdminOrder[] {
  const record = asRecord(payload);
  const rawOrders = Array.isArray(payload)
    ? payload
    : Array.isArray(record?.results)
      ? record.results
      : Array.isArray(record?.items)
        ? record.items
        : [];

  return rawOrders.map(order => normalizeAdminOrder(order as Order));
}

export function normalizeAdminDashboardStats(payload: unknown): AdminDashboardStats {
  const record = asRecord(payload);

  return {
    totalOrders: readNumber(record, ['totalOrders', 'total_orders', 'ordersCount', 'order_count']),
    todayRevenue: readNumber(record, ['todayRevenue', 'today_revenue', 'dailyRevenue', 'daily_revenue']),
    pendingOrders: readNumber(record, ['pendingOrders', 'pending_orders', 'pendingCount', 'pending_count']),
    totalProducts: readNumber(record, ['totalProducts', 'total_products', 'productsCount', 'product_count']),
  };
}
