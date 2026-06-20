import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { clientsService } from './clients.endpoints';
import { clientsKeys } from './clients.keys';
import type {
  ClientDto,
  ClientFilters,
  UpdateClientDto,
} from './clients.types';

export const clientsQueryOptions = (params?: ClientFilters) => ({
  queryKey: clientsKeys.list(params),
  queryFn: () => clientsService.list(params),
});

export const useClientsQuery = (params?: ClientFilters) =>
  useQuery({
    ...clientsQueryOptions(params),
    select: (res) => ({
      items: extractApiList<ClientDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 10),
      raw: res.data,
    }),
  });

export const useClientQuery = (id: string) =>
  useQuery({
    queryKey: clientsKeys.detail(id),
    queryFn: () => clientsService.getOne(id),
    enabled: Boolean(id),
    select: (res) => extractApiItem<ClientDto>(res.data),
  });

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) =>
      clientsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};
