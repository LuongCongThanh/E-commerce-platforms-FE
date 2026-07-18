import Link from 'next/link';

import { useTranslations } from 'next-intl';

const PLACEHOLDER_CATEGORIES = [
  { slug: 'ao', label: 'Áo', emoji: '👕' },
  { slug: 'quan', label: 'Quần', emoji: '👖' },
  { slug: 'giay', label: 'Giày', emoji: '👟' },
  { slug: 'tui', label: 'Túi xách', emoji: '👜' },
  { slug: 'phu-kien', label: 'Phụ kiện', emoji: '⌚' },
  { slug: 'sale', label: 'Sale', emoji: '🔥' },
];

export function CategoryGrid() {
  const t = useTranslations('home');

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-foreground mb-6 text-2xl font-semibold tracking-tight md:text-3xl">{t('categories.title')}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {PLACEHOLDER_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="bg-card flex flex-col items-center gap-2 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-foreground text-sm font-medium">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
