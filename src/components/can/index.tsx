import type { ReactNode } from 'react';
import type {
  PermissionAction,
  PermissionGroup,
} from '@/constants/permissions';
import {
  hasPermission,
  hasPermissionKey,
  hasSectionPermission,
} from '@/utils/permissions';

type CanByGroupAndActionProps = {
  group: PermissionGroup;
  action: PermissionAction;
  section?: string;
  permission?: never;
  children: ReactNode;
  fallback?: ReactNode;
};

type CanByPermissionKeyProps = {
  permission: string;
  group?: PermissionGroup;
  action?: never;
  section?: never;
  children: ReactNode;
  fallback?: ReactNode;
};

type CanProps = CanByGroupAndActionProps | CanByPermissionKeyProps;

export default function Can({
  group,
  action,
  section,
  permission,
  children,
  fallback = null,
}: CanProps) {
  const allowed = permission
    ? hasPermissionKey(permission, group)
    : section && group && action
      ? hasSectionPermission(group, section, action)
      : group && action
        ? hasPermission(group, action)
        : false;

  return allowed ? <>{children}</> : <>{fallback}</>;
}
