import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/lib/errors/api-error';
import { useFormAction } from '@/shared/hooks/useFormAction';

describe('useFormAction', () => {
  it('gọi action với values khi submit', async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useFormAction(action));

    await act(() => result.current.onSubmit({ email: 'a@b.com' }));

    expect(action).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('gọi onSuccess khi action thành công', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormAction(vi.fn().mockResolvedValue(undefined), { onSuccess }));

    await act(() => result.current.onSubmit({}));

    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('set apiError từ ApiError.message khi action throw ApiError', async () => {
    const action = vi.fn().mockRejectedValue(new ApiError({ message: 'Email đã tồn tại', status: 409 }));
    const { result } = renderHook(() => useFormAction(action));

    await act(() => result.current.onSubmit({}));

    expect(result.current.apiError).toBe('Email đã tồn tại');
  });

  it('set fallbackMessage khi action throw non-ApiError', async () => {
    const action = vi.fn().mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useFormAction(action, { fallbackMessage: 'Đăng nhập thất bại.' }));

    await act(() => result.current.onSubmit({}));

    expect(result.current.apiError).toBe('Đăng nhập thất bại.');
  });

  it('dùng default fallback khi không truyền fallbackMessage', async () => {
    const action = vi.fn().mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useFormAction(action));

    await act(() => result.current.onSubmit({}));

    expect(result.current.apiError).toBe('Đã có lỗi xảy ra. Vui lòng thử lại.');
  });

  it('clear apiError khi submit lại', async () => {
    const action = vi
      .fn()
      .mockRejectedValueOnce(new ApiError({ message: 'lỗi', status: 400 }))
      .mockResolvedValue(undefined);
    const { result } = renderHook(() => useFormAction(action));

    await act(() => result.current.onSubmit({}));
    expect(result.current.apiError).toBe('lỗi');

    await act(() => result.current.onSubmit({}));
    expect(result.current.apiError).toBeNull();
  });

  it('isSubmitting = true trong khi action đang chạy', async () => {
    let resolveAction!: () => void;
    const action = vi.fn().mockReturnValue(
      new Promise<void>(res => {
        resolveAction = res;
      })
    );
    const { result } = renderHook(() => useFormAction(action));

    act(() => {
      void result.current.onSubmit({});
    });
    expect(result.current.isSubmitting).toBe(true);

    await act(() => {
      resolveAction();
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('isSubmitting = false sau khi action fail', async () => {
    const action = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useFormAction(action));

    await act(() => result.current.onSubmit({}));

    expect(result.current.isSubmitting).toBe(false);
  });

  it('không gọi onSuccess khi action fail', async () => {
    const onSuccess = vi.fn();
    const action = vi.fn().mockRejectedValue(new ApiError({ message: 'err', status: 500 }));
    const { result } = renderHook(() => useFormAction(action, { onSuccess }));

    await act(() => result.current.onSubmit({}));

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
