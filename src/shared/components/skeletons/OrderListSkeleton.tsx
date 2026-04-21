import { Skeleton } from '@/shared/components/base/Skeleton';

interface OrderListSkeletonProps {
  readonly count?: number;
}

export function OrderListSkeleton({ count = 4 }: OrderListSkeletonProps): React.JSX.Element {
  const skeletonIds = Array.from({ length: count }, (_, index) => `order-list-skeleton-${String(index + 1)}`);

  return (
    <div className="space-y-4">
      {skeletonIds.map(skeletonId => (
        <div key={skeletonId} className="border-border bg-background rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="ml-auto h-5 w-24" />
              <Skeleton className="ml-auto h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
