import { setRequestLocale } from 'next-intl/server';

import { RegisterForm } from '@/app/[locale]/(auth)/_components/RegisterForm';

interface RegisterPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Tạo tài khoản</h1>
        <p className="mt-2 text-sm text-neutral-500">Tham gia cùng chúng tôi hôm nay!</p>
      </div>
      <RegisterForm />
    </div>
  );
}
