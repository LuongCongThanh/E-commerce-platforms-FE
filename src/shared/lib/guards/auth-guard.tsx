'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useIsLoggedIn } from '@/shared/hooks/useAuth';

export function AuthGuard({ children }: { readonly children: React.ReactNode }): React.JSX.Element | null {
  const router = useRouter();
  const isAuthenticated = useIsLoggedIn();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/vi/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
