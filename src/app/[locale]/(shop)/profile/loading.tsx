import { Skeleton } from '@/shared/components/base/Skeleton';

export default function ProfileLoading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    </main>
  );
}
