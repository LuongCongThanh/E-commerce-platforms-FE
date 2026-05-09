'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateOrder } from '@/app/[locale]/(shop)/_lib/hooks';
import { ApiError } from '@/shared/lib/errors/api-error';
import { useCartStore } from '@/shared/stores/cart-store';

const checkoutSchema = z.object({
  fullName: z.string().min(1, 'required'),
  phoneNumber: z.string().min(10, 'invalidPhone'),
  address: z.string().min(1, 'required'),
  city: z.string().min(1, 'required'),
  district: z.string().min(1, 'required'),
  ward: z.string().min(1, 'required'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.literal('cod'),
  note: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const createOrder = useCreateOrder(locale);

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
      note: '',
    },
  });

  const onSubmit = async (data: CheckoutValues) => {
    try {
      await createOrder.mutateAsync({
        fullName: data.fullName.trim(),
        phone: data.phoneNumber.trim(),
        address: [data.address.trim(), data.ward.trim(), data.district.trim(), data.city.trim()].join(', '),
        city: data.city.trim(),
        paymentMethod: data.paymentMethod,
        note:
          data.note !== undefined && data.note.trim().length > 0
            ? `Shipping: ${data.shippingMethod}\n${data.note.trim()}`
            : `Shipping: ${data.shippingMethod}`,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isUnauthorized) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.');
          router.push(`/${locale}/login?returnUrl=/${locale}/checkout`);
          return;
        }

        if (error.isConflict || error.isBadRequest || error.isValidation) {
          toast.error(error.message);
          return;
        }

        const failedUrl = new URL(`/${locale}/checkout/failed`, window.location.origin);
        failedUrl.searchParams.set('reason', error.isServerError ? 'server' : 'unknown');
        failedUrl.searchParams.set('message', error.message);
        router.push(failedUrl.pathname + failedUrl.search);
        return;
      }

      router.push(`/${locale}/checkout/failed?reason=unknown`);
    }
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
            {errors.city !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.city.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('district')}</label>
            <input
              {...register('district')}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
            />
            {errors.district !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.district.message ?? 'required'}`)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('ward')}</label>
            <input {...register('ward')} className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none" />
            {errors.ward !== undefined && <p className="text-xs text-red-500">{t(`errors.${errors.ward.message ?? 'required'}`)}</p>}
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium">{t('orderNote')}</label>
            <textarea
              {...register('note')}
              rows={3}
              className="focus:border-primary/50 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              placeholder={t('orderNotePlaceholder')}
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
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <input type="radio" value="cod" {...register('paymentMethod')} className="accent-primary h-4 w-4" />
              <div>
                <p className="font-medium">{t('cod')}</p>
                <p className="text-muted-foreground text-xs">MVP hiện hỗ trợ duy nhất hình thức thanh toán khi nhận hàng.</p>
              </div>
            </label>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || createOrder.isPending || items.length === 0}
          className="bg-primary w-full rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 md:w-auto"
        >
          {isSubmitting || createOrder.isPending ? '...' : t('placeOrder')}
        </button>
        <p className="text-muted-foreground text-center text-xs">{t('placeOrderDesc')}</p>
      </motion.div>
    </form>
  );
}
