'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { registerAction } from '@/app/[locale]/(auth)/_lib/actions';
import type { RegisterFormInput } from '@/app/[locale]/(auth)/_lib/schemas';
import { RegisterFormSchema } from '@/app/[locale]/(auth)/_lib/schemas';
import { Button } from '@/shared/components/base/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/base/Form';
import { Input } from '@/shared/components/base/Input';
import { ApiError } from '@/shared/lib/errors/api-error';

export function RegisterForm() {
  const router = useRouter();
  const locale = useLocale();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: RegisterFormInput) => {
    setApiError(null);
    try {
      await registerAction({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      router.push(`/${locale}/home`);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError !== null && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{apiError}</div>}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn" autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Văn A" autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Tối thiểu 8 ký tự" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập lại mật khẩu" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>

        <p className="text-center text-sm text-neutral-500">
          Đã có tài khoản?{' '}
          <Link href={`/${locale}/login`} className="text-primary-400 font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  );
}
