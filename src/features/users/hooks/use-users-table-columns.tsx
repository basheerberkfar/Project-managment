import { Eye, Key, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { USERS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import UserStatusBadge from '../components/user-status-badge';
import type { UserDto } from '../service';

export function useUsersTableColumns({
  onView,
  onEdit,
  onDelete,
  onChangePassword,
}: {
  onView: (user: UserDto) => void;
  onEdit: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
  onChangePassword: (user: UserDto) => void;
}) {
  const { t } = useTranslation('usersRoles');

  const defaultColumns: Column<UserDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('name'),
        sortable: true,
        render: (row) => <TableText text={row.name || `#${row.id}`} />,
      },
      {
        id: 'email',
        header: t('email'),
        sortable: true,
        render: (row) => <TableText text={row.email || '-'} />,
      },
      {
        id: 'phoneNumber',
        header: t('phone_number'),
        render: (row) =>
          row.phoneNumber ? (
            <span
              dir="ltr"
              className="inline-flex items-center gap-1 text-[0.81rem] select-none truncate wrap-break-word font-normal leading-[20px] text-neutral-900 dark:text-dark-primary"
            >
              {row.countryCode ? <span>{row.countryCode}</span> : null}
              <span>{row.phoneNumber}</span>
            </span>
          ) : (
            <TableText text="-" />
          ),
      },
      {
        id: 'department',
        header: t('department'),
        sortable: true,
        render: (row) => (
          <TableText text={row.department?.name || row.departmentName || '-'} />
        ),
      },
      {
        id: 'jobTitle',
        header: t('job_title'),
        sortable: true,
        render: (row) => (
          <TableText text={row.jobTitle?.name || row.jobTitleName || '-'} />
        ),
      },
      {
        id: 'status',
        header: t('status'),
        sortable: true,
        render: (row) => <UserStatusBadge isActive={row.isActive} />,
      },
    ],
    [t]
  );

  const userTableActions: TableActionItem<UserDto>[] = useMemo(
    () => [
      {
        id: 'view',
        icon: <Eye size={18} />,
        label: t('common:view'),
        onClick: onView,
        permission: PERMISSION_ACTIONS.view,
        variant: 'primary',
      },
      {
        id: 'edit',
        icon: <PencilSimpleLine size={18} />,
        label: t('common:edit'),
        onClick: onEdit,
        permission: PERMISSION_ACTIONS.update,
        isVisible: (user) => !user.isAdmin,
        variant: 'primary',
      },
      {
        id: 'change-password',
        icon: <Key size={18} />,
        label: t('change_password'),
        onClick: onChangePassword,
        permission: PERMISSION_ACTIONS.change_password,
        isVisible: (user) => !user.isAdmin,
        variant: 'warning',
      },
      {
        id: 'delete',
        icon: <Trash size={18} />,
        label: t('common:delete'),
        onClick: onDelete,
        permission: PERMISSION_ACTIONS.delete,
        isVisible: (user) => !user.isAdmin,
        variant: 'danger',
      },
    ],
    [onChangePassword, onDelete, onEdit, onView, t]
  );

  const tableSettings = useConfigurableTableColumns<UserDto>({
    tableKey: USERS_TABLE_KEY,
    defaultColumns,
  });

  return {
    userTableActions,
    ...tableSettings,
  };
}
