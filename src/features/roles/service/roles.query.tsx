import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { rolesKeys } from './roles.keys';
import { rolesService } from './roles.endpoints';
import {
  normalizeRolePermissionGroups,
} from './roles.permissions';
import type {
  RoleDto,
  RolePermissionsQueryResult,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from './roles.types';

export const useRolesQuery = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  useQuery({
    queryKey: rolesKeys.list(params),
    queryFn: () => rolesService.list(params),
    select: (res) => ({
      items: extractApiList<RoleDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 10),
      raw: res.data,
    }),
  });

export const useRoleQuery = (id: number | string) =>
  useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => rolesService.getOne(id),
    enabled: !!id,
    select: (res) => extractApiItem<RoleDto>(res.data),
  });

export const useRolePermissionsQuery = () =>
  useQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: () => rolesService.getPermissions(),
    select: (res): RolePermissionsQueryResult => ({
      groups: normalizeRolePermissionGroups(res.data),
      selectedIds: [],
      raw: res.data,
    }),
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

export const useUpdateRolePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateRolePermissionsDto;
    }) => rolesService.updatePermissions(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permissions(),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(id),
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
