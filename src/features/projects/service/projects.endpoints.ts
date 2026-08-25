import api from '@/libs/axios';
import { PROJECT_ROUTES } from './projects.routes';
import type { ProjectDto, ProjectFilters, ProjectPagedResponse, ProjectPayload } from './projects.types';

export const projectsService = {
  list: (params?: ProjectFilters) => api.get<ProjectPagedResponse>(PROJECT_ROUTES.LIST, { params }),
  getOne: (id: string) => api.get<ProjectDto>(PROJECT_ROUTES.DETAIL(id)),
  create: (data: ProjectPayload) => api.post<string>(PROJECT_ROUTES.LIST, data),
  update: (id: string, data: ProjectPayload) => api.put(PROJECT_ROUTES.DETAIL(id), data),
  remove: (id: string) => api.delete(PROJECT_ROUTES.DETAIL(id)),
};
