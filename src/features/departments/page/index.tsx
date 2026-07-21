import { Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { DEPARTMENTS_TABLE_KEY, PAGE_SIZE_OPTIONS } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useDepartmentsQuery,
  useUpdateDepartmentMutation,
  type DepartmentDto,
} from '@/services/departments';
import DepartmentFormModal from '../components/department-form-modal';
import DepartmentViewModal from '../components/department-view-modal';
import { useDepartmentsTableColumns } from '../hooks/use-departments-table-columns';

function sortDepartments(
  items: DepartmentDto[],
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

export default function DepartmentsPage() {
  const { t } = useTranslation('usersRoles');
  const { showToast } = useToast();
  const { pagination, search, sort, setTablePageSettings } =
    usePageTableSettings(DEPARTMENTS_TABLE_KEY, {
      defaultPageSize: 10,
    });
  const [searchValue, setSearchValue] = useState(
    typeof search.search === 'string' ? search.search : ''
  );
  const [pageIndex, setPageIndex] = useState(pagination.pageIndex);
  const [pageSize, setPageSize] = useState(pagination.pageSize);
  const [sortState, setSortState] = useState(
    sort && 'columnId' in sort && 'direction' in sort ? sort : undefined
  );
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDto | null>(
    null
  );
  const [viewDepartment, setViewDepartment] = useState<DepartmentDto | null>(null);
  const [deleteDepartment, setDeleteDepartment] = useState<DepartmentDto | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const canView = hasPermission(
    PERMISSION_GROUPS.departments,
    PERMISSION_ACTIONS.view
  );

  useEffect(
    () =>
      setTablePageSettings(DEPARTMENTS_TABLE_KEY, {
        search: searchValue.trim() ? { search: searchValue.trim() } : {},
        pagination: { pageIndex, pageSize },
        sort: sortState,
      }),
    [pageIndex, pageSize, searchValue, setTablePageSettings, sortState]
  );

  const { data, isLoading } = useDepartmentsQuery({
    page: pageIndex,
    pageSize,
    search: debouncedSearch || undefined,
  });
  const { mutateAsync: createDepartment, isPending: isCreating } =
    useCreateDepartmentMutation();
  const { mutateAsync: updateDepartment, isPending: isUpdating } =
    useUpdateDepartmentMutation();
  const { mutate: removeDepartment, isPending: isDeleting } =
    useDeleteDepartmentMutation();

  const displayedItems = useMemo(
    () => sortDepartments(data?.items ?? [], sortState),
    [data?.items, sortState]
  );
  const tableColumns = useDepartmentsTableColumns({
    onView: setViewDepartment,
    onEdit: (item) => {
      setEditingDepartment(item);
      setIsFormOpen(true);
    },
    onDelete: setDeleteDepartment,
  });

  return (
    <>
      <div className="h-full flex flex-col gap-6">
        <TableActions
          onChange={(event) => {
            setSearchValue(event.target.value);
            setPageIndex(1);
          }}
          value={searchValue}
          searchPlaceholder={t('search_departments')}
          handleReset={() => {
            setSearchValue('');
            setPageIndex(1);
          }}
          handleFilter={() => undefined}
          handleSettingReset={tableColumns.handleSettingReset}
          handelApply={tableColumns.handleApplySettings}
          columns={tableColumns.columnsConfig}
          defaultColumns={tableColumns.defaultColumnsConfig}
          setColumns={tableColumns.setColumnsConfig}
          primaryButton={
            <Can
              group={PERMISSION_GROUPS.departments}
              action={PERMISSION_ACTIONS.create}
            >
              <PrimaryButton
                icon={<Plus size={16} />}
                onClick={() => {
                  setEditingDepartment(null);
                  setIsFormOpen(true);
                }}
              >
                {t('add_department')}
              </PrimaryButton>
            </Can>
          }
          hasFilter={false}
        />

        <Table
          data={displayedItems}
          columns={tableColumns.columns}
          actionsColumn={{
            header: t('common:actions'),
            actions: tableColumns.departmentTableActions,
            checkPermission: (permission) =>
              hasPermissionKey(permission, PERMISSION_GROUPS.departments),
            maxIcons: 3,
          }}
          isLoading={isLoading}
          sort={sortState}
          onSort={(columnId, direction) => setSortState({ columnId, direction })}
          handelRowClick={(row) => {
            if (!canView) return;
            setViewDepartment(row);
          }}
          pagination={{
            pageIndex,
            pageSize,
            totalCount: data?.pagination.totalCount ?? displayedItems.length,
            onPageChange: setPageIndex,
            onPageSizeChange: (value) => {
              setPageSize(value);
              setPageIndex(1);
            },
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
          }}
        />
      </div>

      <DepartmentFormModal
        open={isFormOpen}
        setOpen={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingDepartment(null);
        }}
        departmentId={editingDepartment?.id ?? null}
        onCreate={createDepartment}
        onUpdate={(id, payload) => updateDepartment({ id, data: payload })}
        isSubmitting={isCreating || isUpdating}
      />

      <DepartmentViewModal
        open={Boolean(viewDepartment)}
        setOpen={(open) => {
          if (!open) setViewDepartment(null);
        }}
        departmentId={viewDepartment?.id ?? null}
      />

      <DeleteModal
        open={Boolean(deleteDepartment)}
        setOpen={(open) => {
          if (!open) setDeleteDepartment(null);
        }}
        title={t('delete_department_title')}
        deleteMessage={t('delete_department_message', {
          name: deleteDepartment?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!deleteDepartment) return;

          removeDepartment(deleteDepartment.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(
                  response,
                  t('department_deleted')
                ),
              });
              setDeleteDepartment(null);
            },
          });
        }}
      />
    </>
  );
}
