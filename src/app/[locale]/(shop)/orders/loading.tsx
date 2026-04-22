import { Skeleton } from '@/shared/components/base/Skeleton';

export default function OrdersLoading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => `order-skeleton-${String(i)}`).map(id => (
          <Skeleton key={id} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
