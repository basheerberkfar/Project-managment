import { getAuthUser } from '@/utils/helpers';

export type SidebarSchemaItem = {
  key: string;
  labelKey: string;
  link?: string;
  permissionNames?: string[];
  children?: SidebarSchemaItem[];
};

type AuthStateUser = {
  is_admin?: boolean | number | null;
  isAdmin?: boolean | number | null;
  permissions?: unknown;
  role?: {
    permissions?: unknown;
  } | null;
};

type PersistedAuthStore = {
  state?: {
    user?: AuthStateUser | null;
    permissions?: unknown;
  } | null;
};

export const SIDEBAR_SCHEMA: SidebarSchemaItem[] = [
  {
    key: 'dashboard',
    labelKey: 'dashboard',
    link: '/dashboard',
    permissionNames: ['homepage.view'],
  },
  {
    key: 'users-roles',
    labelKey: 'users-roles',
    children: [
      {
        key: 'users-list',
        labelKey: 'users-list',
        link: '/users-roles/users',
        permissionNames: ['users.view'],
      },
      {
        key: 'roles-list',
        labelKey: 'roles-list',
        link: '/users-roles/roles',
        permissionNames: ['roles.view'],
      },
    ],
  },
  {
    key: 'clients',
    labelKey: 'clients',
    children: [
      {
        key: 'clients-list',
        labelKey: 'clients-list',
        link: '/clients-list',
        permissionNames: ['clients.view'],
      },
      {
        key: 'clients-groups',
        labelKey: 'clients-groups',
        link: '/client_groups',
        permissionNames: ['client_groups.view'],
      },
    ],
  },
  {
    key: 'cars',
    labelKey: 'cars',
    children: [
      {
        key: 'cars-list',
        labelKey: 'cars-list',
        link: '/cars',
        permissionNames: ['cars.view'],
      },
      {
        key: 'car-logs',
        labelKey: 'car-logs',
        link: '/car-logs',
        permissionNames: ['car_logs.view'],
      },
    ],
  },
  {
    key: 'tasks',
    labelKey: 'tasks',
    children: [
      {
        key: 'tasks-list',
        labelKey: 'tasks-list',
        link: '/tasks',
        permissionNames: ['tasks.view'],
      },
      {
        key: 'deleted-tasks',
        labelKey: 'deleted-tasks',
        link: '/tasks/deleted',
        permissionNames: [
          'trash.view',
          'trash.restore',
          'trash.force_delete',
          'tasks.trash.view',
          'tasks.trash.restore',
          'tasks.trash.force_delete',
        ],
      },
    ],
  },
  {
    key: 'delegates',
    labelKey: 'delegates',
    link: '/delegates',
    permissionNames: ['delegates.view'],
  },

  {
    key: 'products',
    labelKey: 'products',
    link: '/products',
    permissionNames: ['products.view'],
  },
  {
    key: 'bonds',
    labelKey: 'bonds',
    link: '/bonds',
    permissionNames: ['bonds.view'],
  },
  {
    key: 'contracts',
    labelKey: 'contracts',
    children: [
      {
        key: 'contracts-list',
        labelKey: 'contracts-list',
        link: '/contracts',
        permissionNames: ['contracts.view'],
      },
      {
        key: 'contract-requests',
        labelKey: 'contract-requests',
        link: '/contracts/requests',
        permissionNames: ['contracts.view'],
      },
    ],
  },
  {
    key: 'store',
    labelKey: 'store',
    children: [
      {
        key: 'store-requests',
        labelKey: 'store-requests',
        link: '/store-requests',
        permissionNames: [
          'store_requests.view',
          'store_requests.create',
          'store_requests.update',
          'store_requests.delete',
        ],
      },
      {
        key: 'store-transactions',
        labelKey: 'store-transactions',
        link: '/store-transactions',
        permissionNames: [
          'store_requests.view',
          'store_requests.create',
          'store_requests.update',
          'store_requests.delete',
        ],
      },
    ],
  },
  {
    key: 'orders',
    labelKey: 'orders',
    link: '/orders',
    permissionNames: ['orders.view'],
  },
  {
    key: 'types',
    labelKey: 'types',
    link: '/types',
    permissionNames: [
      'contract_types.view',
      'bond_types.view',
      'product_types.view',
      'product_units.view',
      'task_types.view',
      'bill_types.view',
      'car_log_types.view',
      'store_operations.view',
      'bill_reasons.view',
      'reasons.view',
    ],
  },
  {
    key: 'settings',
    labelKey: 'settings',
    link: '/settings',
    permissionNames: [
      'settings.view',
      'vat.view',
      'states.view',
      'cities.view',
      'locations.view',
      'contract_templates.view',
      'settings.vat.view',
      'settings.states.view',
      'settings.cities.view',
      'settings.locations.view',
      'settings.contract_templates.view',
    ],
  },
];

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

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const addNormalizedPermission = (
  rawPermission: string,
  result: Set<string>
) => {
  const permission = rawPermission.trim();
  if (!permission) return;

  result.add(permission);

  const parts = permission.split('.');

  // users.global.view => users.view
  if (parts.length === 3 && parts[1] === 'global') {
    result.add(`${parts[0]}.${parts[2]}`);
  }

  // settings.vat.view => vat.view
  if (parts.length === 3 && parts[0] === 'settings') {
    result.add(`${parts[1]}.${parts[2]}`);
  }
};

