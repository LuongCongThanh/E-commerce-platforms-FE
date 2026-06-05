import type { User } from '@/shared/types/user';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/client';

export const profileActions = {
  get: () => http.get<User>(API.PROFILE.ME),
  update: (data: Partial<User>) => http.patch<User>(API.PROFILE.UPDATE, data),
};
