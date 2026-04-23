import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column, TableActionItem } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PRODUCT_GROUPS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS } from '@/constants/permissions';
import { STATUS } from '@/constants/enums';
import { useConfigurableTableColumns } from '@/features/roles/hooks/use-configurable-table-columns';
import { StatusToggle } from '@/features/products/components/status-toggle';
import type { ProductTypeDto } from '@/features/types/service';
import { resolveText } from '@/utils/helpers';
import { PRODUCT_CATEGORY_TRANSLATION_KEYS } from '../constants/product-category';

type UseProductGroupsTableColumnsProps = {
  onView: (productType: ProductTypeDto) => void;
  onEdit: (productType: ProductTypeDto) => void;
  onDelete: (productType: ProductTypeDto) => void;
  onStatusChange: (productType: ProductTypeDto) => void;
  canChangeStatus: boolean;
};

export function useProductGroupsTableColumns({
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canChangeStatus,
}: UseProductGroupsTableColumnsProps) {
  const { t, i18n } = useTranslation('types');
  const currentLang = i18n.language === 'en' ? 'en' : 'ar';

  const defaultColumns: Column<ProductTypeDto>[] = useMemo(
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
        id: 'category',
        header: t('category'),
        sortable: true,
        render: (row) => (
          <TableText
            text={
              row.category
                ? t(
                    PRODUCT_CATEGORY_TRANSLATION_KEYS[row.category] ??
                      'category'
                  )
                : '-'
            }
          />
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
        render: (row) => (
          <TableText
            text={String(row.products_count ?? row.productsCount ?? 0)}
          />
        ),
      },
    ],
    [canChangeStatus, currentLang, onStatusChange, t]
  );

  const productGroupActions: TableActionItem<ProductTypeDto>[] = useMemo(
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

  const tableSettings = useConfigurableTableColumns<ProductTypeDto>({
    tableKey: PRODUCT_GROUPS_TABLE_KEY,
    defaultColumns,
  });

  return {
    productGroupActions,
    ...tableSettings,
  };
}
