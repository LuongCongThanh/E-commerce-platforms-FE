import { Badge } from '@/shared/components/base/Badge';
import { getOrderStatusColor, getOrderStatusLabel } from '@/shared/lib/utils';
import type { OrderStatus } from '@/shared/types/order';

interface OrderStatusBadgeProps {
  readonly status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={getOrderStatusColor(status)}>
      {getOrderStatusLabel(status)}
    </Badge>
  );
}
