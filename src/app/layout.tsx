import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/app/providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#e85d04',
};

export const metadata: Metadata = {
  title: { default: 'E-Commerce Shop', template: '%s | E-Commerce Shop' },
  description: 'Mua sắm trực tuyến nhanh chóng, tiện lợi',
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'E-Commerce Shop',
    description: 'Mua sắm trực tuyến nhanh chóng, tiện lợi',
    locale: 'vi_VN',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'E-Commerce Shop',
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
