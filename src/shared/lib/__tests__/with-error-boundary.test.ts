import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/lib/errors/api-error';
import { withErrorBoundary } from '@/shared/lib/http';

vi.mock('@/shared/lib/monitoring/sentry', () => ({
  captureError: vi.fn(),
}));

describe('withErrorBoundary', () => {
  it('trả về data khi fn thành công', async () => {
    const result = await withErrorBoundary(() => Promise.resolve([1, 2, 3]), []);
    expect(result).toEqual([1, 2, 3]);
  });

  it('trả về fallback khi fn throw ApiError', async () => {
    const fn = () => Promise.reject(new ApiError({ message: 'Not found', status: 404 }));
    const result = await withErrorBoundary(fn, []);
    expect(result).toEqual([]);
  });

  it('trả về fallback cho mọi loại ApiError (4xx, 5xx)', async () => {
    const cases = [400, 401, 403, 404, 409, 422, 500, 503];
    for (const status of cases) {
      const fn = () => Promise.reject(new ApiError({ message: 'err', status }));
      const result = await withErrorBoundary(fn, null);
      expect(result).toBeNull();
    }
  });

  it('re-throw khi error không phải ApiError', async () => {
    const fn = () => Promise.reject(new TypeError('unexpected'));
    await expect(withErrorBoundary(fn, [])).rejects.toThrow(TypeError);
  });

  it('re-throw khi error là Error thuần', async () => {
    const fn = () => Promise.reject(new Error('something broke'));
    await expect(withErrorBoundary(fn, 0)).rejects.toThrow('something broke');
  });

  it('log error khi catch ApiError', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fn = () => Promise.reject(new ApiError({ message: 'fail', status: 500, code: 'SERVER_ERROR' }));
    await withErrorBoundary(fn, null);
    expect(consoleSpy).toHaveBeenCalledWith('[ApiError]', { status: 500, code: 'SERVER_ERROR', message: 'fail' });
    consoleSpy.mockRestore();
  });

  it('fallback có thể là object', async () => {
    const fn = () => Promise.reject(new ApiError({ message: 'err', status: 404 }));
    const result = await withErrorBoundary(fn, { items: [], total: 0 });
    expect(result).toEqual({ items: [], total: 0 });
  });
});
