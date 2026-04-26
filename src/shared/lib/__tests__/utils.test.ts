import { describe, expect, it } from 'vitest';

import {
  buildQueryString,
  calculateDiscountPercent,
  getDefaultPageSize,
  getOrderStatusColor,
  getOrderStatusLabel,
  parseSearchParams,
  truncateText,
  validateVietnamesePhone,
} from '@/shared/lib/utils';

describe('buildQueryString', () => {
  it('omits empty values', () => {
    expect(buildQueryString({ search: 'ao', category: '', page: 1, empty: undefined })).toBe('search=ao&page=1');
  });

  it('keeps boolean values when provided', () => {
    expect(buildQueryString({ inStock: false, page: 2 })).toBe('inStock=false&page=2');
  });
});

describe('parseSearchParams', () => {
  it('parses supported filter params', () => {
    const params = new URLSearchParams('search=ao&page=2&inStock=true&ordering=price');

    expect(parseSearchParams(params)).toEqual({
      search: 'ao',
      page: 2,
      pageSize: 20,
      inStock: true,
      ordering: 'price',
    });
  });

  it('treats "false" as false', () => {
    const params = new URLSearchParams('inStock=false');

    expect(parseSearchParams(params).inStock).toBe(false);
  });
});

describe('calculateDiscountPercent', () => {
  it('returns rounded discount percent', () => {
    expect(calculateDiscountPercent(200000, 150000)).toBe(25);
  });

  it('returns zero when discounted price is not lower', () => {
    expect(calculateDiscountPercent(100000, 100000)).toBe(0);
  });
});

describe('truncateText', () => {
  it('returns original text when shorter than maxLength', () => {
    expect(truncateText('ao thun', 20)).toBe('ao thun');
  });

  it('truncates long text and appends ellipsis', () => {
    expect(truncateText('ao thun tay dai', 10)).toBe('ao thun...');
  });
});

describe('order status helpers', () => {
  it('returns translated status label', () => {
    expect(getOrderStatusLabel('pending')).toBe('Chờ xác nhận');
  });

  it('returns fallback color for unknown status', () => {
    expect(getOrderStatusColor('pending')).toBe('bg-yellow-100 text-yellow-700');
    expect(getOrderStatusColor('unknown' as never)).toBe('bg-gray-100 text-gray-600');
  });
});

describe('validateVietnamesePhone', () => {
  it('accepts valid Vietnamese numbers', () => {
    expect(validateVietnamesePhone('0912345678')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(validateVietnamesePhone('12345')).toBe(false);
  });
});

describe('getDefaultPageSize', () => {
  it('returns the configured page size', () => {
    expect(getDefaultPageSize()).toBe(20);
  });
});
