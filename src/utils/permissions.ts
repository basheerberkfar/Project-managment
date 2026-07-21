import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import type {
  PermissionAction,
  PermissionGroup,
} from '@/constants/permissions';
import { getAuthUser } from './helpers';

type PermissionSections = Record<
  string,
  Partial<Record<PermissionAction, number>>
>;

type LegacyRoleLike = {
  permissions?: Partial<Record<PermissionGroup, PermissionSections>>;
};

type PersistedPermission =
  | string
  | {
      name?: string | null;
      action?: string | null;
      section?: string | null;
      module?: string | null;
      group?: string | null;
    }
  | null
  | undefined;

type PersistedAuthUser = {
  is_admin?: boolean | number | null;
  isAdmin?: boolean | number | null;
  role?: {
    permissions?: PersistedPermission[];
  } | null;
  permissions?: PersistedPermission[];
};

type PersistedAuthStore = {
  state?: {
    user?: PersistedAuthUser | null;
    permissions?: PersistedPermission[];
  } | null;
};

const PERMISSION_ACTION_ALIASES: Partial<Record<string, PermissionAction>> = {
  edit: PERMISSION_ACTIONS.update,
  show: PERMISSION_ACTIONS.view,
  destroy: PERMISSION_ACTIONS.delete,
  accept_task: PERMISSION_ACTIONS.accept,
  transfer_task: PERMISSION_ACTIONS.transfer,
  cancel_task: PERMISSION_ACTIONS.cancel,
  done_task: PERMISSION_ACTIONS.done,
};

const getStoredAuthState = (): PersistedAuthStore['state'] | null => {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedAuthStore;
    return parsed.state ?? null;
  } catch {
    return null;
  }
};

const extractPermissionName = (permission: PersistedPermission) => {
  if (typeof permission === 'string' && permission.trim()) {
    return permission.trim();
  }

  if (permission && typeof permission === 'object') {
    if (typeof permission.name === 'string' && permission.name.trim()) {
      return permission.name.trim();
    }

    const permissionGroup =
      typeof permission.group === 'string' && permission.group.trim()
        ? permission.group.trim()
        : typeof permission.module === 'string' && permission.module.trim()
          ? permission.module.trim()
          : null;

    if (
      typeof permission.section === 'string' &&
      permission.section.trim() &&
      typeof permission.action === 'string' &&
      permission.action.trim()
    ) {
      const normalizedSection = permission.section.trim();
      const normalizedAction = permission.action.trim();

      return permissionGroup
        ? `${permissionGroup}.${normalizedSection}.${normalizedAction}`
        : `${normalizedSection}.${normalizedAction}`;
    }
  }

  return null;
};

const collectNestedPermissionNames = (
  input: unknown,
  result: Set<string>,
  path: string[] = []
) => {
  if (input == null) return;

  if (typeof input === 'string' && input.trim()) {
    result.add(input.trim());
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((item) => collectNestedPermissionNames(item, result, path));
    return;
  }

  if (typeof input !== 'object') return;

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (value && typeof value === 'object') {
      collectNestedPermissionNames(value, result, [...path, key]);
      continue;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      const fullPath = [...path, key].join('.');
      result.add(fullPath);

      const withoutNumericIds = [...path, key].filter(
        (segment) => !/^\d+$/.test(segment)
      );
      if (withoutNumericIds.length) {
        result.add(withoutNumericIds.join('.'));
      }
    }
  }
};

const getPermissionNames = () => {
  const permissionNames = new Set<string>();
  const storedState = getStoredAuthState();
  const legacyUser = getAuthUser();

  const pushPermissions = (permissions?: PersistedPermission[] | null) => {
    permissions?.forEach((permission) => {
      const name = extractPermissionName(permission);
      if (name) permissionNames.add(name);
    });
  };

  pushPermissions(storedState?.permissions ?? []);
  pushPermissions(storedState?.user?.permissions ?? []);
  pushPermissions(storedState?.user?.role?.permissions ?? []);
  collectNestedPermissionNames(storedState?.permissions, permissionNames);
  collectNestedPermissionNames(storedState?.user?.permissions, permissionNames);
  collectNestedPermissionNames(
    storedState?.user?.role?.permissions,
    permissionNames
  );

  legacyUser?.permissions?.forEach((permission) => {
    if (typeof permission === 'string' && permission.trim()) {
      permissionNames.add(permission.trim());
    }
  });

  legacyUser?.permission?.forEach((permission) => {
    if (typeof permission === 'string' && permission.trim()) {
      permissionNames.add(permission.trim());
    }
  });

  return permissionNames;
};

