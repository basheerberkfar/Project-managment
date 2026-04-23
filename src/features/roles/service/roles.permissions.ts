import type {
  RolePermissionDto,
  RolePermissionGroupDto,
  RolePermissionSectionDto,
} from './roles.types';

// Translation key mappings for modules
const moduleTranslationKeys: Record<string, string> = {
  users: 'permission_module_users',
  roles: 'permission_module_roles',
  clients: 'permission_module_clients',
  client_groups: 'permission_module_client_groups',
  delegates: 'permission_module_delegates',
  contracts: 'permission_module_contracts',
  contract_types: 'permission_module_contract_types',
  products: 'permission_module_products',
  product_types: 'permission_module_product_types',
  product_units: 'permission_module_product_units',
  stores: 'permission_module_stores',
  store_requests: 'permission_module_store_requests',
  store_operations: 'permission_module_store_operations',
  cars: 'permission_module_cars',
  car_logs: 'permission_module_car_logs',
  car_log_types: 'permission_module_car_log_types',
  bills: 'permission_module_bills',
  bill_types: 'permission_module_bill_types',
  bill_reasons: 'permission_module_bill_reasons',
  bonds: 'permission_module_bonds',
  bond_types: 'permission_module_bond_types',
  tasks: 'permission_module_tasks',
  task_types: 'permission_module_task_types',
  offers: 'permission_module_offers',
  visits: 'permission_module_visits',
  follow_ups: 'permission_module_follow_ups',
  reports: 'permission_module_reports',
  settings: 'permission_module_settings',
  reasons: 'permission_module_reasons',
};

// Translation key mappings for sections
const sectionTranslationKeys: Record<string, string> = {
  global: 'permission_section_global',
  special: 'permission_section_special',
  products: 'permission_section_products',
  contract_request: 'permission_section_contract_request',
  decision_reasons: 'permission_section_decision_reasons',
  trash: 'permission_section_trash',
  vat: 'permission_section_vat',
  contract_templates: 'permission_section_contract_templates',
  states: 'permission_section_states',
  cities: 'permission_section_cities',
  locations: 'permission_section_locations',
  sales_details: 'permission_section_sales_details',
  total_sales: 'permission_section_total_sales',
  tasks_progress: 'permission_section_tasks_progress',
  contracts_completion: 'permission_section_contracts_completion',
  tasks_details: 'permission_section_tasks_details',
  summary_tasks_visits: 'permission_section_summary_tasks_visits',
  bond_report: 'permission_section_bond_report',
  clients_info: 'permission_section_clients_info',
  client_visit: 'permission_section_client_visit',
  cars_expenses: 'permission_section_cars_expenses',
  contracts_report: 'permission_section_contracts_report',
  delegate_report: 'permission_section_delegate_report',
};

// Translation key mappings for actions
const actionTranslationKeys: Record<string, string> = {
  view: 'permission_action_view',
  create: 'permission_action_create',
  update: 'permission_action_update',
  delete: 'permission_action_delete',
  change_status: 'permission_action_change_status',
  change_password: 'permission_action_change_password',
  restructure: 'permission_action_restructure',
  assign: 'permission_action_assign',
  delegate_warehouse: 'permission_action_delegate_warehouse',
  print: 'permission_action_print',
  decline: 'permission_action_decline',
  cancel: 'permission_action_cancel',
  done: 'permission_action_done',
  activate: 'permission_action_activate',
  accept: 'permission_action_accept',
  reject: 'permission_action_reject',
  force_delete: 'permission_action_force_delete',
  restore: 'permission_action_restore',
  transfer: 'permission_action_transfer',
  export: 'permission_action_export',
};

const getModuleTranslationKey = (moduleId: string) =>
  moduleTranslationKeys[moduleId];

const getSectionTranslationKey = (sectionId: string) =>
  sectionTranslationKeys[sectionId];

const getActionTranslationKey = (actionId: string) =>
  actionTranslationKeys[actionId];

