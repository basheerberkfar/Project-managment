import { Gear } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Checkbox from '@/components/ui/checkbox';
import SectionCard from '@/components/ui/section-card';
import type {
  RolePermissionDto,
  RolePermissionGroupDto,
  RolePermissionSectionDto,
} from '@/features/roles/service';

type RolePermissionsSectionProps = {
  groups: RolePermissionGroupDto[];
  selectedPermissions: string[];
  onChange?: (permissionIds: string[]) => void;
  readOnly?: boolean;
  isLoading?: boolean;
};

export default function RolePermissionsSection({
  groups,
  selectedPermissions,
  onChange,
  readOnly = false,
}: RolePermissionsSectionProps) {
  const { t } = useTranslation('usersRoles');
  const [activeModuleId, setActiveModuleId] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');

  const resolvePermissionText = (value?: string) =>
    value ? t(value, { defaultValue: value }) : '';

  const resolvedActiveModuleId =
    activeModuleId && groups.some((group) => group.id === activeModuleId)
      ? activeModuleId
      : (groups[0]?.id ?? '');

  const activeGroup =
    groups.find((group) => group.id === resolvedActiveModuleId) ?? groups[0];

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
  }, [activeGroup, permissionSearch]);

  const visiblePermissions = useMemo(
    () => visibleSections.flatMap((section) => section.permissions),
    [visibleSections]
  );

  const allPermissions = useMemo(
    () => groups.flatMap((group) => group.permissions.map((item) => item.id)),
    [groups]
  );

  const selectedCountByGroup = useMemo(
    () =>
      Object.fromEntries(
        groups.map((group) => [
          group.id,
          group.permissions.filter((permission) =>
            selectedPermissions.includes(permission.id)
          ).length,
        ])
      ),
    [groups, selectedPermissions]
  );

  const allVisibleChecked =
    visiblePermissions.length > 0 &&
    visiblePermissions.every((permission) =>
      selectedPermissions.includes(permission.id)
    );
  const someVisibleChecked =
    visiblePermissions.some((permission) =>
      selectedPermissions.includes(permission.id)
    ) && !allVisibleChecked;

  const updatePermissions = (nextPermissions: string[]) => {
    if (readOnly || !onChange) return;
    onChange(Array.from(new Set(nextPermissions)));
  };

  const togglePermission = (permissionId: string) => {
    const nextPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((item) => item !== permissionId)
      : [...selectedPermissions, permissionId];

    updatePermissions(nextPermissions);
  };

  const toggleVisiblePermissions = (checked: boolean) => {
    const visibleIds = visiblePermissions.map((permission) => permission.id);
    const nextPermissions = checked
      ? Array.from(new Set([...selectedPermissions, ...visibleIds]))
      : selectedPermissions.filter((item) => !visibleIds.includes(item));

    updatePermissions(nextPermissions);
  };

  const toggleSectionPermissions = (
    permissionIds: string[],
    checked: boolean
  ) => {
    const nextPermissions = checked
      ? Array.from(new Set([...selectedPermissions, ...permissionIds]))
      : selectedPermissions.filter((item) => !permissionIds.includes(item));

    updatePermissions(nextPermissions);
  };

  const toggleAllPermissions = (checked: boolean) => {
    updatePermissions(checked ? allPermissions : []);
  };

  return (
    <SectionCard title={t('permissions')}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
        <div className="rounded-xl border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background xl:max-h-[680px] xl:overflow-hidden">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-light-card-border bg-gray-light-100 px-3 py-2.5 dark:border-dark-card-border dark:bg-dark-card-surface">
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
              disabled={readOnly}
            />
          </div>

          <h4 className="mb-4 text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
            {t('modules')}
          </h4>

          <div className="space-y-2 xl:max-h-[560px] xl:overflow-y-auto xl:pe-1">
            {groups.map((group: RolePermissionGroupDto) => {
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
                    <Gear size={16} />
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

        <div className="rounded-xl border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background xl:max-h-[680px] xl:overflow-hidden">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
              {resolvePermissionText(activeGroup?.label) || t('permissions')}
            </h4>

            <input
              type="text"
              value={permissionSearch}
              onChange={(event) => setPermissionSearch(event.target.value)}
              placeholder={t('search_permissions')}
              className="h-[42px] w-full rounded-lg border border-light-card-border bg-white px-3 text-sm text-gray-light-900 outline-none transition-colors placeholder:text-gray-light-700 focus:border-focus-primary dark:border-dark-card-border dark:bg-dark-card-surface dark:text-dark-primary sm:w-[220px]"
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
                    disabled={readOnly}
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
                  <div className="flex items-center justify-between gap-3 border-b border-light-card-border bg-gray-light-100 px-4 py-3 text-sm font-semibold text-primary-light-700 dark:border-dark-card-border dark:bg-dark-card-surface dark:text-primary-dark-300">
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
                          section.permissions.map((permission) => permission.id),
                          checked
                        )
                      }
                      disabled={readOnly}
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
                              onChange={() => togglePermission(permission.id)}
                              disabled={readOnly}
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
              <div className="rounded-xl border border-light-card-border px-4 py-6 text-sm text-gray-light-700 dark:border-dark-card-border dark:text-gray-dark-200">
                {t('no_permissions_found')}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
