'use client';

import { useMemo } from 'react';

import { bestSellersData, homeCategoriesData, newArrivalsData } from '@/app/[locale]/(shop)/_lib/data/home';

/**
 * Hook to provide data for home page sections
 */
export function useHomeData() {
  return useMemo(
    () => ({
      bestSellers: bestSellersData,
      newArrivals: newArrivalsData,
      flashSale: bestSellersData.slice(0, 4), // Simple flash sale logic for mock
      categories: homeCategoriesData,
    }),
    []
  );
}
