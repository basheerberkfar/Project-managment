/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import { PAGE_SIZE_OPTIONS, ROLES_TABLE_KEY } from '@/constants/constants';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { encodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { useRolesTableColumns } from '../hooks/use-roles-table-columns';
import { useDeleteRoleMutation, useRolesQuery, type RoleDto } from '../service';
import { rolesListActionNames } from './state/action-names';
import { rolesListInitialState } from './state/initial-state';
import { rolesListReducer } from './state/reducer';

function sortRoles(
  roles: RoleDto[],
  sort?: { columnId: string; direction: 'asc' | 'desc' }
) {
  if (!sort) return roles;

  const sorted = [...roles].sort((a, b) => {
    const key = sort.columnId as keyof RoleDto;
    const left = String(a[key] ?? '');
    const right = String(b[key] ?? '');
    return left.localeCompare(right, undefined, { numeric: true });
  });

  return sort.direction === 'desc' ? sorted.reverse() : sorted;
}

export default function RolesListPage() {
  const { t } = useTranslation('usersRoles');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { pagination, search, sort, setTablePageSettings } =
    usePageTableSettings(ROLES_TABLE_KEY, {
      defaultPageSize: rolesListInitialState.pageSize,
    });
  const [state, dispatch] = useReducer(rolesListReducer, {
    ...rolesListInitialState,
    search:
      typeof search.search === 'string'
        ? search.search
        : rolesListInitialState.search,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sort:
      sort && 'columnId' in sort && 'direction' in sort
        ? sort
        : rolesListInitialState.sort,
  });

  useEffect(() => {
    setTablePageSettings(ROLES_TABLE_KEY, {
      search: state.search.trim() ? { search: state.search.trim() } : {},
      pagination: {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      },
      sort: state.sort,
    });
  }, [
    setTablePageSettings,
    state.pageIndex,
    state.pageSize,
    state.search,
    state.sort,
  ]);

  const { data, isLoading } = useRolesQuery({
    page: state.pageIndex,
    per_page: state.pageSize,
    sort: state.sort?.columnId,
    order: state.sort?.direction,
    search: state.search,
  });
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();
  const canViewRoles = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.view
  );

  const roles = Array.isArray(
    (data as unknown as { data?: RoleDto[] } | undefined)?.data
  )
    ? ((data as unknown as { data: RoleDto[] }).data ?? [])
    : Array.isArray(
          (data as unknown as { result?: RoleDto[] } | undefined)?.result
        )
      ? ((data as unknown as { result: RoleDto[] }).result ?? [])
      : [];
  const totalCount =
    data?.meta?.total ??
    (data?.meta?.last_page != null
      ? data.meta.last_page * state.pageSize
      : roles.length);

  const tableColumns = useRolesTableColumns({
    onView: (role) =>
      navigate(`/users-roles/roles/${encodeRouteId(role.id)}/display`),
    onEdit: (role) => navigate(`/users-roles/roles/${encodeRouteId(role.id)}`),
    onDelete: (role) =>
      dispatch({
        type: rolesListActionNames.setSelectedRole,
        payload: role,
      }),
  });

  const displayedRoles = useMemo(
    () => sortRoles(roles, state.sort),
    [roles, state.sort]
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <TableActions
        onChange={(event) => {
          dispatch({
            type: rolesListActionNames.setSearch,
            payload: event.target.value,
          });
        }}
        value={state.search}
        handleReset={() => undefined}
        handleFilter={() => undefined}
        handleSettingReset={tableColumns.handleSettingReset}
        handelApply={tableColumns.handleApplySettings}
        columns={tableColumns.columnsConfig}
        defaultColumns={tableColumns.defaultColumnsConfig}
        setColumns={tableColumns.setColumnsConfig}
        primaryButton={
          <Can
            group={PERMISSION_GROUPS.roles}
            action={PERMISSION_ACTIONS.create}
          >
            <PrimaryButton
              onClick={() => navigate('/users-roles/roles/create')}
            >
              {t('add_role')}
            </PrimaryButton>
          </Can>
        }
        hasFilter={false}
      />

      <Table
        data={displayedRoles}
        columns={tableColumns.columns}
        actionsColumn={{
          header: t('actions'),
          actions: tableColumns.roleTableActions,
          checkPermission: (permission) =>
            hasPermissionKey(permission, PERMISSION_GROUPS.roles),
          maxIcons: 3,
        }}
        isLoading={isLoading}
        sort={state.sort}
        onSort={(columnId, direction) =>
          dispatch({
            type: rolesListActionNames.setSort,
            payload: { columnId, direction },
          })
        }
        handelRowClick={(row) =>
          canViewRoles
            ? navigate(`/users-roles/roles/${encodeRouteId(row.id)}/display`)
            : undefined
        }
        pagination={{
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          totalCount,
          onPageChange: (page) =>
            dispatch({
              type: rolesListActionNames.setPageIndex,
              payload: page,
            }),
          onPageSizeChange: (size) =>
            dispatch({
              type: rolesListActionNames.setPageSize,
              payload: size,
            }),
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        }}
      />

      <DeleteModal
        open={Boolean(state.selectedRole)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: rolesListActionNames.setSelectedRole,
              payload: null,
            });
          }
        }}
        title={t('delete_role_title')}
        deleteMessage={t('delete_role_message', {
          name: state.selectedRole?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!state.selectedRole) return;
          deleteRole(state.selectedRole.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('role_deleted')),
              });
              dispatch({
                type: rolesListActionNames.setSelectedRole,
                payload: null,
              });
            },
          });
        }}
      />
    </div>
  );
}
