import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { jobTitlesService } from './job-titles.endpoints';
import { jobTitlesKeys } from './job-titles.keys';
import type { JobTitleDto, UpdateJobTitleDto } from './job-titles.types';

export const jobTitlesQueryOptions = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => ({
  queryKey: jobTitlesKeys.list(params),
  queryFn: () => jobTitlesService.list(params),
});

export const useJobTitlesQuery = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) =>
  useQuery({
    ...jobTitlesQueryOptions(params),
    select: (res) => ({
      items: extractApiList<JobTitleDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 10),
      raw: res.data,
    }),
  });

export const useJobTitleQuery = (id: string) =>
  useQuery({
    queryKey: jobTitlesKeys.detail(id),
    queryFn: () => jobTitlesService.getOne(id),
    enabled: Boolean(id),
    select: (res) => extractApiItem<JobTitleDto>(res.data),
  });

export const useCreateJobTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobTitlesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobTitlesKeys.lists() });
    },
  });
};

export const useUpdateJobTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobTitleDto }) =>
      jobTitlesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobTitlesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobTitlesKeys.lists() });
    },
  });
};

export const useDeleteJobTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobTitlesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobTitlesKeys.lists() });
    },
  });
};
