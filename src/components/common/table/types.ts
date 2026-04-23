import type { ReactNode } from 'react';
import type { TableActionItem } from './table-actions-cell';

export interface Column<T> {
  id?: string;
  header: string | ReactNode;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface Column<T> {
  id?: string;
  header: string | ReactNode;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  /** Fixed at start (e.g. ID column); can be combined with sticky styling */
  fixedStart?: boolean;
  /** Fixed at end (e.g. Actions column); can be combined with sticky styling */
  fixedEnd?: boolean;
  /** Prevent row click when clicking this cell (e.g. actions) */
  stopRowClick?: boolean;
}

/** Config for the built-in fixed ID column (controlled inside Table) */
export interface TableIdColumnConfig {
  header: string;
  show: boolean;
}

/** Config for the built-in fixed Actions column (controlled inside Table) */
export interface TableActionsColumnConfig<T> {
  header: string;
  actions: TableActionItem<T>[];
  checkPermission?: (permission: string) => boolean;
  maxIcons?: number;
}

export interface TableProps<T> {
  /** Middle columns only; ID and Actions are added inside Table when provided */
  columns: Column<T>[];
  data: T[];
  pagination?: TablePaginationProps;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  handelRowClick?: (row: T) => void;
  sort?: SortState;
  onSort?: (columnId: string, direction: SortDirection) => void;
  /** Fixed ID column (sticky start). When provided and show=true, prepended to columns. */
  idColumn?: TableIdColumnConfig;
  /** Fixed Actions column (sticky end). When provided, appended to columns. */
  actionsColumn?: TableActionsColumnConfig<T>;
}
