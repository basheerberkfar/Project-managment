export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters?: object) => [...productsKeys.lists(), filters] as const,
  detail: (id: number | string) => [...productsKeys.all, 'detail', id] as const,
};
