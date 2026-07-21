export const departmentsKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentsKeys.all, 'list'] as const,
  list: (filters?: object) => [...departmentsKeys.lists(), filters] as const,
  detail: (id: string) => [...departmentsKeys.all, 'detail', id] as const,
};
