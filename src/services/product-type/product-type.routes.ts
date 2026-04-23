export const PRODUCT_TYPE_ROUTES = {
  LIST: '/product_types',
  GET_ONE: (id: number | string) => `/product_types/${id}`,
  CREATE: '/product_types',
  UPDATE: (id: number | string) => `/product_types/${id}`,
  DELETE: (id: number | string) => `/product_types/${id}`,
  TOGGLE: (id: number | string) => `/product_types/toggle/${id}`,
  ACTIVE: '/product_types/active',
  IN_ACTIVE: '/product_types/in_active',
};
