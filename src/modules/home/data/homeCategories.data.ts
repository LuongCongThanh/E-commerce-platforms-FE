import type { HomeCategory } from '@/modules/home/types/homeCategory';

export const homeCategoriesData: HomeCategory[] = [
  { slug: 'ao', name: 'Áo', image: '/images/categories/ao.jpg', productCount: 120 },
  { slug: 'quan', name: 'Quần', image: '/images/categories/quan.jpg', productCount: 85 },
  { slug: 'giay', name: 'Giày', image: '/images/categories/giay.jpg', productCount: 64 },
  { slug: 'tui', name: 'Túi xách', image: '/images/categories/tui.jpg', productCount: 48 },
  { slug: 'phu-kien', name: 'Phụ kiện', image: '/images/categories/phu-kien.jpg', productCount: 200 },
  { slug: 'sale', name: 'Sale', image: '/images/categories/sale.jpg', productCount: 310 },
];
