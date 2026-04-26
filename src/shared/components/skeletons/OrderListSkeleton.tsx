import { Skeleton } from '@/shared/components/base/Skeleton';

export function OrderListSkeleton() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`order-skeleton-${String(i)}`} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
