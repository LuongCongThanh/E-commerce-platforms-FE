import { beforeEach, describe, expect, it, vi } from 'vitest';

const { toastMock } = vi.hoisted(() => ({
  toastMock: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: toastMock,
}));

import { notify } from '../notification';

describe('notify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates success notifications to sonner', () => {
    notify.success('Saved', 'Description');
    expect(toastMock.success).toHaveBeenCalledWith('Saved', { description: 'Description' });
  });

  it('delegates dismiss calls to sonner', () => {
    notify.dismiss('toast-id');
    expect(toastMock.dismiss).toHaveBeenCalledWith('toast-id');
  });
});
