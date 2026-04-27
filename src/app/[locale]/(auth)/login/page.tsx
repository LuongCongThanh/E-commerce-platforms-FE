import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { LoginForm } from '@/app/[locale]/(auth)/_components/LoginForm';

interface LoginPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>
        <p className="mt-2 text-sm text-neutral-500">Chào mừng trở lại!</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
