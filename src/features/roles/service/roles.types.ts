export type RoleStatus = 'active' | 'inactive';

export type RolePermissionDto = {
  id: string;
  name?: string;
  label?: string;
  title?: string;
  key?: string;
  module?: string;
  group?: string;
};

export type RolePermissionSectionDto = {
  id: string;
  label: string;
  permissions: RolePermissionDto[];
};

export type RolePermissionGroupDto = {
  id: string;
  label: string;
  permissions: RolePermissionDto[];
  sections: RolePermissionSectionDto[];
};

export type RoleDto = {
  id: number | string;
  name?: string;
  title?: string;
  description?: string;
  status?: RoleStatus;
  is_default?: number | boolean;
  permissions: string[] | RolePermissionDto[];
  users_count?: number;
  usersCount?: number;
  created_at?: string;
  createdAt?: string;
};

export type CreateRoleDto = {
  name: string;
  permission_ids: string[];
};

export type UpdateRoleDto = Partial<CreateRoleDto>;

export type RoleFormValues = {
  name: string;
  permissions_ids: string[];
};
