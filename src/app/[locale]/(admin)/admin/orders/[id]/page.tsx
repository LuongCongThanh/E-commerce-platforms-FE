import { AdminOrderDetailClient } from '@/app/[locale]/(admin)/_components/AdminOrderDetailClient';

export default function AdminOrderDetailPage({ params }: { readonly params: Promise<{ locale: string; id: string }> }): React.JSX.Element {
  return <AdminOrderDetailClient params={params} />;
}
