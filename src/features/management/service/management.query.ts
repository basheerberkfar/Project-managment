import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { managementService } from './management.endpoints';
import type { ResourceFilters, ResourcePayload } from './management.types';

const managementKeys = {
  all: ['management'] as const,
  list: (endpoint: string, filters?: ResourceFilters) =>
    [...managementKeys.all, endpoint, 'list', filters] as const,
  item: (endpoint: string, id: string) =>
    [...managementKeys.all, endpoint, 'item', id] as const,
};

export const useResourceListQuery = (
  endpoint: string,
  filters?: ResourceFilters,
  enabled = true,
  refetchInterval?: number
) =>
  useQuery({
    queryKey: managementKeys.list(endpoint, filters),
    queryFn: () => managementService.list(endpoint, filters),
    select: ({ data }) => ({ ...data, items: data.items ?? [] }),
    enabled,
    refetchInterval: enabled ? refetchInterval : false,
  });

export const useResourceItemQuery = (endpoint: string, id: string) =>
  useQuery({
    queryKey: managementKeys.item(endpoint, id),
    queryFn: () => managementService.item(endpoint, id),
    select: ({ data }) => data,
    enabled: Boolean(id),
  });

const useInvalidateResource = (endpoint: string) => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: [...managementKeys.all, endpoint],
    });
};

export const useCreateResourceMutation = (endpoint: string) => {
  const invalidate = useInvalidateResource(endpoint);
  return useMutation({
    mutationFn: (data: ResourcePayload) =>
      managementService.create(endpoint, data),
    onSuccess: invalidate,
  });
};

export const useUpdateResourceMutation = (endpoint: string) => {
  const invalidate = useInvalidateResource(endpoint);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResourcePayload }) =>
      managementService.update(endpoint, id, data),
    onSuccess: invalidate,
  });
};

export const useDeleteResourceMutation = (endpoint: string) => {
  const invalidate = useInvalidateResource(endpoint);
  return useMutation({
    mutationFn: (id: string) => managementService.remove(endpoint, id),
    onSuccess: invalidate,
  });
};
