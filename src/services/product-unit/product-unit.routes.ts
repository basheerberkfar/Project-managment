export const PRODUCT_UNIT_ROUTES = {
  LIST: '/product_units',
  GET_ONE: (id: number | string) => `/product_units/${id}`,
  CREATE: '/product_units',
  UPDATE: (id: number | string) => `/product_units/${id}`,
  DELETE: (id: number | string) => `/product_units/${id}`,
  TOGGLE: (id: number | string) => `/product_units/toggle/${id}`,
  ACTIVE: '/product_units/active',
  IN_ACTIVE: '/product_units/in_active',
};
