import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const RegisterFormSchema = z
  .object({
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    email: z.email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export const ForgotPasswordFormSchema = z.object({
  email: z.email('Email không hợp lệ'),
});

export const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type LoginFormInput = z.infer<typeof LoginFormSchema>;
export type RegisterFormInput = z.infer<typeof RegisterFormSchema>;
export type ForgotPasswordFormInput = z.infer<typeof ForgotPasswordFormSchema>;
export type ResetPasswordFormInput = z.infer<typeof ResetPasswordFormSchema>;
