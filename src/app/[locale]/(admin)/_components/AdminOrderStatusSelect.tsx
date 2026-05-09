'use client';

import { useMemo } from 'react';

import { LoaderCircle } from 'lucide-react';

import { useUpdateAdminOrderStatus } from '@/app/[locale]/(admin)/_lib/hooks';
import type { AdminOrderStatus } from '@/app/[locale]/(admin)/_lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/base/Select';

const STATUS_OPTIONS: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: 'pending', label: 'Cho xac nhan' },
  { value: 'confirmed', label: 'Da xac nhan' },
  { value: 'shipped', label: 'Dang giao' },
  { value: 'delivered', label: 'Da giao' },
  { value: 'cancelled', label: 'Da huy' },
];

function getAllowedStatuses(status: AdminOrderStatus): AdminOrderStatus[] {
  switch (status) {
    case 'pending':
      return ['pending', 'confirmed', 'cancelled'];
    case 'confirmed':
    case 'processing':
      return ['confirmed', 'shipped', 'cancelled'];
    case 'shipped':
      return ['shipped', 'delivered'];
    case 'delivered':
      return ['delivered'];
    case 'cancelled':
    default:
      return ['cancelled'];
  }
}

interface AdminOrderStatusSelectProps {
  readonly orderId: string;
  readonly currentStatus: AdminOrderStatus;
}

export function AdminOrderStatusSelect({ orderId, currentStatus }: AdminOrderStatusSelectProps): React.JSX.Element {
  const mutation = useUpdateAdminOrderStatus(orderId);
  const allowedStatuses = useMemo(() => new Set(getAllowedStatuses(currentStatus)), [currentStatus]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span>Cap nhat trang thai</span>
        {mutation.isPending ? <LoaderCircle className="h-4 w-4 animate-spin text-orange-500" /> : null}
      </div>

      <Select
        value={currentStatus === 'processing' ? 'confirmed' : currentStatus}
        onValueChange={value => {
          if (value === currentStatus || mutation.isPending) return;
          mutation.mutate(value as AdminOrderStatus);
        }}
        disabled={mutation.isPending || currentStatus === 'delivered' || currentStatus === 'cancelled'}
      >
        <SelectTrigger className="border-orange-200 bg-white">
          <SelectValue placeholder="Chon trang thai" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.filter(option => allowedStatuses.has(option.value)).map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
