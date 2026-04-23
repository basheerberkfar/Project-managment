export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters?: object) => [...usersKeys.lists(), filters] as const,
  detail: (id: number) => [...usersKeys.all, 'detail', id] as const,
};
