import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksService } from './tasks.endpoints';
import type { TaskCategoryPayload, TaskPayload, TaskStatusPayload } from './tasks.types';

const taskKeys = { all: ['tasks'] as const, list: (projectId: string) => ['tasks', 'list', projectId] as const, statuses: ['tasks', 'statuses'] as const, categories: ['tasks', 'categories'] as const };
export const useTasksQuery = (projectId: string) => useQuery({ queryKey: taskKeys.list(projectId), queryFn: () => tasksService.list({ ProjectId: projectId, Page: 1, PageSize: 200 }), select: ({ data }) => ({ ...data, items: data.items ?? [] }), enabled: Boolean(projectId) });
export const useTaskStatusesQuery = () => useQuery({ queryKey: taskKeys.statuses, queryFn: tasksService.statuses, select: ({ data }) => ({ ...data, items: (data.items ?? []).sort((left, right) => left.sortOrder - right.sortOrder) }) });
export const useTaskCategoriesQuery = () => useQuery({ queryKey: taskKeys.categories, queryFn: tasksService.categories, select: ({ data }) => ({ ...data, items: data.items ?? [] }) });
const useTaskMutation = <T>(mutationFn: (variables: T) => Promise<unknown>) => { const queryClient = useQueryClient(); return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }) }); };
export const useCreateTaskMutation = () => useTaskMutation<TaskPayload>(tasksService.create);
export const useUpdateTaskMutation = () => useTaskMutation<{ id: string; data: TaskPayload }>(({ id, data }) => tasksService.update(id, data));
export const useDeleteTaskMutation = () => useTaskMutation<string>(tasksService.remove);
export const useCreateTaskStatusMutation = () => useTaskMutation<TaskStatusPayload>(tasksService.createStatus);
export const useUpdateTaskStatusMutation = () => useTaskMutation<{ id: string; data: TaskStatusPayload }>(({ id, data }) => tasksService.updateStatus(id, data));
export const useDeleteTaskStatusMutation = () => useTaskMutation<string>(tasksService.deleteStatus);
export const useCreateTaskCategoryMutation = () => useTaskMutation<TaskCategoryPayload>(tasksService.createCategory);
export const useUpdateTaskCategoryMutation = () => useTaskMutation<{ id: string; data: TaskCategoryPayload }>(({ id, data }) => tasksService.updateCategory(id, data));
export const useDeleteTaskCategoryMutation = () => useTaskMutation<string>(tasksService.deleteCategory);
