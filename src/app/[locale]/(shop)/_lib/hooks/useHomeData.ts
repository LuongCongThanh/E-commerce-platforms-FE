'use client';

import { useMemo } from 'react';

import { getHomeData } from '@/app/[locale]/(shop)/_lib/queries';

/**
 * Hook to provide data for home page sections
 */
export function useHomeData() {
  return useMemo(() => getHomeData(), []);
}
