import { NextResponse } from 'next/server';

export function POST(): NextResponse {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  return response;
}
