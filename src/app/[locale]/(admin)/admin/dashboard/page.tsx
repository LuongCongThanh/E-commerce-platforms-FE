import { AdminDashboardClient } from '@/app/[locale]/(admin)/_components/AdminDashboardClient';

export default async function AdminDashboardPage({ params }: { readonly params: Promise<{ locale: string }> }): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <AdminDashboardClient locale={locale} />;
}
