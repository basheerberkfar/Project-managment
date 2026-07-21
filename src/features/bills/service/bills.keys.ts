export const billsKeys = {
  all: ['bills'] as const,
  lists: () => [...billsKeys.all, 'list'] as const,
  list: (filters?: object) => [...billsKeys.lists(), filters] as const,
  detail: (id: number | string) => [...billsKeys.all, 'detail', id] as const,
};
