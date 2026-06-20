import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { CLIENTS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { formatDate } from '@/utils/helpers';
import type { ClientDto } from '@/services/clients';

export function useClientsTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: ClientDto) => void;
  onEdit: (item: ClientDto) => void;
  onDelete: (item: ClientDto) => void;
}) {
  const { t } = useTranslation('clients');

  const defaultColumns: Column<ClientDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('client_name'),
        sortable: true,
        render: (row) => <TableText text={row.name} />,
      },
      {
        id: 'phoneNumber',
        header: t('phone_number'),
        sortable: true,
        render: (row) => <TableText text={row.phoneNumber} />,
      },
      {
        id: 'countryCode',
        header: t('country_code'),
        sortable: true,
        render: (row) => <TableText text={row.countryCode} />,
      },
      {
        id: 'address',
        header: t('address'),
        sortable: true,
        render: (row) => <TableText text={row.address} />,
      },
      {
        id: 'birthday',
        header: t('birthday'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.birthday)} />,
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

  const clientTableActions: TableActionItem<ClientDto>[] = useMemo(
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

  const tableSettings = useConfigurableTableColumns<ClientDto>({
    tableKey: CLIENTS_TABLE_KEY,
    defaultColumns,
  });

  return {
    clientTableActions,
    ...tableSettings,
  };
}
