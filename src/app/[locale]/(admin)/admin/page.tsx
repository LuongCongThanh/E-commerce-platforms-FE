import { redirect } from 'next/navigation';

export default async function AdminIndexPage({ params }: { readonly params: Promise<{ locale: string }> }): Promise<never> {
  const { locale } = await params;
  redirect(`/${locale}/admin/dashboard`);
}
