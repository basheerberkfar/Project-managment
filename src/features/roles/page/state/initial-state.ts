import type { RoleDto } from '../../service';

export type RolesListSort = {
  columnId: string;
  direction: 'asc' | 'desc';
};

export type RolesListState = {
  search: string;
  pageIndex: number;
  pageSize: number;
  sort?: RolesListSort;
  selectedRole: RoleDto | null;
};

export const rolesListInitialState: RolesListState = {
  search: '',
  pageIndex: 1,
  pageSize: 20,
  sort: undefined,
  selectedRole: null,
};
