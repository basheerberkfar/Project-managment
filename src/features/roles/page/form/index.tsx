import { Gear, House, Package, UsersThree } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import FormPageContainer from '@/components/common/form-page-container';
import SectionCard from '@/components/ui/section-card';
import FormInput from '@/components/ui/formInput';
import Checkbox from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import RolePageActions from '@/features/roles/components/role-page-actions';
import { RoleFormSkeleton } from '@/features/roles/components/role-form-skeleton';
import { decodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { getRoleSchema } from './schema';
import {
  normalizeRolePermissionIds,
  useCreateRoleMutation,
  useRolePermissionsQuery,
  useRoleQuery,
  useUpdateRoleMutation,
  type CreateRoleDto,
  type RoleFormValues,
  type RolePermissionDto,
  type RolePermissionGroupDto,
  type RolePermissionSectionDto,
  type UpdateRoleDto,
} from '@/features/roles/service';

const moduleIcons = {
  dashboard: <House size={16} />,
  users: <UsersThree size={16} />,
  roles: <Gear size={16} />,
  products: <Package size={16} />,
} as const;

export default function RoleFormPage() {
  const { t } = useTranslation('usersRoles');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(routeId && routeId !== 'create');
  const decodedId = isEdit ? decodeRouteId(routeId) : '';
  const [activeModuleId, setActiveModuleId] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');
  const { data: role, isLoading } = useRoleQuery(decodedId);
  const { data: permissionGroups = [], isLoading: isPermissionsLoading } =
    useRolePermissionsQuery();
  const { mutateAsync: createRole, isPending: isCreating } =
    useCreateRoleMutation();
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useUpdateRoleMutation();
  const schema = useMemo(() => getRoleSchema(t), [t]);
  const resolvePermissionText = useCallback(
    (value?: string) => (value ? t(value, { defaultValue: value }) : ''),
    [t]
  );

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    trigger,
    formState: { isDirty, isValid },
  } = useForm<RoleFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      permissions_ids: [],
    },
  });

  useEffect(() => {
    if (!role) return;
    reset({
      name: role.name ?? '',
      permissions_ids: normalizeRolePermissionIds(role.permissions),
    });
  }, [reset, role]);

  useEffect(() => {
    if (isLoading || isPermissionsLoading) return;
    void trigger(['name', 'permissions_ids']);
  }, [isLoading, isPermissionsLoading, trigger]);

  const selectedPermissions = useWatch({
    control,
    name: 'permissions_ids',
    defaultValue: [],
  });

  const resolvedActiveModuleId =
    activeModuleId &&
    permissionGroups.some((group) => group.id === activeModuleId)
      ? activeModuleId
      : (permissionGroups[0]?.id ?? '');

  const activeGroup =
    permissionGroups.find((group) => group.id === resolvedActiveModuleId) ??
    permissionGroups[0];

  const visibleSections = useMemo(() => {
    const term = permissionSearch.trim().toLowerCase();
    if (!activeGroup) return [];
    if (!term) return activeGroup.sections;

    return activeGroup.sections
      .map((section) => ({
        ...section,
        permissions: section.permissions.filter((permission) =>
          resolvePermissionText(
            permission.label ?? permission.name ?? permission.title
          )
            .toLowerCase()
            .includes(term)
        ),
      }))
      .filter((section) => section.permissions.length > 0);
  }, [activeGroup, permissionSearch, resolvePermissionText]);

  const visiblePermissions = useMemo(
    () => visibleSections.flatMap((section) => section.permissions),
    [visibleSections]
  );

  const allPermissions = useMemo(
    () =>
      permissionGroups.flatMap((group) =>
        group.permissions.map((permission) => permission.id)
      ),
    [permissionGroups]
  );

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

  const allVisibleChecked =
    visiblePermissions.length > 0 &&
    visiblePermissions.every((permission) =>
      selectedPermissions.includes(permission.id)
    );
  const someVisibleChecked =
    visiblePermissions.some((permission) =>
      selectedPermissions.includes(permission.id)
    ) && !allVisibleChecked;

  const togglePermission = (permissionId: string) => {
    const nextPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((item) => item !== permissionId)
      : [...selectedPermissions, permissionId];

    setValue('permissions_ids', nextPermissions, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextPermissions.length > 0) {
      clearErrors('permissions_ids');
    }
  };

  const toggleVisiblePermissions = (checked: boolean) => {
    const visibleIds = visiblePermissions.map((permission) => permission.id);
    const nextPermissions = checked
      ? Array.from(new Set([...selectedPermissions, ...visibleIds]))
      : selectedPermissions.filter((item) => !visibleIds.includes(item));

    setValue('permissions_ids', nextPermissions, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextPermissions.length > 0) {
      clearErrors('permissions_ids');
    }
  };

  const toggleSectionPermissions = (
    permissionIds: string[],
    checked: boolean
  ) => {
    const nextPermissions = checked
      ? Array.from(new Set([...selectedPermissions, ...permissionIds]))
      : selectedPermissions.filter((item) => !permissionIds.includes(item));

    setValue('permissions_ids', nextPermissions, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextPermissions.length > 0) {
      clearErrors('permissions_ids');
    }
  };

  const toggleAllPermissions = (checked: boolean) => {
    const nextPermissions = checked ? Array.from(new Set(allPermissions)) : [];

    setValue('permissions_ids', nextPermissions, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextPermissions.length > 0) {
      clearErrors('permissions_ids');
    }
  };

  const onSubmit = async (values: RoleFormValues) => {
    const payload: CreateRoleDto = {
      name: values.name,
      permission_ids: values.permissions_ids,
    };

    try {
      let response;

      if (isEdit && decodedId) {
        response = await updateRole({
          id: decodedId,
          data: payload as UpdateRoleDto,
        });
      } else {
        response = await createRole(payload);
      }

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('role_saved')),
      });
      navigate('/users-roles/roles');
    } catch (error: unknown) {
      handleFormErrors<RoleFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
          permissions_ids: 'permissions_ids',
        },
        toast: (message) =>
          showToast({
            variant: 'danger',
            title: t('error'),
            description: message,
          }),
        fallbackMessage: t('operation_failed'),
      });
    }
  };

  if (isLoading || isPermissionsLoading) {
    return <RoleFormSkeleton />;
  }

  return (
    <FormPageContainer onSubmit={handleSubmit(onSubmit)}>
      <RolePageActions
        isEdit={isEdit}
        onCancel={() => navigate('/users-roles/roles')}
        onSubmit={handleSubmit(onSubmit)}
        saveDisabled={!isValid || !isDirty || isCreating || isUpdating}
      />

      <>
        <SectionCard title={t('role_information')}>
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              name="name"
              control={control}
              label={t('role_name')}
              placeholder={t('enter_role_name')}
              rules={{ required: t('role_name_required') }}
              required
            />
          </div>
        </SectionCard>

        <SectionCard title={t('permissions')}>
          <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-4 xl:items-start">
            <div className="rounded-xl border border-light-card-border dark:border-dark-card-border bg-white dark:bg-dark-card-background p-4 xl:max-h-[680px] xl:overflow-hidden">
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-light-card-border dark:border-dark-card-border bg-gray-light-100 dark:bg-dark-card-surface px-3 py-2.5">
                <span className="text-sm font-semibold text-gray-light-900 dark:text-dark-primary">
                  {t('all')}
                </span>
                <Checkbox
                  checked={
                    allPermissions.length > 0 &&
                    allPermissions.every((permissionId) =>
                      selectedPermissions.includes(permissionId)
                    )
                  }
                  indeterminate={
                    selectedPermissions.length > 0 &&
                    !allPermissions.every((permissionId) =>
                      selectedPermissions.includes(permissionId)
                    )
                  }
                  onChange={toggleAllPermissions}
                />
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
                        {moduleIcons[group.id as keyof typeof moduleIcons] ?? (
                          <Gear size={16} />
                        )}
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
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
                  {resolvePermissionText(activeGroup?.label) ||
                    t('permissions')}
                </h4>

                <input
                  type="text"
                  value={permissionSearch}
                  onChange={(event) => setPermissionSearch(event.target.value)}
                  placeholder={t('search')}
                  className="h-[42px] w-full rounded-lg border border-light-card-border bg-white px-3 text-sm text-gray-light-900 outline-none transition-colors placeholder:text-gray-light-700 focus:border-focus-primary sm:w-[220px] dark:border-dark-card-border dark:bg-dark-card-surface dark:text-dark-primary"
                />
              </div>

              <div className="space-y-4 xl:max-h-[560px] xl:overflow-y-auto xl:pe-1">
                <div className="overflow-hidden rounded-xl border border-light-card-border dark:border-dark-card-border">
                  <div className="grid grid-cols-[56px_minmax(0,1fr)] bg-gray-light-100 dark:bg-dark-card-surface">
                    <div className="flex items-center justify-center py-3">
                      <Checkbox
                        checked={allVisibleChecked}
                        indeterminate={someVisibleChecked}
                        onChange={toggleVisiblePermissions}
                      />
                    </div>

                    <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-light-800 dark:text-dark-primary">
                      {t('permission_name')}
                    </div>
                  </div>
                </div>

                {visibleSections.length ? (
                  visibleSections.map((section: RolePermissionSectionDto) => (
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
                          onChange={(checked) =>
                            toggleSectionPermissions(
                              section.permissions.map(
                                (permission) => permission.id
                              ),
                              checked
                            )
                          }
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
                                  onChange={() =>
                                    togglePermission(permission.id)
                                  }
                                />
                              </div>

                              <div className="flex items-center px-4 py-3 text-sm text-gray-light-900 dark:text-gray-dark-100">
                                {resolvePermissionText(
                                  permission.label ??
                                    permission.name ??
                                    permission.title
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-light-card-border dark:border-dark-card-border px-4 py-6 text-sm text-gray-light-700 dark:text-gray-dark-200">
                    {t('no_permissions_found')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </>
    </FormPageContainer>
  );
}
