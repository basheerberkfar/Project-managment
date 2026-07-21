export const ROUTE = {
  POST: '/Roles',
  LIST: '/Roles',
  GET_ONE: (id: number | string) => `/Roles/${id}`,
  UPDATE: (id: number | string) => `/Roles/${id}`,
  DELETE: (id: number | string) => `/Roles/${id}`,
  GET_PERMISSIONS: '/Permissions',
  UPDATE_PERMISSIONS: (id: number | string) => `Roles/${id}/permissions`,
};
