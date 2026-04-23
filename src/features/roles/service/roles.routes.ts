export const ROUTE = {
  POST: '/roles',
  LIST: '/roles',
  PERMISSIONS: '/roles/get/permissions',
  GET_ONE: (id: number | string) => `/roles/${id}`,
  UPDATE: (id: number | string) => `/roles/${id}`,
  DELETE: (id: number | string) => `/roles/${id}`,
};
