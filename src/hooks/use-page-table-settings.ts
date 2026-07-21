import type { SortState } from '@/components/common/table/types';
import { useTableSettingsStore } from '@/store/table-setting.store';
import { useTableSettingsHydration } from './use-table-settings-hydration';

export interface UsePageTableSettingsOptions {
  defaultPageSize?: number;
  defaultSort?: SortState;
}

export function usePageTableSettings(
  pageKey: string,
  options: UsePageTableSettingsOptions = {}
) {
  const { defaultPageSize = 10, defaultSort } = options;

  const hasHydrated = useTableSettingsHydration();
  const settings = useTableSettingsStore((s) => s.tables[pageKey]);
  const getTablePageSettings = useTableSettingsStore(
    (s) => s.getTablePageSettings
  );
  const setTablePageSettings = useTableSettingsStore(
    (s) => s.setTablePageSettings
  );
  const setTableColumns = useTableSettingsStore((s) => s.setTableColumns);
  const resetTableColumns = useTableSettingsStore((s) => s.resetTableColumns);

  const pagination = settings?.pagination ?? {
    pageIndex: 1,
    pageSize: defaultPageSize,
  };
  const search = settings?.search ?? {};
  const sort = settings?.sort ?? defaultSort;
  const columns = settings?.columns;
  const defaultColumns = settings?.defaultColumns;

  return {
    hasHydrated,
    settings: settings ?? undefined,
    pagination,
    search,
    sort,
    columns,
    defaultColumns,
    getTablePageSettings,
    setTablePageSettings,
    setTableColumns,
    resetTableColumns,
  };
}
