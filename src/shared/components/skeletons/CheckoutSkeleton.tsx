import { Skeleton } from '@/shared/components/base/Skeleton';

export function CheckoutSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 p-6">
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="col-span-full h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </main>
  );
}
