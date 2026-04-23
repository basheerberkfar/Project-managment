import {
  Gear,
  House,
  Package,
  UsersThree,
  PencilSimpleLine,
  Trash,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import BreadCrumb from '@/components/common/breadCrumb';
import { SecondaryButton, PrimaryButton } from '@/components/ui/button';
import SectionCard from '@/components/ui/section-card';
import Checkbox from '@/components/ui/checkbox';
import DeleteModal from '@/components/common/delete-modal';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { RoleViewSkeleton } from '@/features/roles/components/role-view-skeleton';
import { useToast } from '@/components/ui/toast';
import {
  normalizeRolePermissionIds,
  useRolePermissionsQuery,
  useRoleQuery,
  useDeleteRoleMutation,
  type RolePermissionDto,
  type RolePermissionGroupDto,
  type RolePermissionSectionDto,
} from '@/features/roles/service';
import {
  decodeRouteId,
  encodeRouteId,
  getApiErrorMessage,
  getApiSuccessMessage,
} from '@/utils/helpers';
import { hasPermission } from '@/utils/permissions';

const moduleIcons = {
  dashboard: <House size={16} />,
  users: <UsersThree size={16} />,
  roles: <Gear size={16} />,
  products: <Package size={16} />,
} as const;

// Modules that should not display icons
const modulesWithoutIcons = new Set([
  'types',
  'settings',
  'product_types',
  'product_units',
  'contract_types',
  'bill_types',
  'bond_types',
  'task_types',
  'car_log_types',
]);

export default function RoleViewPage() {
  const { t } = useTranslation('usersRoles');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeModuleId, setActiveModuleId] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const decodedId = decodeRouteId(routeId);

  const { data: role, isLoading } = useRoleQuery(decodedId);
  const { data: permissionGroups = [], isLoading: isPermissionsLoading } =
    useRolePermissionsQuery();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();
  const canEdit = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.update
  );
  const canDelete = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.delete
  );
  const resolvePermissionText = (value?: string) =>
    value ? t(value, { defaultValue: value }) : '';

  const selectedPermissions = useMemo(
    () => normalizeRolePermissionIds(role?.permissions),
    [role?.permissions]
  );

  const resolvedActiveModuleId =
    activeModuleId &&
    permissionGroups.some((group) => group.id === activeModuleId)
      ? activeModuleId
      : (permissionGroups[0]?.id ?? '');

  const activeGroup =
    permissionGroups.find((group) => group.id === resolvedActiveModuleId) ??
    permissionGroups[0];

  const selectedCountByGroup = useMemo(() => {
    return Object.fromEntries(
      permissionGroups.map((group) => [
        group.id,
        group.permissions.filter((permission) =>
          selectedPermissions.includes(permission.id)
        ).length,
      ])
    );
  }, [permissionGroups, selectedPermissions]);

  if (isLoading || isPermissionsLoading) {
    return <RoleViewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb
        sticky
        items={[
          { label: t('users_roles'), link: '/users-roles/roles' },
          { label: t('roles_list'), link: '/users-roles/roles' },
          { label: role?.title ?? t('role_details') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canDelete && (
              <SecondaryButton
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="h-10 w-10 px-0"
                title={t('delete')}
              >
                <Trash size={18} />
              </SecondaryButton>
            )}

            {canEdit && (
              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(`/users-roles/roles/${encodeRouteId(decodedId)}`)
                }
                className="h-10 w-10 px-0"
                title={t('edit')}
              >
                <PencilSimpleLine size={18} />
              </PrimaryButton>
            )}
          </div>
        }
      />

      <SectionCard title={t('role_information')}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('role_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {role?.title ?? role?.name ?? '-'}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t('permissions')}>
        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-4 xl:items-start">
          <div className="rounded-xl border border-light-card-border dark:border-dark-card-border bg-white dark:bg-dark-card-background p-4 xl:max-h-[680px] xl:overflow-hidden">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-light-card-border dark:border-dark-card-border bg-gray-light-100 dark:bg-dark-card-surface px-3 py-2.5">
              <span className="text-sm font-semibold text-gray-light-900 dark:text-dark-primary">
                {t('all')}
              </span>
              <Checkbox checked onChange={() => undefined} disabled />
            </div>

            <h4 className="mb-4 text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
              {t('modules')}
            </h4>

            <div className="space-y-2 xl:max-h-[560px] xl:overflow-y-auto xl:pe-1">
              {permissionGroups.map((group: RolePermissionGroupDto) => {
                const totalCount = group.permissions.length;
                const selectedCount = selectedCountByGroup[group.id] ?? 0;
                const badgeLabel =
                  totalCount > 0 && selectedCount === totalCount
                    ? t('all')
                    : String(selectedCount);

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveModuleId(group.id)}
                    className={clsx(
                      'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors',
                      'flex items-center justify-between gap-3',
                      resolvedActiveModuleId === group.id
                        ? 'border-focus-primary bg-primary-dark-800 text-white'
                        : 'border-transparent bg-white text-gray-light-800 hover:bg-gray-light-100 dark:bg-dark-card-background dark:text-gray-dark-200 dark:hover:bg-dark-card-surface'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {!modulesWithoutIcons.has(group.id) &&
                        (moduleIcons[group.id as keyof typeof moduleIcons] ?? (
                          <Gear size={16} />
                        ))}
                      <span>{resolvePermissionText(group.label)}</span>
                    </span>

                    <span
                      className={clsx(
                        'rounded-full px-2 py-0.5 text-xs',
                        resolvedActiveModuleId === group.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-light-100 text-gray-light-700 dark:bg-dark-card-surface dark:text-gray-dark-200'
                      )}
                    >
                      {badgeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-light-card-border dark:border-dark-card-border bg-white dark:bg-dark-card-background p-4 xl:max-h-[680px] xl:overflow-hidden">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
                {activeGroup
                  ? resolvePermissionText(activeGroup.label)
                  : t('permissions')}
              </h4>
            </div>

            <div className="space-y-4 xl:max-h-[560px] xl:overflow-y-auto xl:pe-1">
              <div className="overflow-hidden rounded-xl border border-light-card-border dark:border-dark-card-border">
                <div className="grid grid-cols-[56px_minmax(0,1fr)] bg-gray-light-100 dark:bg-dark-card-surface">
                  <div className="flex items-center justify-center py-3">
                    <Checkbox checked onChange={() => undefined} disabled />
                  </div>

                  <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-light-800 dark:text-dark-primary">
                    {t('permission_name')}
                  </div>
                </div>
              </div>

              {activeGroup?.sections.map(
                (section: RolePermissionSectionDto) => (
                  <div
                    key={section.id}
                    className="overflow-hidden rounded-xl border border-light-card-border dark:border-dark-card-border"
                  >
                    <div className="px-4 py-3 flex items-center justify-between gap-3 text-sm font-semibold text-primary-light-700 dark:text-primary-dark-300 bg-gray-light-100 dark:bg-dark-card-surface border-b border-light-card-border dark:border-dark-card-border">
                      <span>{resolvePermissionText(section.label)}</span>
                      <Checkbox
                        checked={section.permissions.every((permission) =>
                          selectedPermissions.includes(permission.id)
                        )}
                        indeterminate={
                          section.permissions.some((permission) =>
                            selectedPermissions.includes(permission.id)
                          ) &&
                          !section.permissions.every((permission) =>
                            selectedPermissions.includes(permission.id)
                          )
                        }
                        onChange={() => undefined}
                        disabled
                      />
                    </div>

                    {section.permissions.map(
                      (permission: RolePermissionDto, index: number) => {
                        const isSelected = selectedPermissions.includes(
                          permission.id
                        );

                        return (
                          <div
                            key={permission.id}
                            className={clsx(
                              'grid grid-cols-[56px_minmax(0,1fr)] bg-white dark:bg-dark-card-background',
                              index !== section.permissions.length - 1 &&
                                'border-b border-light-card-border dark:border-dark-card-border',
                              isSelected &&
                                'bg-primary-dark-50 dark:bg-dark-card-surface'
                            )}
                          >
                            <div className="flex items-center justify-center py-3">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => undefined}
                                disabled
                              />
                            </div>

                            <div className="flex items-center px-4 py-3 text-sm text-gray-light-900 dark:text-gray-dark-100">
                              {resolvePermissionText(permission.label)}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <DeleteModal
        open={canDelete && isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('delete_role_title')}
        deleteMessage={t('delete_role_message', {
          name: role?.title ?? role?.name,
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!decodedId) return;

          deleteRole(decodedId, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('success'),
                description: getApiSuccessMessage(response, t('role_deleted')),
              });
              setIsDeleteOpen(false);
              navigate('/users-roles/roles');
            },
            onError: (error) => {
              showToast({
                variant: 'danger',
                title: t('error'),
                description: getApiErrorMessage(error, t('operation_failed')),
              });
            },
          });
        }}
      />
    </div>
  );
}
