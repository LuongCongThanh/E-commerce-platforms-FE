'use client';

import { use, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useProfile, useUpdateProfile } from '@/app/[locale]/(shop)/_lib/hooks';
import { Button } from '@/shared/components/base/Button';
import { Input } from '@/shared/components/base/Input';
import { Label } from '@/shared/components/base/Label';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  phone: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage({ params }: { readonly params: Promise<{ locale: string }> }): React.JSX.Element {
  use(params);
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile != null) {
      reset({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? '' });
    }
  }, [profile, reset]);

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Thông tin cá nhân</h1>
      <form
        onSubmit={handleSubmit(d => {
          updateProfile.mutate(d);
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lastName">Họ</Label>
            <Input id="lastName" {...register('lastName')} />
            {errors.lastName != null ? <p className="text-destructive mt-1 text-sm">{errors.lastName.message}</p> : null}
          </div>
          <div>
            <Label htmlFor="firstName">Tên</Label>
            <Input id="firstName" {...register('firstName')} />
            {errors.firstName != null ? <p className="text-destructive mt-1 text-sm">{errors.firstName.message}</p> : null}
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" placeholder="0901234567" {...register('phone')} />
        </div>
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </form>
    </main>
  );
}
