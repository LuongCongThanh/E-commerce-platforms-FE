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
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('categories.title')}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {PLACEHOLDER_CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="border-border hover:border-primary-300 hover:bg-primary-50 flex flex-col items-center gap-2 rounded-xl border bg-neutral-50 p-4 transition-colors"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-xs font-medium text-neutral-700">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
