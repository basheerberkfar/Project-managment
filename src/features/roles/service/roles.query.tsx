import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesKeys } from './roles.keys';
import { rolesService } from './roles.endpoints';
import { normalizeRolePermissionGroups } from './roles.permissions';
import type {
  RoleDto,
  RolePermissionGroupDto,
  UpdateRoleDto,
} from './roles.types';

export const useRolesQuery = (params?: {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}) =>
  useQuery({
    queryKey: rolesKeys.list(params),
    queryFn: () => rolesService.list(params),
    select: (res) => res.data,
  });

export const useRoleQuery = (id: number | string) =>
  useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => rolesService.getOne(id),
    enabled: !!id,
    select: (res) => {
      const payload = res.data as { data?: RoleDto; result?: RoleDto };
      return (payload.data ?? payload.result ?? null) as RoleDto | null;
    },
  });

export const useRolePermissionsQuery = () =>
  useQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: () => rolesService.listPermissions(),
    select: (res) =>
      normalizeRolePermissionGroups(res.data) as RolePermissionGroupDto[],
  });

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.lists(),
      });
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateRoleDto }) =>
      rolesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.lists(),
      });
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rolesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.lists(),
      });
    },
  });
};
