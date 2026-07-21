import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PROJECTS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import type { ProjectDto } from '@/services/projects';
import { formatDate } from '@/utils/helpers';

export function useProjectsTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: ProjectDto) => void;
  onEdit: (item: ProjectDto) => void;
  onDelete: (item: ProjectDto) => void;
}) {
  const { t } = useTranslation('projects');

  const defaultColumns: Column<ProjectDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('project_name'),
        sortable: true,
        render: (row) => <TableText text={row.name ?? '-'} />,
      },
      {
        id: 'clientName',
        header: t('client_name'),
        sortable: true,
        render: (row) => <TableText text={row.clientName ?? '-'} />,
      },
      {
        id: 'status',
        header: t('status'),
        sortable: true,
        render: (row) => <TableText text={row.status ?? '-'} />,
      },
      {
        id: 'priority',
        header: t('priority'),
        sortable: true,
        render: (row) => <TableText text={row.priority ?? '-'} />,
      },
      {
        id: 'startDate',
        header: t('start_date'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.startDate)} />,
      },
      {
        id: 'receiptDate',
        header: t('receipt_date'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.receiptDate)} />,
      },
      {
        id: 'deliveryDate',
        header: t('delivery_date'),
        sortable: true,
        render: (row) => <TableText text={formatDate(row.deliveryDate)} />,
      },
      {
        id: 'totalAmount',
        header: t('total_amount'),
        sortable: true,
        render: (row) => <TableText text={String(row.totalAmount ?? '-')} />,
      },
      {
        id: 'paidAmount',
        header: t('paid_amount'),
        sortable: true,
        render: (row) => <TableText text={String(row.paidAmount ?? '-')} />,
      },
      {
        id: 'remainingAmount',
        header: t('remaining_amount'),
        sortable: true,
        render: (row) => <TableText text={String(row.remainingAmount ?? '-')} />,
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

  const projectTableActions: TableActionItem<ProjectDto>[] = useMemo(
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

  const tableSettings = useConfigurableTableColumns<ProjectDto>({
    tableKey: PROJECTS_TABLE_KEY,
    defaultColumns,
  });

  return {
    projectTableActions,
    ...tableSettings,
  };
}
