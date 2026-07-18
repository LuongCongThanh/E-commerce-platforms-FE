'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useCreateOrder } from '@/app/[locale]/(shop)/_lib/hooks/checkout/useCreateOrder';
import { useCart } from '@/app/[locale]/(shop)/_lib/hooks/useCart';
import type { CheckoutInput } from '@/app/[locale]/(shop)/_lib/schemas/checkout';
import { checkoutSchema } from '@/app/[locale]/(shop)/_lib/schemas/checkout';

type CheckoutValues = CheckoutInput;

export function CheckoutClient() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items } = useCart();
  const createOrder = useCreateOrder(locale);

  useEffect(() => {
    if (items.length === 0) {
      router.replace(`/${locale}/cart`);
    }
  }, [items, router, locale]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'cod',
    },
  });

  const onSubmit = (data: CheckoutValues) => {
    createOrder.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipping Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-b pb-8">
        <h2 className="mb-4 text-lg font-semibold">{t('shippingAddress')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('fullName')}</label>
            <input
              {...register('fullName')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName !== undefined && <p className="text-error-500 text-xs">{t(`errors.${errors.fullName.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('phoneNumber')}</label>
            <input
              {...register('phoneNumber')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
              placeholder="0901234567"
            />
            {errors.phoneNumber !== undefined && <p className="text-error-500 text-xs">{t(`errors.${errors.phoneNumber.message ?? 'required'}`)}</p>}
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium">{t('address')}</label>
            <input
              {...register('address')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
              placeholder="123 Đường ABC..."
            />
            {errors.address !== undefined && <p className="text-error-500 text-xs">{t(`errors.${errors.address.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('city')}</label>
            <input
              {...register('city')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('district')}</label>
            <input
              {...register('district')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('ward')}</label>
            <input
              {...register('ward')}
              className="bg-background focus-visible:ring-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Shipping & Payment Methods */}
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border-b pb-8">
          <h2 className="mb-4 text-lg font-semibold">{t('shippingMethod')}</h2>
          <div className="space-y-4">
            <label className="has-checked:border-foreground has-checked:bg-muted hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors">
              <div className="flex items-center gap-3">
                <input type="radio" value="standard" {...register('shippingMethod')} className="accent-primary h-4 w-4" />
                <div>
                  <p className="font-medium">{t('standard')}</p>
                  <p className="text-muted-foreground text-xs">3-5 ngày làm việc</p>
                </div>
              </div>
              <span className="text-sm font-bold">30.000₫</span>
            </label>
            <label className="has-checked:border-foreground has-checked:bg-muted hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors">
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border-b pb-8">
          <h2 className="mb-4 text-lg font-semibold">{t('paymentMethod')}</h2>
          <div className="space-y-4">
            <label className="has-checked:border-foreground has-checked:bg-muted hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors">
              <input type="radio" value="cod" {...register('paymentMethod')} className="accent-primary h-4 w-4" />
              <p className="font-medium">{t('cod')}</p>
            </label>
            <label className="has-checked:border-foreground has-checked:bg-muted hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors">
              <input type="radio" value="bankTransfer" {...register('paymentMethod')} className="accent-primary h-4 w-4" />
              <p className="font-medium">{t('bankTransfer')}</p>
            </label>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={createOrder.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full rounded-lg text-base font-semibold transition-colors disabled:opacity-50"
        >
          {createOrder.isPending ? '...' : t('placeOrder')}
        </button>
        <p className="text-muted-foreground text-center text-xs">{t('placeOrderDesc')}</p>
      </motion.div>
    </form>
  );
}
