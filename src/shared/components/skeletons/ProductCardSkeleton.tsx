import { Skeleton } from '@/shared/components/base/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="border-border bg-background rounded-[var(--radius-card)] border p-3">
      <Skeleton className="mb-3 aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-5 w-1/2" />
    </div>
  );
}
