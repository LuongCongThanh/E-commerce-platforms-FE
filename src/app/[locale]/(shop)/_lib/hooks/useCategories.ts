'use client';

import { useMemo } from 'react';

import { homeCategoriesData } from '@/app/[locale]/(shop)/_lib/data/home';

/**
 * Hook to provide all categories
 */
export function useCategories() {
  return useMemo(() => homeCategoriesData, []);
}
