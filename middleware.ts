import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Khởi tạo middleware của next-intl để tự động redirect theo locale
// Ví dụ: /products → /vi/products (vì defaultLocale là 'vi')
const intlMiddleware = createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bảo vệ route admin: kiểm tra cookie access_token trước khi cho vào /(vi|en)/admin/*
  // Nếu chưa đăng nhập → redirect về trang login của locale mặc định
  if (/^\/(vi|en)\/admin/.exec(pathname)) {
    const token = request.cookies.get('access_token');
    if (!token) {
      return NextResponse.redirect(new URL('/vi/login', request.url));
    }
  }

  // Chuyển tiếp request cho next-intl xử lý locale routing
  return intlMiddleware(request);
}

export const config = {
  // Áp dụng middleware cho tất cả route, ngoại trừ: API routes, _next assets, và static files (có dấu chấm trong tên)
  matcher: [String.raw`/((?!api|_next|.*\..*).*)`],
};
