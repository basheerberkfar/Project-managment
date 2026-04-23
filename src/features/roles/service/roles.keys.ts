export const rolesKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesKeys.all, 'list'] as const,
  list: (filters?: object) => [...rolesKeys.lists(), filters] as const,
  permissions: () => [...rolesKeys.all, 'permissions'] as const,
  detail: (id: number | string) => [...rolesKeys.all, 'detail', id] as const,
};
