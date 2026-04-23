import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TableColumnConfig,
  TablePageSettings,
} from '@/types/tableColumnConfig';
import { defaultTablePageSettings } from '@/types/tableColumnConfig';

function isLegacyColumns(value: unknown): value is TableColumnConfig[] {
  return (
    Array.isArray(value) &&
    value.length >= 0 &&
    (value.length === 0 ||
      (typeof value[0] === 'object' &&
        value[0] !== null &&
        'id' in value[0] &&
        'label' in value[0] &&
        'visible' in value[0]))
  );
}

function migrateTables(raw: unknown): Record<string, TablePageSettings> {
  if (!raw || typeof raw !== 'object') return {};
  const tables = raw as Record<string, unknown>;
  const next: Record<string, TablePageSettings> = {};
  for (const [pageKey, value] of Object.entries(tables)) {
    if (isLegacyColumns(value)) {
      next[pageKey] = defaultTablePageSettings(pageKey, value);
    } else if (
      value &&
      typeof value === 'object' &&
      'pageKey' in value &&
      'columns' in value &&
      Array.isArray((value as TablePageSettings).columns)
    ) {
      const persisted = value as TablePageSettings;
      next[pageKey] = {
        ...defaultTablePageSettings(pageKey, persisted.columns),
        ...persisted,
        pagination:
          persisted.pagination ??
          defaultTablePageSettings(pageKey, persisted.columns).pagination,
        search: persisted.search ?? {},
      };
    }
  }
  return next;
}

interface TableSettingsState {
  tables: Record<string, TablePageSettings>;

  getTablePageSettings: (pageKey: string) => TablePageSettings | undefined;

  setTableColumns: (
    pageKey: string,
    columns: TableColumnConfig[],
    defaultColumns?: TableColumnConfig[]
  ) => void;

  resetTableColumns: (
    pageKey: string,
    defaultColumns: TableColumnConfig[]
  ) => void;

  setTablePageSettings: (
    pageKey: string,
    settings: Partial<Omit<TablePageSettings, 'pageKey'>>
  ) => void;
}

export const useTableSettingsStore = create<TableSettingsState>()(
  persist(
    (set, get) => ({
      tables: {},

      getTablePageSettings: (pageKey) => get().tables[pageKey],

      setTableColumns: (pageKey, columns, defaultColumns) =>
        set((state) => {
          const current = state.tables[pageKey];
          const base = current ?? defaultTablePageSettings(pageKey, columns);
          return {
            tables: {
              ...state.tables,
              [pageKey]: {
                ...base,
                pageKey,
                columns,
                defaultColumns: defaultColumns ?? base.defaultColumns,
              },
            },
          };
        }),

      resetTableColumns: (pageKey, defaultColumns) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [pageKey]: {
              ...(state.tables[pageKey] ??
                defaultTablePageSettings(pageKey, defaultColumns)),
              pageKey,
              columns: defaultColumns,
              defaultColumns,
            },
          },
        })),

      setTablePageSettings: (pageKey, settings) =>
        set((state) => {
          const current = state.tables[pageKey];
          const base =
            current ?? defaultTablePageSettings(pageKey, settings.columns);
          return {
            tables: {
              ...state.tables,
              [pageKey]: {
                ...base,
                pageKey,
                columns: settings.columns ?? base.columns,
                defaultColumns: settings.defaultColumns ?? base.defaultColumns,
                search: settings.search ?? base.search,
                pagination: settings.pagination ?? base.pagination,
                sort: settings.sort !== undefined ? settings.sort : base.sort,
              },
            },
          };
        }),
    }),
    {
      name: 'table-settings',
      merge: (persisted, current) => {
        const raw = persisted as { tables?: unknown } | undefined;
        const tables =
          raw?.tables != null ? migrateTables(raw.tables) : current.tables;
        return { ...current, tables };
      },
    }
  )
);
