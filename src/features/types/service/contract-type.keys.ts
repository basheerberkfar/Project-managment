export const contractTypeKeys = {
  all: ['contract-types'] as const,
  lists: () => [...contractTypeKeys.all, 'list'] as const,
  list: (params: Record<string, unknown> = {}) =>
    [...contractTypeKeys.lists(), { ...params }] as const,
  details: () => [...contractTypeKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...contractTypeKeys.details(), id] as const,
};
