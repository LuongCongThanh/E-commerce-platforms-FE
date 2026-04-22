import { Skeleton } from '@/shared/components/base/Skeleton';

export default function CheckoutLoading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-8 h-8 w-40" />
      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => `checkout-field-${String(i)}`).map(id => (
            <Skeleton key={id} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </main>
  );
}
