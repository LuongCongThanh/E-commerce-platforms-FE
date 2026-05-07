import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { ApiError } from '@/shared/lib/errors/api-error';
import { normalizeError } from '@/shared/lib/http/interceptors';
import { validateResponse } from '@/shared/lib/http/validation';

vi.mock('@/shared/lib/monitoring/sentry', () => ({
  captureError: vi.fn(),
}));

// ---------------------------------------------------------------------------
// ApiError helpers
// ---------------------------------------------------------------------------

describe('ApiError helpers', () => {
  it('isUnauthorized → true for 401', () => {
    const err = new ApiError({ message: 'x', status: 401 });
    expect(err.isUnauthorized).toBe(true);
    expect(err.isForbidden).toBe(false);
  });

  it('isForbidden → true for 403', () => {
    const err = new ApiError({ message: 'x', status: 403 });
    expect(err.isForbidden).toBe(true);
  });

  it('isNotFound → true for 404', () => {
    const err = new ApiError({ message: 'x', status: 404 });
    expect(err.isNotFound).toBe(true);
  });

  it('isConflict → true for 409', () => {
    const err = new ApiError({ message: 'x', status: 409 });
    expect(err.isConflict).toBe(true);
  });

  it('isBadRequest → true for 400', () => {
    const err = new ApiError({ message: 'x', status: 400 });
    expect(err.isBadRequest).toBe(true);
  });

  it('isValidation → true for 422', () => {
    const err = new ApiError({ message: 'x', status: 422 });
    expect(err.isValidation).toBe(true);
  });

  it('isServerError → true for 500+', () => {
    expect(new ApiError({ message: 'x', status: 500 }).isServerError).toBe(true);
    expect(new ApiError({ message: 'x', status: 503 }).isServerError).toBe(true);
    expect(new ApiError({ message: 'x', status: 404 }).isServerError).toBe(false);
  });

  it('helpers không overlap nhau cho cùng status', () => {
    const err404 = new ApiError({ message: 'x', status: 404 });
    expect(err404.isUnauthorized).toBe(false);
    expect(err404.isForbidden).toBe(false);
    expect(err404.isConflict).toBe(false);
    expect(err404.isServerError).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// normalizeError
// ---------------------------------------------------------------------------

describe('normalizeError', () => {
  function makeAxiosError(status: number, data?: object, message = 'Network Error') {
    return {
      response: { status, data },
      message,
      config: { url: '/test' },
    };
  }

  it('trả về ApiError với status từ response', () => {
    const err = normalizeError(makeAxiosError(404, { detail: 'Không tìm thấy' }));
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
    expect(err.message).toBe('Không tìm thấy');
  });

  it('ưu tiên detail hơn message trong response data', () => {
    const err = normalizeError(makeAxiosError(400, { detail: 'detail msg', message: 'msg' }));
    expect(err.message).toBe('detail msg');
  });

  it('dùng message khi không có detail', () => {
    const err = normalizeError(makeAxiosError(400, { message: 'bad request' }));
    expect(err.message).toBe('bad request');
  });

  it('dùng axiosError.message khi không có data message', () => {
    const err = normalizeError(makeAxiosError(503, {}, 'timeout'));
    expect(err.message).toBe('timeout');
  });

  it('dùng fallback message khi message rỗng', () => {
    const err = normalizeError(makeAxiosError(500, { detail: '' }, ''));
    expect(err.message).toBe('Đã có lỗi xảy ra');
  });

  it('status mặc định 500 khi không có response', () => {
    const err = normalizeError({ message: 'network error', config: {} });
    expect(err.status).toBe(500);
  });

  it('forward code và details từ response data', () => {
    const err = normalizeError(makeAxiosError(422, { detail: 'err', code: 'INVALID', details: { field: 'name' } }));
    expect(err.code).toBe('INVALID');
    expect(err.details).toEqual({ field: 'name' });
  });

  it('gọi captureError cho lỗi 5xx', async () => {
    const { captureError } = await import('@/shared/lib/monitoring/sentry');
    normalizeError(makeAxiosError(500, { detail: 'server error' }));
    expect(captureError).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// validateResponse
// ---------------------------------------------------------------------------

describe('validateResponse', () => {
  const schema = z.object({ id: z.number(), name: z.string() });

  it('trả về data khi hợp lệ', () => {
    const result = validateResponse(schema, { id: 1, name: 'test' });
    expect(result).toEqual({ id: 1, name: 'test' });
  });

  it('throw ApiError khi data không hợp lệ', () => {
    expect(() => validateResponse(schema, { id: 'wrong', name: 123 })).toThrow(ApiError);
  });

  it('ApiError có status 500 và code INVALID_RESPONSE_SCHEMA', () => {
    try {
      validateResponse(schema, { id: 'wrong' });
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(500);
      expect((e as ApiError).code).toBe('INVALID_RESPONSE_SCHEMA');
    }
  });

  it('throw khi data là null', () => {
    expect(() => validateResponse(schema, null)).toThrow(ApiError);
  });
});
