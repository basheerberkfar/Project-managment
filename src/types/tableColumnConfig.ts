import type { SortState } from '@/components/common/table/types';

export type TableColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
};

export type SearchFilterValue =
  | string
  | { label: string; value: string }
  | { label: string; value: string }[];

export interface TablePageSettings {
  pageKey: string;
  columns: TableColumnConfig[];
  defaultColumns: TableColumnConfig[];
  search: Record<string, SearchFilterValue>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sort?: SortState;
}

export const defaultTablePageSettings = (
  pageKey: string,
  columns: TableColumnConfig[] = []
): TablePageSettings => ({
  pageKey,
  columns,
  defaultColumns: columns,
  search: {},
  pagination: { pageIndex: 1, pageSize: 10 },
});
