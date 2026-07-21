import api from '@/libs/axios';
import type {
  CreateProjectDto,
  ProjectFilters,
  UpdateProjectDto,
} from './projects.types';
import { ROUTE } from './projects.routes';

export const projectsService = {
  list: (params?: ProjectFilters) => api.get(ROUTE.LIST, { params }),

  getOne: (id: string) => api.get(ROUTE.GET_ONE(id)),

  create: (data: CreateProjectDto) => api.post(ROUTE.POST, data),

  update: (id: string, data: UpdateProjectDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: string) => api.delete(ROUTE.DELETE(id)),
};