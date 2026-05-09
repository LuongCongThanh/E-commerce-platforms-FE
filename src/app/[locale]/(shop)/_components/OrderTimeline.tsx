import { cn } from '@/shared/lib/utils';

type TimelineStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STEPS = [
  { key: 'pending', label: 'Đặt hàng' },
  { key: 'confirmed', label: 'Xác nhận' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
] as const;

function getProgressIndex(status: TimelineStatus): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'confirmed':
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    case 'cancelled':
    default:
      return -1;
  }
}

export function OrderTimeline({ status }: { readonly status: TimelineStatus }) {
  const progressIndex = getProgressIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Đơn hàng đã bị huỷ trước khi hoàn tất quy trình giao vận.
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4">
      <h2 className="mb-4 text-sm font-semibold">Tiến trình đơn hàng</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {STEPS.map((step, index) => {
          const isCompleted = index <= progressIndex;
          const isCurrent = index === progressIndex;

          return (
            <div key={step.key} className="flex items-center gap-3 md:flex-col md:items-start">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold',
                  isCompleted ? 'border-primary bg-primary text-white' : 'border-neutral-300 bg-white text-neutral-500'
                )}
              >
                {index + 1}
              </div>
              <div>
                <p className={cn('text-sm font-medium', isCompleted ? 'text-foreground' : 'text-neutral-500')}>{step.label}</p>
                <p className="text-xs text-neutral-500">{isCurrent ? 'Trạng thái hiện tại' : isCompleted ? 'Đã hoàn tất' : 'Chưa tới bước này'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
