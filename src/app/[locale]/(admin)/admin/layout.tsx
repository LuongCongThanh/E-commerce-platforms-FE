import { AdminShell } from '@/app/[locale]/(admin)/_components/AdminShell';

export default async function AdminLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
