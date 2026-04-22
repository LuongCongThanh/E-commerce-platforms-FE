import { Skeleton } from '@/shared/components/base/Skeleton';

export default function CheckoutSuccessLoading(): React.JSX.Element {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
