export const ROUTE = {
  POST: '/Roles',
  LIST: '/Roles',
  GET_ONE: (id: number | string) => `/Roles/${id}`,
  UPDATE: (id: number | string) => `/Roles/${id}`,
  DELETE: (id: number | string) => `/Roles/${id}`,
  GET_PERMISSIONS: (id: number | string) => `Roles/${id}/permissions`,
  UPDATE_PERMISSIONS: (id: number | string) => `Roles/${id}/permissions`,
};
