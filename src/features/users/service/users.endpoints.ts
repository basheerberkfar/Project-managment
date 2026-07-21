import api from '@/libs/axios';
import { ROUTE } from './users.routes';
import type {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
} from './users.types';

export const usersService = {
  list: (params?: UserFilters) => api.get(ROUTE.LIST, { params }),

  getOne: (id: string) => api.get(ROUTE.GET_ONE(id)),

  create: (data: CreateUserDto) => api.post(ROUTE.POST, data),

  update: (id: string, data: UpdateUserDto) => api.put(ROUTE.UPDATE(id), data),

  remove: (id: string) => api.delete(ROUTE.DELETE(id)),

  changePassword: (id: string, data: ChangePasswordDto) =>
    api.put(ROUTE.CHANGE_PASSWORD(id), data),
};
