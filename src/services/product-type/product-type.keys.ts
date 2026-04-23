export const productKeys = {
  all: ['product-types'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: Record<string, unknown> = {}) =>
    [...productKeys.lists(), { ...params }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productKeys.details(), id] as const,
};
