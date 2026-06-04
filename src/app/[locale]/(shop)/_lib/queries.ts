import { homeCategoriesData } from '@/app/[locale]/(shop)/_lib/data/home';
import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { HomeCategory } from '@/app/[locale]/(shop)/_lib/types/home';
import type { ProductDisplay } from '@/app/[locale]/(shop)/_lib/types/product';

export function getProductBySlug(slug: string): {
  product: ProductDisplay | null;
  relatedProducts: ProductDisplay[];
} {
  const product = productsData.find(p => p.slug === slug) ?? null;
  const relatedProducts = product === null ? [] : productsData.filter(p => p.categorySlug === product.categorySlug && p.slug !== slug).slice(0, 4);
  return { product, relatedProducts };
}

export function getCategoryBySlug(slug: string): HomeCategory | null {
  return homeCategoriesData.find(c => c.slug === slug) ?? null;
}
