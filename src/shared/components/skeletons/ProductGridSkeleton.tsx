import { ProductCardSkeleton } from '@/shared/components/skeletons/ProductCardSkeleton';

interface ProductGridSkeletonProps {
  readonly count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  const skeletonIds = Array.from({ length: count }, (_, index) => `product-grid-skeleton-${index + 1}`);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {skeletonIds.map(skeletonId => (
        <ProductCardSkeleton key={skeletonId} />
      ))}
    </div>
  );
}