const normalizePermissionEntry = (
  moduleId: string,
  sectionId: string,
  actionId: string,
  value: unknown
): RolePermissionDto | null => {
  if (value == null) return null;

  const translationKey = getActionTranslationKey(actionId);

  if (typeof value === 'number' || typeof value === 'string') {
    return {
      id: String(value),
      key: actionId,
      module: moduleId,
      group: sectionId,
      label: translationKey,
    };
  }

  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    const itemId = item.id ?? item.value ?? item.permission_id;

    if (itemId == null) return null;

    return {
      id: String(itemId),
      key: String(item.key ?? actionId),
      module: String(item.module ?? moduleId),
      group: String(item.group ?? sectionId),
      label: translationKey ?? String(item.label ?? item.title ?? item.name),
      title: typeof item.title === 'string' ? item.title : undefined,
      name: typeof item.name === 'string' ? item.name : undefined,
    };
  }

  return null;
};

const normalizePermissionSections = (
  moduleId: string,
  moduleValue: Record<string, unknown>
): RolePermissionSectionDto[] => {
  return Object.entries(moduleValue)
    .map(([sectionId, sectionValue]) => {
      if (
        !sectionValue ||
        typeof sectionValue !== 'object' ||
        Array.isArray(sectionValue)
      ) {
        const normalized = normalizePermissionEntry(
          moduleId,
          'global',
          sectionId,
          sectionValue
        );

        const sectionTranslationKey = getSectionTranslationKey('global');

        return normalized
          ? {
              id: 'global',
              label: sectionTranslationKey,
              permissions: [normalized],
            }
          : null;
      }

      const permissions = Object.entries(
        sectionValue as Record<string, unknown>
      )
        .map(([actionId, actionValue]) =>
          normalizePermissionEntry(moduleId, sectionId, actionId, actionValue)
        )
        .filter((item): item is RolePermissionDto => Boolean(item));

      if (!permissions.length) return null;

      const sectionTranslationKey = getSectionTranslationKey(sectionId);

      return {
        id: sectionId,
        label: sectionTranslationKey,
        permissions,
      };
    })
    .filter((section): section is RolePermissionSectionDto => Boolean(section));
};

const normalizePermissionGroupObject = (
  moduleId: string,
  moduleValue: Record<string, unknown>
): RolePermissionGroupDto => {
  const sections = normalizePermissionSections(moduleId, moduleValue);
  const moduleTranslationKey = getModuleTranslationKey(moduleId);

  return {
    id: moduleId,
    label: moduleTranslationKey,
    sections,
    permissions: sections.flatMap((section) => section.permissions),
  };
};

export const normalizeRolePermissionGroups = (
  payload: unknown
): RolePermissionGroupDto[] => {
  const source =
    payload && typeof payload === 'object'
      ? ((payload as { data?: unknown; result?: unknown }).data ??
        (payload as { data?: unknown; result?: unknown }).result ??
        payload)
      : payload;

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [];
  }

  return Object.entries(source as Record<string, unknown>)
    .map(([moduleId, moduleValue]) => {
      if (
        !moduleValue ||
        typeof moduleValue !== 'object' ||
        Array.isArray(moduleValue)
      ) {
        return null;
      }

      return normalizePermissionGroupObject(
        moduleId,
        moduleValue as Record<string, unknown>
      );
    })
    .filter((group): group is RolePermissionGroupDto =>
      Boolean(group && group.permissions.length)
    );
};

export const normalizeRolePermissionIds = (payload: unknown): string[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload.flatMap((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return [String(item)];
      }

      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        if (record.id != null) {
          return [String(record.id)];
        }
      }

      return [];
    });
  }

  if (typeof payload === 'object') {
    return Object.values(payload as Record<string, unknown>).flatMap((value) =>
      normalizeRolePermissionIds(value)
    );
  }

  if (typeof payload === 'string' || typeof payload === 'number') {
    return [String(payload)];
  }

  return [];
};
