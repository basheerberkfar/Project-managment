import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { departmentsService } from './departments.endpoints';
import { departmentsKeys } from './departments.keys';
import type {
  DepartmentDto,
  UpdateDepartmentDto,
} from './departments.types';

export const departmentsQueryOptions = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => ({
  queryKey: departmentsKeys.list(params),
  queryFn: () => departmentsService.list(params),
});

export const useDepartmentsQuery = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  useQuery({
    ...departmentsQueryOptions(params),
    select: (res) => ({
      items: extractApiList<DepartmentDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 10),
      raw: res.data,
    }),
  });

export const useDepartmentQuery = (id: string) =>
  useQuery({
    queryKey: departmentsKeys.detail(id),
    queryFn: () => departmentsService.getOne(id),
    enabled: Boolean(id),
    select: (res) => extractApiItem<DepartmentDto>(res.data),
  });

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDto }) =>
      departmentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};
