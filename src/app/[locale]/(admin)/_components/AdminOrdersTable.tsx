'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { CalendarDays, Search } from 'lucide-react';

import { useAdminOrders } from '@/app/[locale]/(admin)/_lib/hooks';
import type { AdminOrder, AdminOrderStatus } from '@/app/[locale]/(admin)/_lib/types';
import { Badge } from '@/shared/components/base/Badge';
import { Button } from '@/shared/components/base/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/base/Card';
import { Input } from '@/shared/components/base/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/base/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/base/Table';
import { EmptyState } from '@/shared/components/common/EmptyState';
import { OrderStatusBadge } from '@/shared/components/common/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/shared/lib/utils';

const STATUS_FILTERS: Array<{ value: 'all' | AdminOrderStatus; label: string }> = [
  { value: 'all', label: 'Tat ca trang thai' },
  { value: 'pending', label: 'Cho xac nhan' },
  { value: 'confirmed', label: 'Da xac nhan' },
  { value: 'shipped', label: 'Dang giao' },
  { value: 'delivered', label: 'Da giao' },
  { value: 'cancelled', label: 'Da huy' },
] as const;

function matchesSearch(order: AdminOrder, keyword: string): boolean {
  if (keyword.length === 0) return true;

  const searchable = [order.code, order.customer.name, order.customer.email, order.address].join(' ').toLowerCase();
  return searchable.includes(keyword);
}

function matchesDate(order: AdminOrder, createdDate: string): boolean {
  if (createdDate.length === 0) return true;
  return order.created_at.slice(0, 10) === createdDate;
}

interface AdminOrdersTableProps {
  readonly locale: string;
}

export function AdminOrdersTable({ locale }: AdminOrdersTableProps): React.JSX.Element {
  const { data, isPending, isError, refetch } = useAdminOrders();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'all' | AdminOrderStatus>('all');
  const [createdDate, setCreatedDate] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const orders = [...(data ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return orders.filter(order => {
      const matchesStatus = status === 'all' || order.status === status || (status === 'confirmed' && order.status === 'processing');
      return matchesStatus && matchesSearch(order, normalizedKeyword) && matchesDate(order, createdDate);
    });
  }, [createdDate, data, keyword, status]);

  return (
    <Card className="rounded-3xl border-orange-100 bg-white/95 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-950">Quan ly don hang</CardTitle>
            <CardDescription>Loc va theo doi cac don can xu ly trong giao dien admin MVP.</CardDescription>
          </div>
          <Badge variant="outline" className="border-orange-200 bg-orange-50 px-3 py-1 text-orange-700">
            {(data ?? []).length} don
          </Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={keyword}
              onChange={event => {
                setKeyword(event.target.value);
              }}
              placeholder="Tim theo ma don, ten khach, email..."
              className="border-orange-200 pl-9"
            />
          </div>

          <Select
            value={status}
            onValueChange={value => {
              setStatus(value as 'all' | AdminOrderStatus);
            }}
          >
            <SelectTrigger className="border-orange-200 bg-white">
              <SelectValue placeholder="Trang thai" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="date"
              value={createdDate}
              onChange={event => {
                setCreatedDate(event.target.value);
              }}
              className="border-orange-200 pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <div className="space-y-3">
            {['row-1', 'row-2', 'row-3', 'row-4', 'row-5'].map(key => (
              <div key={key} className="h-16 animate-pulse rounded-2xl bg-orange-100/60" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Chua tai duoc danh sach don"
            description="Thu tai lai hoac kiem tra ket noi backend admin orders."
            actionLabel="Tai lai"
            onAction={() => {
              refetch().catch(() => undefined);
            }}
          />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="Khong co don phu hop" description="Thu doi bo loc hoac tim bang ma don khac." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ma don</TableHead>
                <TableHead>Khach hang</TableHead>
                <TableHead>Ngay tao</TableHead>
                <TableHead>Trang thai</TableHead>
                <TableHead className="text-right">Tong tien</TableHead>
                <TableHead className="text-right">Thao tac</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-slate-950">{order.code}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status === 'processing' ? 'confirmed' : order.status} />
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-950">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" className="border-orange-200 hover:bg-orange-50">
                      <Link href={`/${locale}/admin/orders/${String(order.id)}`}>Xem chi tiet</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
