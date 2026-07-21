export const clientsKeys = {
  all: ['clients'] as const,
  lists: () => [...clientsKeys.all, 'list'] as const,
  list: (filters?: object) => [...clientsKeys.lists(), filters] as const,
  detail: (id: string) => [...clientsKeys.all, 'detail', id] as const,
};
