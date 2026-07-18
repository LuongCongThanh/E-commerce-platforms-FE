// @vitest-environment node
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/auth/login/route';

function mockDjangoResponse(role: 'customer' | 'admin' | 'staff') {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      data: {
        user: { id: 1, email: 'user@test.com', firstName: 'A', lastName: 'B', avatar: null, role, isActive: true, createdAt: '2024-01-01' },
        access: 'access_tok',
        refresh: 'refresh_tok',
      },
    }),
  };
}

function makeLoginRequest() {
  return new NextRequest('http://localhost:3000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'user@test.com', password: 'secret' }),
  });
}

describe('POST /api/auth/login', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets the is_admin cookie to false for a customer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockDjangoResponse('customer')));

    const response = await POST(makeLoginRequest());

    expect(response.cookies.get('is_admin')?.value).toBe('false');
    expect(response.cookies.get('access_token')?.value).toBe('access_tok');
  });

  it('sets the is_admin cookie to true for an admin', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockDjangoResponse('admin')));

    const response = await POST(makeLoginRequest());

    expect(response.cookies.get('is_admin')?.value).toBe('true');
  });

  it('sets the is_admin cookie to true for staff', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockDjangoResponse('staff')));

    const response = await POST(makeLoginRequest());

    expect(response.cookies.get('is_admin')?.value).toBe('true');
  });
});
