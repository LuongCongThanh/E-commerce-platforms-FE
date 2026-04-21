export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_FAILED: '/checkout/failed',
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
