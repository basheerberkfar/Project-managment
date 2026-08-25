export const PROJECT_ROUTES = {
  LIST: 'Projects',
  DETAIL: (id: string) => `Projects/${id}`,
} as const;
