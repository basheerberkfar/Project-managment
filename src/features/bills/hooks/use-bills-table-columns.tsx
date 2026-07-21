import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { BILLS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { formatDate } from '@/utils/helpers';
import type { BillDto } from '../service';

export function useBillsTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (bill: BillDto) => void;
  onEdit: (bill: BillDto) => void;
  onDelete: (bill: BillDto) => void;
}) {
  const { t } = useTranslation('bills');

  const defaultColumns: Column<BillDto>[] = useMemo(
    () => [
      {
        id: 'no',
        header: t('no'),
        sortable: true,
        render: (row) => <TableText text={row.no ?? `#${row.id}`} />,
      },
      {
        id: 'billTypeName',
        header: t('bill_type'),
        sortable: true,
        render: (row) => <TableText text={row.billTypeName ?? '-'} />,
      },
      {
        id: 'total',
        header: t('total'),
        sortable: true,
        render: (row) => (
          <TableText text={row.total != null ? String(row.total) : '-'} />
        ),
      },
      {
        id: 'paidAmount',
        header: t('paid_amount'),
        sortable: true,
        render: (row) => (
          <TableText text={row.paidAmount != null ? String(row.paidAmount) : '-'} />
        ),
      },
      {
        id: 'createdAt',
        header: t('created_at'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.createdAt)} />,
      },
    ],
    [t]
  );

  const billTableActions: TableActionItem<BillDto>[] = useMemo(
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
        variant: 'primary',
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

  const tableSettings = useConfigurableTableColumns<BillDto>({
    tableKey: BILLS_TABLE_KEY,
    defaultColumns,
  });

  return {
    billTableActions,
    ...tableSettings,
  };
}
