export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (filters?: object) => [...projectsKeys.lists(), filters] as const,
  detail: (id: string) => [...projectsKeys.all, 'detail', id] as const,
};