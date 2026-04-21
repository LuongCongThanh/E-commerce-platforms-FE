import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

import { APP_CONFIG, ORDER_STATUS_COLOR_MAP, ORDER_STATUS_LABEL } from '@/shared/constants/app-config';
import { type ProductFilter, ProductFilterSchema } from '@/shared/types/filter';
import type { OrderStatus } from '@/shared/types/order';

function isQueryValue(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm dd/MM/yyyy', { locale: vi });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null || item === '') continue;
        if (isQueryValue(item)) {
          searchParams.append(key, String(item));
        }
      }
      continue;
    }

    if (isQueryValue(value)) {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
}

export function parseSearchParams(searchParams: URLSearchParams): ProductFilter {
  const rawEntries = Object.fromEntries(searchParams.entries());
  return ProductFilterSchema.parse(rawEntries);
}

export function calculateDiscountPercent(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABEL[status] ?? status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_COLOR_MAP[status] ?? 'bg-gray-100 text-gray-600';
}

export function validateVietnamesePhone(phone: string): boolean {
  const normalizedPhone = phone.trim();
  const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
  return vietnamPhoneRegex.test(normalizedPhone);
}

export function getDefaultPageSize(): number {
  return APP_CONFIG.ITEMS_PER_PAGE;
}
