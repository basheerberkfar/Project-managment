export const productUnitKeys = {
  all: ['product-units'] as const,
  lists: () => [...productUnitKeys.all, 'list'] as const,
  list: (params: Record<string, unknown> = {}) =>
    [...productUnitKeys.lists(), { ...params }] as const,
  details: () => [...productUnitKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productUnitKeys.details(), id] as const,
};
