'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/shared/stores/auth-store';

export function AuthGuard({ children }: { readonly children: React.ReactNode }): React.JSX.Element | null {
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => typeof s.accessToken === 'string' && s.accessToken.length > 0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/vi/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
