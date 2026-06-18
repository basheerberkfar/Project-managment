import api from '@/libs/axios';
import type { CreateJobTitleDto, UpdateJobTitleDto } from './job-titles.types';
import { ROUTE } from './job-titles.routes';

export const jobTitlesService = {
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    api.get(ROUTE.LIST, { params }),

  getOne: (id: string) => api.get(ROUTE.GET_ONE(id)),

  create: (data: CreateJobTitleDto) => api.post(ROUTE.POST, data),

  update: (id: string, data: UpdateJobTitleDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: string) => api.delete(ROUTE.DELETE(id)),
};
