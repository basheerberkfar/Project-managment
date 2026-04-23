/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Column } from '@/components/common/table';
import { FIXED_ID_COLUMN_ID } from '@/components/common/table';
import { useTableSettingsStore } from '@/store/table-setting.store';
import type { TableColumnConfig } from '@/types/tableColumnConfig';

function getColumnLabel<T>(
  header: Column<T>['header'] | undefined,
  fallback: string
): string {
  return typeof header === 'string' ||
    typeof header === 'number' ||
    typeof header === 'bigint' ||
    typeof header === 'boolean'
    ? String(header)
    : fallback;
}

export function useConfigurableTableColumns<T>({
  tableKey,
  defaultColumns,
}: {
  tableKey: string;
  defaultColumns: Column<T>[];
}) {
  const storedConfig = useTableSettingsStore(
    (s) => s.tables[tableKey]?.columns
  );
  const setStoredConfig = useTableSettingsStore((s) => s.setTableColumns);

  const defaultColumnsConfig: TableColumnConfig[] = useMemo(
    () =>
      defaultColumns.map((col) => ({
        id: col.id!,
        label: getColumnLabel(col.header, col.id ?? ''),
        visible: true,
      })),
    [defaultColumns]
  );

  const mergeWithDefaultConfig = useCallback(
    (config: TableColumnConfig[] | undefined) => {
      const filtered = (config ?? []).filter(
        (c) => c.id !== FIXED_ID_COLUMN_ID
      );
      const defaultById = new Map(
        defaultColumnsConfig.map((col) => [col.id, col])
      );
      const result: TableColumnConfig[] = [];
      const seen = new Set<string>();

      for (const stored of filtered) {
        const matchingDefault = defaultById.get(stored.id);
        if (!matchingDefault) continue;
        result.push({
          ...matchingDefault,
          ...stored,
          label: matchingDefault.label,
        });
        seen.add(stored.id);
      }

      for (const defaultColumn of defaultColumnsConfig) {
        if (seen.has(defaultColumn.id)) continue;
        result.push({ ...defaultColumn });
      }

      return result;
    },
    [defaultColumnsConfig]
  );

  const normalizeIncomingConfig = useCallback(
    (config: TableColumnConfig[]) => mergeWithDefaultConfig(config),
    [mergeWithDefaultConfig]
  );

  const [columnsConfig, setColumnsConfig] = useState<TableColumnConfig[]>(() =>
    mergeWithDefaultConfig(storedConfig ?? undefined)
  );

  const prevTableKey = useRef(tableKey);
  const prevStoredConfig = useRef(storedConfig);
  useEffect(() => {
    if (prevTableKey.current !== tableKey) {
      prevTableKey.current = tableKey;
      prevStoredConfig.current = storedConfig;
      setColumnsConfig(mergeWithDefaultConfig(storedConfig ?? undefined));
      return;
    }

    if (!storedConfig || storedConfig === prevStoredConfig.current) return;
    prevStoredConfig.current = storedConfig;
    setColumnsConfig(mergeWithDefaultConfig(storedConfig));
  }, [storedConfig, mergeWithDefaultConfig, tableKey]);

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

  const columns = useMemo(
    () =>
      columnsConfig
        .filter((config) => config.visible)
        .map((config) =>
          defaultColumns.find((column) => column.id === config.id)
        )
        .filter((column): column is Column<T> => Boolean(column)),
    [columnsConfig, defaultColumns]
  );

  const columnsConfigWithLabels = useMemo(
    () =>
      columnsConfig.map((config) => ({
        ...config,
        label: getColumnLabel(
          defaultColumns.find((column) => column.id === config.id)?.header,
          config.label
        ),
      })),
    [columnsConfig, defaultColumns]
  );

  const handleSettingReset = useCallback(
    () => setColumnsConfig(defaultColumnsConfig),
    [defaultColumnsConfig]
  );

  const handleApplySettings = useCallback(
    (config?: TableColumnConfig[]) => {
      const normalized = normalizeIncomingConfig(config ?? columnsConfig);
      setColumnsConfig(normalized);
      setStoredConfig(tableKey, normalized, defaultColumnsConfig);
    },
    [
      columnsConfig,
      defaultColumnsConfig,
      normalizeIncomingConfig,
      setStoredConfig,
      tableKey,
    ]
  );

  return {
    defaultColumnsConfig,
    columnsConfig: columnsConfigWithLabels,
    setColumnsConfig: setColumnsConfigState,
    columns,
    handleSettingReset,
    handleApplySettings,
  };
}
