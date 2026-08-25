export const TASK_ROUTES = {
  LIST: 'Tasks',
  DETAIL: (id: string) => `Tasks/${id}`,
  STATUSES: 'TaskStatuses',
  STATUS: (id: string) => `TaskStatuses/${id}`,
  CATEGORIES: 'TaskCategories',
  CATEGORY: (id: string) => `TaskCategories/${id}`,
} as const;
