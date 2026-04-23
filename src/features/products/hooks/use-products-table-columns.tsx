/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Column } from '@/components/common/table';
import type { TableActionItem } from '@/components/common/table';
import { FIXED_ID_COLUMN_ID } from '@/components/common/table';
import type { TableColumnConfig } from '@/types/tableColumnConfig';
import { useTableSettingsStore } from '@/store/table-setting.store';
import { TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import type { ProductDto } from '@/features/products/service/products.types';
import TableText from '@/components/common/table-text';
import { StatusToggle } from '@/features/products/components/status-toggle';
import {
  addEveryThreeDigits,
  encodeRouteId,
  resolveText,
} from '@/utils/helpers';
import { STATUS } from '@/constants/enums';
import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';

export interface UseProductsTableColumnsParams {
  navigate: (path: string) => void;
  onStatusChange: (product: ProductDto, newStatus: number) => void;
  onDeleteClick: (product: ProductDto) => void;
  canChangeStatus: boolean;
}

function getColumnLabel(
  header: Column<ProductDto>['header'] | undefined,
  fallback: string
): string {
  return typeof header === 'string' ||
    typeof header === 'number' ||
    typeof header === 'bigint' ||
    typeof header === 'boolean'
    ? String(header)
    : fallback;
}

export function useProductsTableColumns({
  navigate,
  onStatusChange,
  onDeleteClick,
  canChangeStatus,
}: UseProductsTableColumnsParams) {
  const { t, i18n } = useTranslation('products');
  const currentLang = i18n.language === 'ar' ? 'ar' : 'en';

  const storedConfig = useTableSettingsStore(
    (s) => s.tables[TABLE_KEY]?.columns
  );
  const setStoredConfig = useTableSettingsStore((s) => s.setTableColumns);

  const defaultColumns: Column<ProductDto>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('name'),
        accessorKey: 'name',
        sortable: true,
        render: (row) => <TableText text={row.name} />,
      },
      {
        id: 'product_type',
        header: t('group'),
        accessorKey: 'product_type',
        sortable: true,
        render: (row) => (
          <TableText
            text={resolveText(row.product_type?.title, currentLang) ?? ''}
          />
        ),
      },
      {
        id: 'product_unit',
        header: t('product_unit'),
        accessorKey: 'product_unit',
        sortable: true,
        render: (row) => (
          <TableText
            text={resolveText(row.product_unit?.title, currentLang) ?? ''}
          />
        ),
      },
      {
        id: 'quant',
        header: t('quantity'),
        accessorKey: 'quant',
        sortable: true,
        render: (row) => (
          <TableText text={addEveryThreeDigits(row.quant ?? 0) as string} />
        ),
      },
      {
        id: 'price',
        header: t('price'),
        accessorKey: 'price',
        sortable: true,
        render: (row) => (
          <TableText text={addEveryThreeDigits(row.price ?? 0) as string} />
        ),
      },
      {
        id: 'opening_quant',
        header: t('start_quantity'),
        accessorKey: 'opening_quant',
        sortable: true,
        render: (row) => (
          <TableText
            text={addEveryThreeDigits(row.opening_quant ?? 0) as string}
          />
        ),
      },
      {
        id: 'maintaince_quant',
        header: t('maintenance_quantity'),
        accessorKey: 'maintaince_quant',
        sortable: true,
        render: (row) => (
          <TableText
            text={addEveryThreeDigits(row.maintaince_quant ?? 0) as string}
          />
        ),
      },
      {
        id: 'notification_minimum_quantity',
        header: t('min_quantity_notification'),
        accessorKey: 'notification_minimum_quantity',
        sortable: true,
        render: (row) => (
          <TableText
            text={
              addEveryThreeDigits(
                row.notification_minimum_quantity ?? 0
              ) as string
            }
          />
        ),
      },
      {
        id: 'status',
        header: t('status'),
        accessorKey: 'status',
        sortable: true,
        render: (row) => (
          <StatusToggle
            value={row.status === STATUS.ACTIVE}
            onChange={(checked) =>
              onStatusChange(row, checked ? STATUS.ACTIVE : STATUS.INACTIVE)
            }
            disabled={!canChangeStatus}
          />
        ),
      },
      {
        id: 'description',
        header: t('description'),
        accessorKey: 'description',
        sortable: true,
        render: (row) => (
          <TableText
            text={
              row.description
                ? String(row.description).slice(0, 50) +
                  (String(row.description).length > 50 ? '...' : '')
                : '-'
            }
          />
        ),
      },
      {
        id: 'icon',
        header: t('product_image'),
        accessorKey: 'icon',
        sortable: false,
        render: (row) =>
          row.icon?.url ? (
            <img
              src={row.icon.url}
              alt=""
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            <TableText text="-" />
          ),
      },
    ],
    [t, onStatusChange, currentLang]
  );

  const productTableActions: TableActionItem<ProductDto>[] = useMemo(
    () => [
      {
        id: 'view',
        icon: <Eye size={20} weight="bold" />,
        label: t('view'),
        onClick: (p: ProductDto) =>
          navigate(`/products/${encodeRouteId(p.id)}/display`),
        permission: `${PERMISSION_GROUPS.products}.${PERMISSION_ACTIONS.view}`,
        variant: 'primary',
      },
      {
        id: 'edit',
        icon: <PencilSimpleLine size={20} weight="bold" />,
        label: t('edit'),
        onClick: (p: ProductDto) =>
          navigate(`/products/${encodeRouteId(p.id)}`),
        permission: `${PERMISSION_GROUPS.products}.${PERMISSION_ACTIONS.update}`,
        variant: 'primary',
      },
      {
        id: 'delete',
        icon: <Trash size={20} weight="bold" />,
        label: t('delete'),
        onClick: (p: ProductDto) => onDeleteClick(p),
        permission: `${PERMISSION_GROUPS.products}.${PERMISSION_ACTIONS.delete}`,
        variant: 'danger',
      },
    ],
    [t, navigate, onDeleteClick]
  );

  const defaultColumnsConfig: TableColumnConfig[] = useMemo(
    () =>
      defaultColumns.map((col) => ({
        id: col.id!,
        label: getColumnLabel(col.header, col.id ?? ''),
        visible: true,
      })),
    [defaultColumns]
  );

  /** معرفات قديمة مكررة (نفس العمود باسم آخر) - لا نضيفها من الإعدادات المحفوظة */
  const DUPLICATE_COLUMN_ALIASES = useMemo(
    () => new Set(['group', 'quantity']),
    []
  );

  const mergeWithDefaultConfig = useCallback(
    (config: TableColumnConfig[] | undefined): TableColumnConfig[] => {
      const filtered = (config ?? []).filter(
        (c) =>
          c.id !== FIXED_ID_COLUMN_ID && !DUPLICATE_COLUMN_ALIASES.has(c.id)
      );
      const defaultById = new Map(defaultColumnsConfig.map((d) => [d.id, d]));
      const result: TableColumnConfig[] = [];
      const seen = new Set<string>();

      /** الحفاظ على ترتيب الأعمدة المحفوظ من الإعدادات */
      for (const stored of filtered) {
        const def = defaultById.get(stored.id);
        if (def) {
          result.push({ ...def, ...stored, label: def.label });
          seen.add(stored.id);
        }
      }
      /** إضافة أي عمود افتراضي جديد غير موجود في المحفوظ */
      for (const def of defaultColumnsConfig) {
        if (!seen.has(def.id)) {
          result.push({ ...def });
          seen.add(def.id);
        }
      }
      return result;
    },
    [defaultColumnsConfig, DUPLICATE_COLUMN_ALIASES]
  );

  const [columnsConfig, setColumnsConfig] = useState<TableColumnConfig[]>(() =>
    mergeWithDefaultConfig(storedConfig ?? undefined)
  );

  const prevStoredConfig = useRef(storedConfig);
  useEffect(() => {
    if (!storedConfig || storedConfig === prevStoredConfig.current) return;
    prevStoredConfig.current = storedConfig;
    setColumnsConfig(mergeWithDefaultConfig(storedConfig));
  }, [storedConfig, mergeWithDefaultConfig]);

  const columns: Column<ProductDto>[] = useMemo(() => {
    return columnsConfig
      .filter((c) => c.visible)
      .map((c) => defaultColumns.find((col) => col.id === c.id))
      .filter((col): col is Column<ProductDto> => Boolean(col));
  }, [defaultColumns, columnsConfig]);

  const handleSettingReset = () => setColumnsConfig(defaultColumnsConfig);

  const normalizeIncomingConfig = useCallback(
    (config: TableColumnConfig[]) => mergeWithDefaultConfig(config),
    [mergeWithDefaultConfig]
  );

  const setColumnsConfigState: Dispatch<SetStateAction<TableColumnConfig[]>> =
    useCallback(
      (value) => {
        setColumnsConfig((current) => {
          const nextValue =
            typeof value === 'function' ? value(current) : value;
          return normalizeIncomingConfig(nextValue);
        });
      },
      [normalizeIncomingConfig]
    );

  const handelApplySettings = (config?: TableColumnConfig[]) => {
    const normalized = normalizeIncomingConfig(config ?? columnsConfig);
    setColumnsConfig(normalized);
    setStoredConfig(TABLE_KEY, normalized, defaultColumnsConfig);
  };

  const columnsConfigWithTranslatedLabels = useMemo(
    () =>
      columnsConfig.map((c) => ({
        ...c,
        label: getColumnLabel(
          defaultColumns.find((col) => col.id === c.id)?.header,
          c.label
        ),
      })),
    [columnsConfig, defaultColumns]
  );

  return {
    defaultColumns,
    productTableActions,
    defaultColumnsConfig,
    columnsConfig: columnsConfigWithTranslatedLabels,
    setColumnsConfig: setColumnsConfigState,
    columns,
    handleSettingReset,
    handelApplySettings,
  };
}
