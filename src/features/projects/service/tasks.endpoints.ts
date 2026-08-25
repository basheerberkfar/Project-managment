import api from '@/libs/axios';
import type { PagedResponse } from '@/features/finance/service';
import { TASK_ROUTES } from './tasks.routes';
import type { TaskCategoryDto, TaskCategoryPayload, TaskDto, TaskPayload, TaskStatusDto, TaskStatusPayload } from './tasks.types';

export const tasksService = {
  list: (params: { ProjectId: string; Page?: number; PageSize?: number }) => api.get<PagedResponse<TaskDto>>(TASK_ROUTES.LIST, { params }),
  create: (data: TaskPayload) => api.post<string>(TASK_ROUTES.LIST, data),
  update: (id: string, data: TaskPayload) => api.put(TASK_ROUTES.DETAIL(id), data),
  remove: (id: string) => api.delete(TASK_ROUTES.DETAIL(id)),
  statuses: () => api.get<PagedResponse<TaskStatusDto>>(TASK_ROUTES.STATUSES, { params: { Page: 1, PageSize: 100, SortBy: 'sortOrder' } }),
  createStatus: (data: TaskStatusPayload) => api.post<string>(TASK_ROUTES.STATUSES, data),
  updateStatus: (id: string, data: TaskStatusPayload) => api.put(TASK_ROUTES.STATUS(id), data),
  deleteStatus: (id: string) => api.delete(TASK_ROUTES.STATUS(id)),
  categories: () => api.get<PagedResponse<TaskCategoryDto>>(TASK_ROUTES.CATEGORIES, { params: { Page: 1, PageSize: 100 } }),
  createCategory: (data: TaskCategoryPayload) => api.post<string>(TASK_ROUTES.CATEGORIES, data),
  updateCategory: (id: string, data: TaskCategoryPayload) => api.put(TASK_ROUTES.CATEGORY(id), data),
  deleteCategory: (id: string) => api.delete(TASK_ROUTES.CATEGORY(id)),
};
