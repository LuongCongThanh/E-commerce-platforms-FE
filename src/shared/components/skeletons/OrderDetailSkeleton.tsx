import { Skeleton } from '@/shared/components/base/Skeleton';

export function OrderDetailSkeleton() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="mb-4 h-48 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </main>
  );
}
