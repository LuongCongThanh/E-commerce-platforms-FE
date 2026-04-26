'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCartStore } from '@/shared/stores/cart-store';

const checkoutSchema = z.object({
  fullName: z.string().min(1, 'required'),
  phoneNumber: z.string().min(10, 'invalidPhone'),
  address: z.string().min(1, 'required'),
  city: z.string().min(1, 'required'),
  district: z.string().min(1, 'required'),
  ward: z.string().min(1, 'required'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'bankTransfer']),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const locale = t('title') === 'Checkout' ? 'en' : 'vi'; // Simple locale detection for redirect

  useEffect(() => {
    if (items.length === 0) {
      router.replace(`/${locale}/cart`);
    }
  }, [items, router, locale]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'cod',
    },
  });

  const onSubmit = async (_data: CheckoutValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    router.push('/checkout/success');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipping Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="spatial-depth glass-morphism rounded-2xl p-6">
        <h2 className="mb-6 text-xl font-bold">{t('shippingAddress')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('fullName')}</label>
            <input
              {...register('fullName')}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.fullName.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('phoneNumber')}</label>
            <input
              {...register('phoneNumber')}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              placeholder="0901234567"
            />
            {errors.phoneNumber !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.phoneNumber.message ?? 'required'}`)}</p>}
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium">{t('address')}</label>
            <input
              {...register('address')}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              placeholder="123 Đường ABC..."
            />
            {errors.address !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.address.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('city')}</label>
            <input {...register('city')} className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('district')}</label>
            <input
              {...register('district')}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Shipping & Payment Methods */}
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="spatial-depth glass-morphism rounded-2xl p-6"
        >
          <h2 className="mb-6 text-xl font-bold">{t('shippingMethod')}</h2>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-3">
                <input type="radio" value="standard" {...register('shippingMethod')} className="accent-primary h-4 w-4" />
                <div>
                  <p className="font-medium">{t('standard')}</p>
                  <p className="text-muted-foreground text-xs">3-5 ngày làm việc</p>
                </div>
              </div>
              <span className="text-sm font-bold">30.000₫</span>
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-3">
                <input type="radio" value="express" {...register('shippingMethod')} className="accent-primary h-4 w-4" />
                <div>
                  <p className="font-medium">{t('express')}</p>
                  <p className="text-muted-foreground text-xs">Trong vòng 24h</p>
                </div>
              </div>
              <span className="text-sm font-bold">60.000₫</span>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="spatial-depth glass-morphism rounded-2xl p-6"
        >
          <h2 className="mb-6 text-xl font-bold">{t('paymentMethod')}</h2>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <input type="radio" value="cod" {...register('paymentMethod')} className="accent-primary h-4 w-4" />
              <p className="font-medium">{t('cod')}</p>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <input type="radio" value="bankTransfer" {...register('paymentMethod')} className="accent-primary h-4 w-4" />
              <p className="font-medium">{t('bankTransfer')}</p>
            </label>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary w-full rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 md:w-auto"
        >
          {isSubmitting ? '...' : t('placeOrder')}
        </button>
        <p className="text-muted-foreground text-center text-xs">{t('placeOrderDesc')}</p>
      </motion.div>
    </form>
  );
}