const collectPermissionNames = (
  input: unknown,
  result: Set<string>,
  path: string[] = []
) => {
  if (input == null) return;

  if (typeof input === 'string') {
    addNormalizedPermission(input, result);
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((item) => collectPermissionNames(item, result, path));
    return;
  }

  if (!isPlainObject(input)) return;

  if (typeof input.name === 'string' && input.name.trim()) {
    addNormalizedPermission(input.name, result);
    return;
  }

  for (const [key, value] of Object.entries(input)) {
    if (isPlainObject(value) || Array.isArray(value)) {
      collectPermissionNames(value, result, [...path, key]);
      continue;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      const permissionName = [...path, key].join('.');
      addNormalizedPermission(permissionName, result);
    }
  }
};

export const getSidebarPermissionContext = () => {
  const storedState = getStoredAuthState();
  const storedUser = storedState?.user ?? null;
  const legacyUser = getAuthUser();

  const permissionNames = new Set<string>();

  collectPermissionNames(storedState?.permissions, permissionNames);
  collectPermissionNames(storedUser?.permissions, permissionNames);
  collectPermissionNames(storedUser?.role?.permissions, permissionNames);
  collectPermissionNames(legacyUser?.permission, permissionNames);
  collectPermissionNames(legacyUser?.permissions, permissionNames);
  collectPermissionNames(legacyUser?.role?.permissions, permissionNames);

  const isAdmin = storedUser?.is_admin === 1;

  return {
    permissionNames,
    isAdmin,
  };
};

const hasItemPermission = (
  item: SidebarSchemaItem,
  permissionNames: Set<string>,
  isAdmin: boolean
) => {
  if (isAdmin) return true;
  if (!item.permissionNames?.length) return false;

  return item.permissionNames.some((permission) =>
    permissionNames.has(permission)
  );
};

export const filterSidebarSchema = (
  items: SidebarSchemaItem[],
  permissionNames: Set<string>,
  isAdmin: boolean
): SidebarSchemaItem[] => {
  return items.reduce<SidebarSchemaItem[]>((acc, item) => {
    const filteredChildren = item.children
      ? filterSidebarSchema(item.children, permissionNames, isAdmin)
      : undefined;

    const selfAllowed = hasItemPermission(item, permissionNames, isAdmin);
    const hasVisibleChildren = Boolean(filteredChildren?.length);

    if (!selfAllowed && !hasVisibleChildren) {
      return acc;
    }

    acc.push({
      ...item,
      children: filteredChildren,
    });

    return acc;
  }, []);
};

export const getFirstSidebarLink = (
  items: SidebarSchemaItem[]
): string | null => {
  for (const item of items) {
    if (item.link) return item.link;

    if (item.children?.length) {
      const firstChildLink = getFirstSidebarLink(item.children);
      if (firstChildLink) return firstChildLink;
    }
  }

  return null;
};

export const getFirstAccessibleSidebarLink = () => {
  const { permissionNames, isAdmin } = getSidebarPermissionContext();
  const visibleItems = filterSidebarSchema(
    SIDEBAR_SCHEMA,
    permissionNames,
    isAdmin
  );

  return getFirstSidebarLink(visibleItems) ?? '/dashboard';
};
