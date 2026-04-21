import { type Metadata } from 'next';

interface BuildMetadataOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

export function buildMetadata({ title, description, image, url, noIndex }: BuildMetadataOptions): Metadata {
  const siteName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Shop';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = url ? `${siteUrl}${url}` : undefined;

  return {
    title: fullTitle,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: fullTitle,
      description,
      ...(image && { images: [{ url: image }] }),
      ...(canonicalUrl && { url: canonicalUrl }),
    },
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
  };
}
