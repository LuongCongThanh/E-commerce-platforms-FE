import { setRequestLocale } from 'next-intl/server';

import { ForgotPasswordForm } from '@/app/[locale]/(auth)/_components/ForgotPasswordForm';

interface ForgotPasswordPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-neutral-500">Đặt lại mật khẩu của bạn</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
