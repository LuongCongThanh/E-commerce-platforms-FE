import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
});

const PROTECTED_PATTERNS = [/^\/(vi|en)\/admin/, /^\/(vi|en)\/checkout/, /^\/(vi|en)\/orders/, /^\/(vi|en)\/profile/];

const AUTH_ONLY_PATTERNS = [/^\/(vi|en)\/login$/, /^\/(vi|en)\/register$/];

export function middleware(request: NextRequest): ReturnType<typeof intlMiddleware> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token');
  const isLoggedIn = token != null && token.value.length > 0;

  const locale = pathname.startsWith('/en/') ? 'en' : 'vi';

  if (PROTECTED_PATTERNS.some(p => p.test(pathname))) {
    if (!isLoggedIn) {
      const returnUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/${locale}/login?returnUrl=${returnUrl}`, request.url));
    }
  }

  if (AUTH_ONLY_PATTERNS.some(p => p.test(pathname))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [String.raw`/((?!api|_next|.*\..*).*)`],
};
