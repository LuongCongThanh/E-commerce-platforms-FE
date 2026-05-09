export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_FAILED: '/checkout/failed',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    ORDERS: '/admin/orders',
    ORDER: (id: string | number) => `/admin/orders/${String(id)}`,
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  ACCOUNT: {
    ORDERS: '/account/orders',
    ORDER: (id: string | number) => `/account/orders/${String(id)}`,
    PROFILE: '/account/profile',
  },
} as const;
