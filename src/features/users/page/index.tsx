import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import AsyncSelectInput from '@/components/ui/select/async-select';
import { useToast } from '@/components/ui/toast';
import { PAGE_SIZE_OPTIONS, USERS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { useDepartments } from '@/hooks/use-departments';
import { useJobTitles } from '@/hooks/use-job-titles';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { encodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import ChangePasswordModal from '../components/change-password-modal';
import { useUsersTableColumns } from '../hooks/use-users-table-columns';
import {
  useDeleteUserMutation,
  useUsersQuery,
  type UserDto,
} from '../service';

type UserFiltersFormValues = {
  isActive: SelectOption | null;
  department: SelectOption | null;
  jobTitle: SelectOption | null;
};

const STATUS_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

function sortUsers(
  users: UserDto[],
  sort?: { columnId: string; direction: 'asc' | 'desc' }
) {
  if (!sort) return users;

  const sorted = [...users].sort((left, right) => {
    const getValue = (user: UserDto) => {
      switch (sort.columnId) {
        case 'department':
          return user.department?.name ?? user.departmentName ?? '';
        case 'jobTitle':
          return user.jobTitle?.name ?? user.jobTitleName ?? '';
        default:
          return String((user as Record<string, unknown>)[sort.columnId] ?? '');
      }
    };

    return getValue(left).localeCompare(getValue(right), undefined, {
      numeric: true,
    });
  });

  return sort.direction === 'desc' ? sorted.reverse() : sorted;
}

export default function UsersListPage() {
  const { t } = useTranslation('usersRoles');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { fetchDepartments } = useDepartments();
  const { fetchJobTitles } = useJobTitles();
  const { pagination, search, sort, setTablePageSettings } =
    usePageTableSettings(USERS_TABLE_KEY, { defaultPageSize: 10 });
  const [searchValue, setSearchValue] = useState(
    typeof search.Search === 'string' ? search.Search : ''
  );
  const [pageIndex, setPageIndex] = useState(pagination.pageIndex);
  const [pageSize, setPageSize] = useState(pagination.pageSize);
  const [sortState, setSortState] = useState(
    sort && 'columnId' in sort && 'direction' in sort ? sort : undefined
  );
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(
    typeof search.IsActive === 'string'
      ? search.IsActive === 'true'
      : typeof search.IsActive === 'boolean'
        ? search.IsActive
        : null
  );
  const [departmentOption, setDepartmentOption] = useState<SelectOption | null>(
    search.department &&
      typeof search.department === 'object' &&
      'label' in search.department &&
      'value' in search.department
      ? (search.department as SelectOption)
      : null
  );
  const [jobTitleOption, setJobTitleOption] = useState<SelectOption | null>(
    search.jobTitle &&
      typeof search.jobTitle === 'object' &&
      'label' in search.jobTitle &&
      'value' in search.jobTitle
      ? (search.jobTitle as SelectOption)
      : null
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserDto | null>(null);
  const debouncedSearch = useDebounce(searchValue, 500);
  const canViewUsers = hasPermission(
    PERMISSION_GROUPS.users,
    PERMISSION_ACTIONS.view
  );

  const { control, handleSubmit, reset, setValue } =
    useForm<UserFiltersFormValues>({
      defaultValues: {
        isActive:
          isActiveFilter == null
            ? null
            : STATUS_OPTIONS.find(
                (option) => String(isActiveFilter) === option.value
              ) ?? null,
        department: departmentOption,
        jobTitle: jobTitleOption,
      },
    });
  const watchedDepartment = useWatch({ control, name: 'department' });
  const watchedJobTitle = useWatch({ control, name: 'jobTitle' });

  useEffect(() => {
    setTablePageSettings(USERS_TABLE_KEY, {
      search: {
        ...(searchValue.trim() ? { Search: searchValue.trim() } : {}),
        ...(isActiveFilter == null ? {} : { IsActive: String(isActiveFilter) }),
        ...(departmentOption?.value
          ? {
              DepartmentId: departmentOption.value,
              department: departmentOption,
            }
          : {}),
        ...(jobTitleOption?.value
          ? {
              JobTitleId: jobTitleOption.value,
              jobTitle: jobTitleOption,
            }
          : {}),
      },
      pagination: {
        pageIndex,
        pageSize,
      },
      sort: sortState,
    });
  }, [
    departmentOption,
    isActiveFilter,
    jobTitleOption,
    pageIndex,
    pageSize,
    searchValue,
    setTablePageSettings,
    sortState,
  ]);

  const { data, isLoading } = useUsersQuery({
    page: pageIndex,
    pageSize,
    Search: debouncedSearch || undefined,
    IsActive: isActiveFilter == null ? undefined : isActiveFilter,
    DepartmentId: departmentOption?.value || undefined,
    JobTitleId: jobTitleOption?.value || undefined,
    sort: sortState?.columnId,
    order: sortState?.direction,
  });
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation();

  const displayedUsers = useMemo(
    () => sortUsers(data?.items ?? [], sortState),
    [data?.items, sortState]
  );
  const totalCount = data?.pagination.totalCount ?? displayedUsers.length;

  const tableColumns = useUsersTableColumns({
    onView: (user) =>
      navigate(`/users-roles/users/${encodeRouteId(user.id)}/display`),
    onEdit: (user) => navigate(`/users-roles/users/${encodeRouteId(user.id)}`),
    onDelete: setSelectedUser,
    onChangePassword: setPasswordUser,
  });

  const activeFilters = useMemo(() => {
    const filters: { id: string; label: string; value: string }[] = [];

    if (isActiveFilter != null) {
      filters.push({
        id: 'isActive',
        label: t('status'),
        value: isActiveFilter ? t('active') : t('inactive'),
      });
    }

    if (departmentOption) {
      filters.push({
        id: 'department',
        label: t('department'),
        value: departmentOption.label,
      });
    }

    if (jobTitleOption) {
      filters.push({
        id: 'jobTitle',
        label: t('job_title'),
        value: jobTitleOption.label,
      });
    }

    return filters;
  }, [departmentOption, isActiveFilter, jobTitleOption, t]);

  const syncFilterForm = () => {
    setValue(
      'isActive',
      isActiveFilter == null
        ? null
        : STATUS_OPTIONS.find((option) => option.value === String(isActiveFilter)) ??
            null
    );
    setValue('department', departmentOption);
    setValue('jobTitle', jobTitleOption);
  };

  const handleApplyFilter = handleSubmit((values) => {
    const nextIsActive =
      values.isActive == null ? null : values.isActive.value === 'true';

    setIsActiveFilter(nextIsActive);
    setDepartmentOption(values.department);
    setJobTitleOption(values.jobTitle);
    setPageIndex(1);
  });

  const handleResetFilter = () => {
    reset({
      isActive: null,
      department: null,
      jobTitle: null,
    });
    setIsActiveFilter(null);
    setDepartmentOption(null);
    setJobTitleOption(null);
    setSearchValue('');
    setPageIndex(1);
  };

  const handleRemoveFilter = (filterId: string) => {
    if (filterId === 'department') {
      setDepartmentOption(null);
      setValue('department', null);
    }
    if (filterId === 'jobTitle') {
      setJobTitleOption(null);
      setValue('jobTitle', null);
    }
    if (filterId === 'isActive') {
      setIsActiveFilter(null);
      setValue('isActive', null);
    }
    setPageIndex(1);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <TableActions
        onChange={(event) => {
          setSearchValue(event.target.value);
          setPageIndex(1);
        }}
        value={searchValue}
        searchPlaceholder={t('search_users')}
        handleReset={handleResetFilter}
        handleFilter={handleApplyFilter}
        onFilterOpen={syncFilterForm}
        handleSettingReset={tableColumns.handleSettingReset}
        handelApply={tableColumns.handleApplySettings}
        columns={tableColumns.columnsConfig}
        defaultColumns={tableColumns.defaultColumnsConfig}
        setColumns={tableColumns.setColumnsConfig}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearSearch={() => {
          setSearchValue('');
          setPageIndex(1);
        }}
        primaryButton={
          <Can
            group={PERMISSION_GROUPS.users}
            action={PERMISSION_ACTIONS.create}
          >
            <PrimaryButton onClick={() => navigate('/users-roles/users/create')}>
              {t('add_user')}
            </PrimaryButton>
          </Can>
        }
      >
        <div className="flex flex-col gap-4">
          <SelectInput
            name="isActive"
            control={control as never}
            label={t('is_active')}
            options={[
              { label: t('active'), value: 'true' },
              { label: t('inactive'), value: 'false' },
            ]}
            placeholder={t('all_statuses')}
          />
          <AsyncSelectInput
            name="department"
            control={control as never}
            label={t('department')}
            placeholder={t('select_department')}
            fetchOptions={fetchDepartments}
            valueOption={watchedDepartment ?? undefined}
          />
          <AsyncSelectInput
            name="jobTitle"
            control={control as never}
            label={t('job_title')}
            placeholder={t('select_job_title')}
            fetchOptions={fetchJobTitles}
            valueOption={watchedJobTitle ?? undefined}
          />
        </div>
      </TableActions>

      <Table
        data={displayedUsers}
        columns={tableColumns.columns}
        actionsColumn={{
          header: t('common:actions'),
          actions: tableColumns.userTableActions,
          checkPermission: (permission) =>
            hasPermissionKey(permission, PERMISSION_GROUPS.users),
          maxIcons: 3,
        }}
        isLoading={isLoading}
        sort={sortState}
        onSort={(columnId, direction) => setSortState({ columnId, direction })}
        handelRowClick={(row) =>
          canViewUsers
            ? navigate(`/users-roles/users/${encodeRouteId(row.id)}/display`)
            : undefined
        }
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: setPageIndex,
          onPageSizeChange: (value) => {
            setPageSize(value);
            setPageIndex(1);
          },
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        }}
      />

      <DeleteModal
        open={Boolean(selectedUser)}
        setOpen={(open) => {
          if (!open) {
            setSelectedUser(null);
          }
        }}
        title={t('delete_user_title')}
        deleteMessage={t('delete_user_message', {
          name: selectedUser?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!selectedUser) return;

          deleteUser(selectedUser.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('user_deleted')),
              });
              setSelectedUser(null);
            },
          });
        }}
      />

      <ChangePasswordModal
        open={Boolean(passwordUser)}
        setOpen={(open) => {
          if (!open) setPasswordUser(null);
        }}
        userId={passwordUser?.id ?? null}
      />
    </div>
  );
}
