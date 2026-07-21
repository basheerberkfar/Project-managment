import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PRODUCT_UNITS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { STATUS } from '@/constants/enums';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { StatusToggle } from '@/features/products/components/status-toggle';
import type { ProductUnitDto } from '@/features/types/service';
import { resolveText } from '@/utils/helpers';

type UseProductUnitsTableColumnsProps = {
  onView: (productUnit: ProductUnitDto) => void;
  onEdit: (productUnit: ProductUnitDto) => void;
  onDelete: (productUnit: ProductUnitDto) => void;
  onStatusChange: (productUnit: ProductUnitDto) => void;
  canChangeStatus: boolean;
};

export function useProductUnitsTableColumns({
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canChangeStatus,
}: UseProductUnitsTableColumnsProps) {
  const { t, i18n } = useTranslation('types');
  const currentLang = i18n.language === 'en' ? 'en' : 'ar';

  const defaultColumns: Column<ProductUnitDto>[] = useMemo(
    () => [
      {
        id: 'title',
        header: t('title'),
        sortable: true,
        render: (row) => <TableText text={row.title} />,
      },
      {
        id: 'description',
        header: t('description'),
        render: (row) => (
          <TableText text={resolveText(row.description, currentLang) || '-'} />
        ),
      },
      {
        id: 'status',
        header: t('status'),
        sortable: true,
        stopRowClick: true,
        render: (row) => (
          <StatusToggle
            value={row.status === STATUS.ACTIVE}
            onChange={() => onStatusChange(row)}
            disabled={!canChangeStatus}
          />
        ),
      },
      {
        id: 'products_count',
        header: t('products_count'),
        sortable: true,
        render: (row) => <TableText text={String(row.products_count ?? 0)} />,
      },
    ],
    [canChangeStatus, currentLang, onStatusChange, t]
  );

  const productUnitActions: TableActionItem<ProductUnitDto>[] = useMemo(
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
        variant: 'primary',
      },
      {
        id: 'delete',
        icon: <Trash size={18} />,
        label: t('delete'),
        onClick: onDelete,
        permission: PERMISSION_ACTIONS.delete,
        variant: 'danger',
      },
    ],
    [onDelete, onEdit, onView, t]
  );

  const tableSettings = useConfigurableTableColumns<ProductUnitDto>({
    tableKey: PRODUCT_UNITS_TABLE_KEY,
    defaultColumns,
  });

  return {
    productUnitActions,
    ...tableSettings,
  };
}
