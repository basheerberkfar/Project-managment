import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsService } from './projects.endpoints';
import { projectKeys } from './projects.keys';
import type { ProjectFilters, ProjectPayload } from './projects.types';

export const useProjectsQuery = (filters?: ProjectFilters) => useQuery({ queryKey: projectKeys.list(filters), queryFn: () => projectsService.list(filters), select: ({ data }) => ({ ...data, items: data.items ?? [] }) });
export const useProjectQuery = (id: string) => useQuery({ queryKey: projectKeys.detail(id), queryFn: () => projectsService.getOne(id), select: ({ data }) => data, enabled: Boolean(id) });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: projectsService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }) });
};
export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: ProjectPayload }) => projectsService.update(id, data), onSuccess: (_, { id }) => { queryClient.invalidateQueries({ queryKey: projectKeys.all }); queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) }); } });
};
export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: projectsService.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }) });
};
