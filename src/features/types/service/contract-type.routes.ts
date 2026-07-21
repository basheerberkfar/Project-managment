export const CONTRACT_TYPE_ROUTES = {
  LIST: '/contract_types',
  GET_ONE: (id: number | string) => `/contract_types/${id}`,
  CREATE: '/contract_types',
  UPDATE: (id: number | string) => `/contract_types/${id}`,
};
