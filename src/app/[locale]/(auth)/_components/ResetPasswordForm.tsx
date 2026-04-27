'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { resetPasswordAction } from '@/app/[locale]/(auth)/_lib/actions';
import type { ResetPasswordFormInput } from '@/app/[locale]/(auth)/_lib/schemas';
import { ResetPasswordFormSchema } from '@/app/[locale]/(auth)/_lib/schemas';
import { Button } from '@/shared/components/base/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/base/Form';
import { Input } from '@/shared/components/base/Input';
import { ApiError } from '@/shared/lib/errors/api-error';

interface ResetPasswordFormProps {
  readonly token: string;
  readonly uid: string;
}

export function ResetPasswordForm({ token, uid }: ResetPasswordFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ResetPasswordFormInput) => {
    setApiError(null);
    try {
      await resetPasswordAction({ token, uid, password: values.password });
      router.push(`/${locale}/login`);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError !== null && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{apiError}</div>}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
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
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isSubmitting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
        </Button>

        <p className="text-center text-sm text-neutral-500">
          <Link href={`/${locale}/login`} className="text-primary-400 font-medium hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  );
}
