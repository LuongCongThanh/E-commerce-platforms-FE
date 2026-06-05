'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileActions } from '@/app/[locale]/(shop)/_lib/actions/profile';
import type { User } from '@/shared/types/user';

const profileKey = ['profile'] as const;

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => profileActions.update(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: profileKey });
      toast.success('Cập nhật thông tin thành công');
    },
  });
};
