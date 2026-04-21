import { Skeleton } from '@/shared/components/base/Skeleton';

export default function HomeLoading(): React.JSX.Element {
  const categorySkeletonIds = Array.from({ length: 6 }, (_, index) => `category-skeleton-${String(index + 1)}`);
  const productSkeletonIds = Array.from({ length: 8 }, (_, index) => `product-skeleton-${String(index + 1)}`);

  return (
    <>
      {/* Hero skeleton */}
      <Skeleton className="h-64 w-full rounded-none lg:h-80" />

      {/* Category grid skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categorySkeletonIds.map(skeletonId => (
            <Skeleton key={skeletonId} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>

      {/* Flash sale skeleton */}
      <Skeleton className="h-24 w-full rounded-none" />

      {/* Products skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productSkeletonIds.map(skeletonId => (
            <div key={skeletonId} className="border-border space-y-3 rounded-xl border p-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
