export const adminKeys = {
  root: ['admin'] as const,
  dashboard: () => [...adminKeys.root, 'dashboard'] as const,
  orders: () => [...adminKeys.root, 'orders'] as const,
  orderDetail: (id: string) => [...adminKeys.orders(), id] as const,
};
