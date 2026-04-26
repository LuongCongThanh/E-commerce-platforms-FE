'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { motion } from 'framer-motion';

import { useCartStore } from '@/shared/stores/cart-store';

export function OrderSummary() {
  const t = useTranslations('checkout');
  const { items, total: subtotal } = useCartStore();

  const shippingFee = 30000; // Hardcoded for demo
  const total = subtotal + shippingFee;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="spatial-depth glass-morphism sticky top-24 rounded-2xl p-6">
      <h2 className="mb-6 text-xl font-bold">{t('cart.summary')}</h2>

      <div className="mb-6 space-y-4">
        {items.map(item => (
          <div key={item.variantId} className="flex gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
              <Image src={item.image !== '' ? item.image : '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" />
              <span className="bg-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="line-clamp-1 text-sm font-medium">{item.name}</h3>
              <p className="text-muted-foreground text-xs">{(item.price * item.quantity).toLocaleString()}₫</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.subtotal')}</span>
          <span>{subtotal.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span>{shippingFee.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
          <span>{t('cart.total')}</span>
          <span className="text-primary">{total.toLocaleString()}₫</span>
        </div>
      </div>
    </motion.div>
  );
}
