import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { USER_ROLE_COOKIE } from '@/shared/constants/auth-cookies';
import type { User } from '@/shared/types/user';

interface DjangoAuthData {
  user: User;
  access: string;
  refresh: string;
}

interface DjangoResponse {
  data: DjangoAuthData;
  message?: string;
  status?: number;
}

const DJANGO_URL = process.env.DJANGO_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const SECURE = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown as Record<string, unknown>;

  const djangoRes = await fetch(`${DJANGO_URL}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await djangoRes.json()) as unknown as DjangoResponse;

  if (!djangoRes.ok) {
    return NextResponse.json(json, { status: djangoRes.status });
  }

  const { user, access, refresh } = json.data;

  const response = NextResponse.json<{ user: User; access: string }>({ user, access });

  response.cookies.set('access_token', access, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set('refresh_token', refresh, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  // Optimistic UX hint cho middleware guard /admin — xem ghi chú ở login/route.ts.
  response.cookies.set(USER_ROLE_COOKIE, user.role === 'admin' || user.role === 'staff' ? 'true' : 'false', {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
