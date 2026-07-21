import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contractTypeService } from './contract-type.endpoints';
import { contractTypeKeys } from './contract-type.keys';
import type { UpdateContractTypeDto } from './contract-type.types';

export const contractTypesQueryOptions = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) => ({
  queryKey: contractTypeKeys.list(params),
  queryFn: () => contractTypeService.list(params),
});

export const useContractTypesQuery = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) =>
  useQuery({
    ...contractTypesQueryOptions(params),
    select: (res) => res.data,
  });

export const useContractTypeQuery = (id: number | string) =>
  useQuery({
    queryKey: contractTypeKeys.detail(id),
    queryFn: () => contractTypeService.getOne(id),
    enabled: !!id,
    select: (res) => {
      const payload = res.data as { data?: unknown; result?: unknown };
      return (payload.data ?? payload.result ?? null) as
        | import('./contract-type.types').ContractTypeDto
        | null;
    },
  });

export const useCreateContractTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractTypeKeys.lists(),
      });
    },
  });
};

export const useUpdateContractTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateContractTypeDto;
    }) => contractTypeService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: contractTypeKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: contractTypeKeys.lists(),
      });
    },
  });
};
