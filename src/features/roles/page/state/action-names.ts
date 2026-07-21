export const rolesListActionNames = {
  setSearch: 'SET_SEARCH',
  setPageIndex: 'SET_PAGE_INDEX',
  setPageSize: 'SET_PAGE_SIZE',
  setSort: 'SET_SORT',
  setSelectedRole: 'SET_SELECTED_ROLE',
} as const;

export type RolesListActionName =
  (typeof rolesListActionNames)[keyof typeof rolesListActionNames];
