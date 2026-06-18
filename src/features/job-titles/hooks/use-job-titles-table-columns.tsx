import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { JOB_TITLES_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { formatDate } from '@/utils/helpers';
import type { JobTitleDto } from '@/services/job-titles';

export function useJobTitlesTableColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: JobTitleDto) => void;
  onEdit: (item: JobTitleDto) => void;
  onDelete: (item: JobTitleDto) => void;
}) {
  const { t } = useTranslation('usersRoles');

  const defaultColumns: Column<JobTitleDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('job_title_name'),
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

  const jobTitleTableActions: TableActionItem<JobTitleDto>[] = useMemo(
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

  const tableSettings = useConfigurableTableColumns<JobTitleDto>({
    tableKey: JOB_TITLES_TABLE_KEY,
    defaultColumns,
  });

  return {
    jobTitleTableActions,
    ...tableSettings,
  };
}
