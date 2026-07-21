import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productTypeApi } from './product-type.endpoints';
import { productKeys } from './product-type.keys';
import type { UpdateProductTypeDto } from './products.types';

export const productTypesQueryOptions = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  'filter[search]'?: string;
  status?: string;
}) => ({
  queryKey: productKeys.list(params),
  queryFn: () => productTypeApi.list(params),
});

export const useProductTypesQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  'filter[search]'?: string;
  status?: string;
}) =>
  useQuery({
    ...productTypesQueryOptions(params),
    select: (res) => res.data,
  });

export const useProductTypeQuery = (id: number | string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productTypeApi.getOne(id),
    enabled: !!id,
    select: (res) => res.data.result,
  });

export const useCreateProductTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productTypeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useUpdateProductTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateProductTypeDto;
    }) => productTypeApi.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useDeleteProductTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productTypeApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useToggleProductTypeStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productTypeApi.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};
