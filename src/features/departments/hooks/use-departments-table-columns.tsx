import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { DEPARTMENTS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { formatDate } from '@/utils/helpers';
import type { DepartmentDto } from '@/services/departments';

export function useDepartmentsTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: DepartmentDto) => void;
  onEdit: (item: DepartmentDto) => void;
  onDelete: (item: DepartmentDto) => void;
}) {
  const { t } = useTranslation('usersRoles');

  const defaultColumns: Column<DepartmentDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('department_name'),
        sortable: true,
        render: (row) => <TableText text={row.name} />,
      },
      {
        id: 'createdAt',
        header: t('created_at'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.createdAt)} />,
      },
      {
        id: 'updatedAt',
        header: t('updated_at'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.updatedAt)} />,
      },
    ],
    [t]
  );

  const departmentTableActions: TableActionItem<DepartmentDto>[] = useMemo(
    () => [
      {
        id: 'view',
        icon: <Eye size={18} />,
        label: t('common:view'),
        onClick: onView,
        permission: PERMISSION_ACTIONS.view,
      },
      {
        id: 'edit',
        icon: <PencilSimpleLine size={18} />,
        label: t('common:edit'),
        onClick: onEdit,
        permission: PERMISSION_ACTIONS.update,
      },
      {
        id: 'delete',
        icon: <Trash size={18} />,
        label: t('common:delete'),
        onClick: onDelete,
        permission: PERMISSION_ACTIONS.delete,
        variant: 'danger',
      },
    ],
    [onDelete, onEdit, onView, t]
  );

  const tableSettings = useConfigurableTableColumns<DepartmentDto>({
    tableKey: DEPARTMENTS_TABLE_KEY,
    defaultColumns,
  });

  return {
    departmentTableActions,
    ...tableSettings,
  };
}
