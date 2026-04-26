'use client';

import { useState } from 'react';
import { AppProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { makeQueryClient } from '@/shared/lib/query-client';

const progressBarOptions = { showSpinner: false };

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: 'glass !shadow-spatial-lg !border-glass-border',
            style: {
              backdropFilter: 'blur(16px)',
            },
          }}
        />
        <AppProgressBar color="#e85d04" height="2px" options={progressBarOptions} />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
