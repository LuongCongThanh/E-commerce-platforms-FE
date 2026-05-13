import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

interface DjangoRefreshResponse {
  data: string;
  message?: string;
  status?: number;
}

const DJANGO_URL = process.env.DJANGO_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const SECURE = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (refreshToken === undefined || refreshToken === '') {
    return NextResponse.json({ message: 'Phiên đăng nhập đã hết hạn' }, { status: 401 });
  }

  const djangoRes = await fetch(`${DJANGO_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const json = (await djangoRes.json()) as unknown as DjangoRefreshResponse;

  if (!djangoRes.ok) {
    const response = NextResponse.json(json, { status: djangoRes.status });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  const newAccessToken = json.data;

  const response = NextResponse.json<{ access: string }>({ access: newAccessToken });

  response.cookies.set('access_token', newAccessToken, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
