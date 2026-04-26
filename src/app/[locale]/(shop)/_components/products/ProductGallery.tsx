'use client';

import { useState } from 'react';
import Image from 'next/image';

import { motion } from 'framer-motion';

import { cn } from '@/shared/lib/utils';

interface ProductGalleryProps {
  readonly images: string[];
  readonly name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-100 dark:bg-neutral-800"
      >
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative h-full w-full">
          <Image src={images[selectedImage]} alt={name} fill priority className="object-cover" />
        </motion.div>

        {/* Floating decoration */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl border border-white/20" />
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                setSelectedImage(index);
              }}
              className={cn(
                'relative size-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                selectedImage === index ? 'border-primary-500 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image src={image} alt={`${name} thumbnail ${(index + 1).toString()}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
