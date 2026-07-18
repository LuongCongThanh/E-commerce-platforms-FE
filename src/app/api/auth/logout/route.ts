import { NextResponse } from 'next/server';

import { USER_ROLE_COOKIE } from '@/shared/constants/auth-cookies';

export function POST(): NextResponse {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete(USER_ROLE_COOKIE);
  return response;
}
