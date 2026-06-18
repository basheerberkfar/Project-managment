import api from '@/libs/axios';
import type { ApiDetailResponse, ApiListResponse } from '@/types/apis';
import { ROUTE } from './roles.routes';
import type {
  CreateRoleDto,
  RoleDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from './roles.types';

export const rolesService = {
  list: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => api.get<ApiListResponse<RoleDto>>(ROUTE.LIST, { params }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<RoleDto>>(ROUTE.GET_ONE(id)),

  getPermissions: (id: number | string) =>
    api.get<ApiDetailResponse<unknown>>(ROUTE.GET_PERMISSIONS(id)),

  create: (data: CreateRoleDto) => api.post(ROUTE.POST, data),

  update: (id: number | string, data: UpdateRoleDto) =>
    api.put(ROUTE.UPDATE(id), data),

  updatePermissions: (id: number | string, data: UpdateRolePermissionsDto) =>
    api.put(ROUTE.UPDATE_PERMISSIONS(id), data),

  remove: (id: number | string) => api.delete(ROUTE.DELETE(id)),
};
