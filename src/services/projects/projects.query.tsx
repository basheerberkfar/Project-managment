import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { projectsService } from './projects.endpoints';
import { projectsKeys } from './projects.keys';
import type {
  ProjectDto,
  ProjectFilters,
  UpdateProjectDto,
} from './projects.types';

export const projectsQueryOptions = (params?: ProjectFilters) => ({
  queryKey: projectsKeys.list(params),
  queryFn: () => projectsService.list(params),
});

export const useProjectsQuery = (params?: ProjectFilters) =>
  useQuery({
    ...projectsQueryOptions(params),
    select: (res) => ({
      items: extractApiList<ProjectDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 10),
      raw: res.data,
    }),
  });

export const useProjectQuery = (id: string) =>
  useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => projectsService.getOne(id),
    enabled: Boolean(id),
    select: (res) => extractApiItem<ProjectDto>(res.data),
  });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};