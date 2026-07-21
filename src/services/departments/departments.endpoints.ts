import api from '@/libs/axios';
import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './departments.types';
import { ROUTE } from './departments.routes';

export const departmentsService = {
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    api.get(ROUTE.LIST, { params }),

  getOne: (id: string) => api.get(ROUTE.GET_ONE(id)),

  create: (data: CreateDepartmentDto) => api.post(ROUTE.POST, data),

  update: (id: string, data: UpdateDepartmentDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: string) => api.delete(ROUTE.DELETE(id)),
};
