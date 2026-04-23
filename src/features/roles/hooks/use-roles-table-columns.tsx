import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import type { RoleDto } from '../service';
import { ROLES_TABLE_KEY } from '@/constants/constants';
import { useConfigurableTableColumns } from './use-configurable-table-columns';

export function useRolesTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (role: RoleDto) => void;
  onEdit: (role: RoleDto) => void;
  onDelete: (role: RoleDto) => void;
}) {
  const { t } = useTranslation('usersRoles');

  const defaultColumns: Column<RoleDto>[] = useMemo(
    () => [
      {
        id: 'title',
        header: t('title'),
        sortable: true,
        render: (row) => (
          <TableText text={row.name ?? row.title ?? `#${row.id}`} />
        ),
      },
      {
        id: 'users_count',
        header: t('members_count'),
        sortable: true,
        render: (row) => (
          <TableText text={String(row.users_count ?? row.usersCount ?? 0)} />
        ),
      },
    ],
    [t]
  );

  const roleTableActions: TableActionItem<RoleDto>[] = useMemo(
    () => [
      {
        id: 'view',
        icon: <Eye size={18} />,
        label: t('view'),
        onClick: onView,
        permission: PERMISSION_ACTIONS.view,
        variant: 'primary',
      },
      {
        id: 'edit',
        icon: <PencilSimpleLine size={18} />,
        label: t('edit'),
        onClick: onEdit,
        permission: PERMISSION_ACTIONS.update,
        isVisible: (role) => !role.is_default,
        variant: 'primary',
      },
      {
        id: 'delete',
        icon: <Trash size={18} />,
        label: t('delete'),
        onClick: onDelete,
        permission: PERMISSION_ACTIONS.delete,
        isVisible: (role) => !role.is_default,
        variant: 'danger',
      },
    ],
    [onDelete, onEdit, onView, t]
  );

  const tableSettings = useConfigurableTableColumns<RoleDto>({
    tableKey: ROLES_TABLE_KEY,
    defaultColumns,
  });

  return {
    roleTableActions,
    ...tableSettings,
  };
}