const getLegacyRoles = () => {
  const user = getAuthUser();
  if (!user) return [];

  const roles = Array.isArray(user.roles) ? user.roles : [];
  const singleRole = user.role ? [user.role] : [];

  return [...roles, ...singleRole].filter(Boolean) as LegacyRoleLike[];
};

const isAdminUser = () => {
  const storedUser = getStoredAuthState()?.user;
  const legacyUser = getAuthUser();

  return Boolean(
    storedUser?.is_admin === true ||
    storedUser?.is_admin === 1 ||
    storedUser?.isAdmin === true ||
    storedUser?.isAdmin === 1 ||
    legacyUser?.is_admin === 1
  );
};

const hasActionInSections = (
  sections: PermissionSections | undefined,
  action: PermissionAction
) => {
  if (!sections) return false;

  return Object.values(sections).some((section) => {
    if (!section || typeof section !== 'object') return false;
    return Boolean(section[action]);
  });
};

const hasActionInSection = (
  sections: PermissionSections | undefined,
  section: string,
  action: PermissionAction
) => {
  if (!sections) return false;

  const sectionPermissions = sections[section];
  if (!sectionPermissions || typeof sectionPermissions !== 'object') {
    return false;
  }

  return Boolean(sectionPermissions[action]);
};

const hasNamedPermission = (...permissionNames: string[]) => {
  const names = getPermissionNames();
  return permissionNames.some((permissionName) => names.has(permissionName));
};

const normalizePermissionAction = (action: string): PermissionAction | null => {
  const normalizedAction = action.trim();
  if (!normalizedAction) return null;

  if (
    Object.values(PERMISSION_ACTIONS).includes(
      normalizedAction as PermissionAction
    )
  ) {
    return normalizedAction as PermissionAction;
  }

  return PERMISSION_ACTION_ALIASES[normalizedAction] ?? null;
};

const parsePermissionKey = (
  permission: string,
  fallbackGroup?: PermissionGroup
): { group: PermissionGroup; action: PermissionAction } | null => {
  const normalizedPermission = permission.trim();
  if (!normalizedPermission) return null;

  const parts = normalizedPermission.split('.');

  if (parts.length === 1) {
    const action = normalizePermissionAction(parts[0]);
    if (!action || !fallbackGroup) return null;

    return {
      group: fallbackGroup,
      action,
    };
  }

  const [groupPart, actionPart] = [parts[0], parts.at(-1)];
  const action = actionPart ? normalizePermissionAction(actionPart) : null;

  if (!groupPart || !action) return null;

  if (
    !Object.values(PERMISSION_GROUPS).includes(groupPart as PermissionGroup)
  ) {
    return null;
  }

  return {
    group: groupPart as PermissionGroup,
    action,
  };
};

export const hasPermission = (
  group: PermissionGroup,
  action: PermissionAction
) => {
  const user = getAuthUser();
  const storedState = getStoredAuthState();

  if (!user && !storedState?.user) return false;
  if (isAdminUser()) return true;

  if (
    hasNamedPermission(
      `${group}.${action}`,
      `${group}.global.${action}`,
      `${group}.special.${action}`
    )
  ) {
    return true;
  }

  return getLegacyRoles().some((role) =>
    hasActionInSections(role.permissions?.[group], action)
  );
};

export const hasSectionPermission = (
  group: PermissionGroup,
  section: string,
  action: PermissionAction
) => {
  const user = getAuthUser();
  const storedState = getStoredAuthState();

  if (!user && !storedState?.user) return false;
  if (isAdminUser()) return true;

  if (
    hasNamedPermission(
      `${section}.${action}`,
      `${group}.${action}`,
      `${group}.${section}.${action}`
    )
  ) {
    return true;
  }

  return getLegacyRoles().some((role) =>
    hasActionInSection(role.permissions?.[group], section, action)
  );
};

export const hasPermissionKey = (
  permission: string,
  fallbackGroup?: PermissionGroup
) => {
  const parsedPermission = parsePermissionKey(permission, fallbackGroup);
  if (!parsedPermission) return false;

  return hasPermission(parsedPermission.group, parsedPermission.action);
};

export const hasSectionPermissionKey = (
  permission: string,
  group: PermissionGroup,
  section: string
) => {
  const parsedPermission = parsePermissionKey(permission, group);
  if (!parsedPermission) return false;

  return hasSectionPermission(
    parsedPermission.group,
    section,
    parsedPermission.action
  );
};

export const hasPermiision = hasPermission;

export {
  PERMISSION_ACTIONS,
  PERMISSION_GROUPS,
  type PermissionAction,
  type PermissionGroup,
};
