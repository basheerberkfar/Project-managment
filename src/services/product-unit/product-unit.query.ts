import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productUnitApi } from './product-unit.endpoints';
import { productUnitKeys } from './product-unit.keys';
import type { UpdateProductUnitDto } from './product-unit.types';

export const productUnitsQueryOptions = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  'filter[search]'?: string;
  status?: string;
}) => ({
  queryKey: productUnitKeys.list(params),
  queryFn: () => productUnitApi.list(params),
});

export const useProductUnitsQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  'filter[search]'?: string;
  status?: string;
}) =>
  useQuery({
    ...productUnitsQueryOptions(params),
    select: (res) => res.data,
  });

export const useProductUnitQuery = (id: number | string) =>
  useQuery({
    queryKey: productUnitKeys.detail(id),
    queryFn: () => productUnitApi.getOne(id),
    enabled: !!id,
    select: (res) => res.data.result,
  });

export const useCreateProductUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productUnitApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.lists(),
      });
    },
  });
};

export const useUpdateProductUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateProductUnitDto;
    }) => productUnitApi.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.lists(),
      });
    },
  });
};

export const useDeleteProductUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productUnitApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.lists(),
      });
    },
  });
};

export const useToggleProductUnitStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productUnitApi.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productUnitKeys.lists(),
      });
    },
  });
};
