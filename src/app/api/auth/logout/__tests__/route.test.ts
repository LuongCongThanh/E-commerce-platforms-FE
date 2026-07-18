// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { POST } from '@/app/api/auth/logout/route';

describe('POST /api/auth/logout', () => {
  it('clears access_token, refresh_token, and is_admin cookies', () => {
    const response = POST();

    expect(response.cookies.get('access_token')?.value).toBe('');
    expect(response.cookies.get('refresh_token')?.value).toBe('');
    expect(response.cookies.get('is_admin')?.value).toBe('');
  });
});
