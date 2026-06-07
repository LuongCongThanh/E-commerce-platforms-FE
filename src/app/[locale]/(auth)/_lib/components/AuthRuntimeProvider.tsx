'use client';

import { useEffect } from 'react';

import { clearAuth, getAccessToken, refreshAccessToken } from '@/app/[locale]/(auth)/_lib/store/auth-store';
import { registerHttpRuntimeAdapter } from '@/shared/lib/http/runtime';

export function AuthRuntimeProvider({ children }: { readonly children: React.ReactNode }): React.JSX.Element {
  useEffect(() => {
    return registerHttpRuntimeAdapter({
      getAccessToken,
      refreshAccessToken,
      onRefreshFailure: () => {
        clearAuth();
      },
    });
  }, []);

  return <>{children}</>;
}
