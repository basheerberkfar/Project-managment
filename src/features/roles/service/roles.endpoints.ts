import api from '@/libs/axios';
import type { ApiDetailResponse, ApiListResponse } from '@/types/apis';
import { ROUTE } from './roles.routes';
import type {
  CreateRoleDto,
  RoleDto,
  RolePermissionGroupDto,
  UpdateRoleDto,
} from './roles.types';

export const rolesService = {
  list: (params?: {
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
  }) => api.get<ApiListResponse<RoleDto>>(ROUTE.LIST, { params }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<RoleDto>>(ROUTE.GET_ONE(id)),

  listPermissions: () =>
    api.get<ApiDetailResponse<RolePermissionGroupDto[] | unknown>>(
      ROUTE.PERMISSIONS
    ),

  create: (data: CreateRoleDto) => api.post(ROUTE.POST, data),

  update: (id: number | string, data: UpdateRoleDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: number | string) => api.delete(ROUTE.DELETE(id)),
};
