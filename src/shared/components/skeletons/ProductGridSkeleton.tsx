import { ProductCardSkeleton } from '@/shared/components/skeletons/ProductCardSkeleton';

interface ProductGridSkeletonProps {
  readonly count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps): React.JSX.Element {
  const skeletonIds = Array.from({ length: count }, (_, index: number) => `product-grid-skeleton-${String(index + 1)}`);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {skeletonIds.map((skeletonId: string) => (
        <ProductCardSkeleton key={skeletonId} />
      ))}
    </div>
  );
}
