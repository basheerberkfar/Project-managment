export const ROUTE = {
  POST: '/products',
  LIST: '/products',
  GET_ONE: (id: number | string) => `/products/${id}`,
  UPDATE: (id: number | string) => `/products/${id}`,
  DELETE: (id: number | string) => `/products/${id}`,
  TOGGLE: (id: number | string) => `/products/toggle/${id}`,
  ACTIVE: '/products/active',
  IN_ACTIVE: '/products/in_active',
};
