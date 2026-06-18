export const ROUTE = {
  LIST: 'Users',
  POST: 'Users',
  GET_ONE: (id: string) => `Users/${id}`,
  UPDATE: (id: string) => `Users/${id}`,
  DELETE: (id: string) => `Users/${id}`,
  CHANGE_PASSWORD: (id: string) => `Users/${id}/password`,
};
