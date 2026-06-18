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
  id: string;
  name: string;
  guardName: string;
  isAdmin?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRoleDto = {
  name: string;
  guardName: string;
};

export type UpdateRoleDto = Partial<CreateRoleDto>;

export type RoleFormValues = {
  name: string;
  guardName: string;
};

export type UpdateRolePermissionsDto = {
  permission_ids: string[];
};

export type RolePermissionsQueryResult = {
  groups: RolePermissionGroupDto[];
  selectedIds: string[];
  raw: unknown;
};
