'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { loginAction } from '@/app/[locale]/(auth)/_lib/actions';
import type { LoginFormInput } from '@/app/[locale]/(auth)/_lib/schemas';
import { LoginFormSchema } from '@/app/[locale]/(auth)/_lib/schemas';
import { Button } from '@/shared/components/base/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/base/Form';
import { Input } from '@/shared/components/base/Input';
import { ApiError } from '@/shared/lib/errors/api-error';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormInput) => {
    setApiError(null);
    try {
      await loginAction({ email: values.email, password: values.password });
      const returnUrl = searchParams.get('returnUrl');
      router.push(returnUrl !== null && returnUrl.length > 0 ? returnUrl : `/${locale}/home`);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError !== null && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{apiError}</div>}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Mật khẩu</FormLabel>
                <Link href={`/${locale}/forgot-password`} className="text-primary-400 text-xs hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <p className="text-center text-sm text-neutral-500">
          Chưa có tài khoản?{' '}
          <Link href={`/${locale}/register`} className="text-primary-400 font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </Form>
  );
}
