import { useState } from 'react';

import { ApiError } from '@/shared/lib/errors/api-error';

const DEFAULT_FALLBACK = 'Đã có lỗi xảy ra. Vui lòng thử lại.';

export function useFormAction<TValues>(
  action: (values: TValues) => Promise<unknown>,
  options?: {
    onSuccess?: () => void;
    fallbackMessage?: string;
  }
) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: TValues) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await action(values);
      options?.onSuccess?.();
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : (options?.fallbackMessage ?? DEFAULT_FALLBACK));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { apiError, isSubmitting, onSubmit };
}
