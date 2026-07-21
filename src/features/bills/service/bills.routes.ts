export const BILLS_ROUTE = {
  POST: 'Bills',
  LIST: 'Bills',
  GET_ONE: (id: number | string) => `Bills/${id}`,
  UPDATE: (id: number | string) => `Bills/${id}`,
  DELETE: (id: number | string) => `Bills/${id}`,
};
