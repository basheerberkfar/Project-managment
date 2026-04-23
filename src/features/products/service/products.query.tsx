// src/queries/users.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from './products.endpoints';
import { productsKeys } from './products.keys';
import type { UpdateProductDto } from './products.types';

export const useProductsQuery = (params?: {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  'filter[product_type_ids][]'?: Array<number | string>;
}) =>
  useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => productsService.list(params),
    select: (res) => res.data,
  });

export const useProductQuery = (id: number | string) =>
  useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => productsService.getOne(id),
    enabled: !!id,
    select: (res) => res.data.result,
  });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateProductDto;
    }) => productsService.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};

/** تغيير حالة المنتج (تفعيل/إلغاء) - يستدعي products/toggle/{id} بدون body */
export const useToggleProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => productsService.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};

export const useActivateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.active,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};

export const useDeactivateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.inactive,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.lists(),
      });
    },
  });
};
