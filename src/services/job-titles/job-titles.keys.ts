export const jobTitlesKeys = {
  all: ['job-titles'] as const,
  lists: () => [...jobTitlesKeys.all, 'list'] as const,
  list: (filters?: object) => [...jobTitlesKeys.lists(), filters] as const,
  detail: (id: string) => [...jobTitlesKeys.all, 'detail', id] as const,
};
