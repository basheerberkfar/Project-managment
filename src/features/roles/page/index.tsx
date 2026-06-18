/* eslint-disable react-hooks/exhaustive-deps */
import { Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { PAGE_SIZE_OPTIONS, ROLES_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { encodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import { useRolesTableColumns } from '../hooks/use-roles-table-columns';
import { useDeleteRoleMutation, useRolesQuery, type RoleDto } from '../service';
import { rolesListActionNames } from './state/action-names';
import { rolesListInitialState } from './state/initial-state';
import { rolesListReducer } from './state/reducer';

function sortRoles(
  items: RoleDto[],
  sort?: { columnId: string; direction: 'asc' | 'desc' }
) {
  if (!sort) return items;

  const sorted = [...items].sort((left, right) =>
    String((left as Record<string, unknown>)[sort.columnId] ?? '').localeCompare(
      String((right as Record<string, unknown>)[sort.columnId] ?? ''),
      undefined,
      { numeric: true }
    )
  );

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
  const debouncedSearch = useDebounce(state.search, 500);
  const canViewRoles = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.view
  );

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
    pageSize: state.pageSize,
    search: debouncedSearch || undefined,
  });
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();

  const displayedRoles = useMemo(
    () => sortRoles(data?.items ?? [], state.sort),
    [data?.items, state.sort]
  );
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

  return (
    <div className="h-full flex flex-col gap-6">
      <TableActions
        onChange={(event) =>
          dispatch({
            type: rolesListActionNames.setSearch,
            payload: event.target.value,
          })
        }
        value={state.search}
        searchPlaceholder={t('search_roles')}
        handleReset={() =>
          dispatch({
            type: rolesListActionNames.setSearch,
            payload: '',
          })
        }
        handleFilter={() => undefined}
        handleSettingReset={tableColumns.handleSettingReset}
        handelApply={tableColumns.handleApplySettings}
        columns={tableColumns.columnsConfig}
        defaultColumns={tableColumns.defaultColumnsConfig}
        setColumns={tableColumns.setColumnsConfig}
        primaryButton={
          <Can group={PERMISSION_GROUPS.roles} action={PERMISSION_ACTIONS.create}>
            <PrimaryButton
              icon={<Plus size={16} />}
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
          header: t('common:actions'),
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
          totalCount: data?.pagination.totalCount ?? displayedRoles.length,
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
