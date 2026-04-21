interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg';
}

export function buildImageUrl(publicId: string, options: CloudinaryOptions = {}): string {
  if (!publicId) return '/images/placeholder.jpg';

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}
