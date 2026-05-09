import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const LOCALES = new Set(['vi', 'en']);
const AUTH_PAGES = new Set(['/login', '/register', '/forgot-password']);
const PROTECTED_PREFIXES = ['/checkout', '/orders', '/profile'];
const ADMIN_PREFIX = '/admin';
const ADMIN_ROLES = new Set(['admin', 'staff']);

function getLocalizedPath(pathname: string): { locale: string; path: string } | null {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (typeof locale !== 'string' || !LOCALES.has(locale)) {
    return null;
  }

  const normalizedPath = `/${segments.slice(1).join('/')}`.replace(/\/+$/, '');
  return {
    locale,
    path: normalizedPath.length > 0 ? normalizedPath : '/',
  };
}

function matchesProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function matchesAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

export function proxy(request: NextRequest) {
  const localizedPath = getLocalizedPath(request.nextUrl.pathname);

  if (localizedPath === null) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const isAuthenticated = typeof token === 'string' && token.length > 0;
  const { locale, path } = localizedPath;

  if (!isAuthenticated && (matchesProtectedPath(path) || matchesAdminPath(path))) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('returnUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesAdminPath(path) && typeof role === 'string' && !ADMIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  if (isAuthenticated && AUTH_PAGES.has(path)) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
