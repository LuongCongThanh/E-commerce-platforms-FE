import { AdminOrdersTable } from '@/app/[locale]/(admin)/_components/AdminOrdersTable';

export default async function AdminOrdersPage({ params }: { readonly params: Promise<{ locale: string }> }): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <AdminOrdersTable locale={locale} />;
}
