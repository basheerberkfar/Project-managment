import type { Column } from './types';
import type { TableActionItem } from './table-actions-cell';
import { TableActionsCell } from './table-actions-cell';
import TableText from '../table-text';

/** Column id for the fixed ID column - use in columnsConfig for show/hide */
export const FIXED_ID_COLUMN_ID = 'id';

/** Column id for the fixed Actions column */
export const FIXED_ACTIONS_COLUMN_ID = 'actions';

export interface RowWithId {
  id?: number | string | null;
}

/** Format id: 1-9 as 01, 02, ... 09; 10+ as normal */
function formatIdDisplay(id: number | string | undefined): string {
  if (id === undefined || id === null || id === '') return '';
  const n = typeof id === 'string' ? parseInt(id, 10) : Number(id);
  if (Number.isNaN(n)) return String(id);
  return n < 10 ? `0${n}` : String(n);
}

export interface CreateIdColumnOptions {
  pageIndex?: number;
  pageSize?: number;
}

/**
 * Creates the standard fixed ID column (sticky start, hideable via columnsConfig).
 * Use FIXED_ID_COLUMN_ID in your columnsConfig to control visibility.
 * IDs 1-9 display as 01, 02, ... 09; 10+ display as-is.
 * When pageIndex and pageSize are provided, the displayed number is continuous across pages.
 * pageIndex is 1-based (page 1 = first page): page 1 → 1,2,3... ; page 2 → pageSize+1, ...
 */
export function createIdColumn<T extends RowWithId>(
  header: string,
  options?: CreateIdColumnOptions
): Column<T> {
  const pageIndex1Based = options?.pageIndex ?? 1;
  const pageSize = options?.pageSize ?? 10;
  const zeroBasedPage = pageIndex1Based >= 1 ? pageIndex1Based - 1 : 0;
  return {
    id: FIXED_ID_COLUMN_ID,
    header,
    accessorKey: 'id' as keyof T,
    fixedStart: true,
    className: 'w-[72px] min-w-[72px]',
    render: (_row, index) => {
      const displayNumber = zeroBasedPage * pageSize + index + 1;
      return <TableText text={formatIdDisplay(displayNumber)} />;
    },
  };
}

export interface CreateActionsColumnOptions<T> {
  header: string;
  actions: TableActionItem<T>[];
  checkPermission?: (permission: string) => boolean;
  maxIcons?: number;
}

/**
 * Creates the standard fixed Actions column (sticky end, menu when > maxIcons).
 */
export function createActionsColumn<T>(
  options: CreateActionsColumnOptions<T>
): Column<T> {
  const { header, actions, checkPermission, maxIcons = 3 } = options;
  return {
    id: FIXED_ACTIONS_COLUMN_ID,
    header,
    fixedEnd: true,
    stopRowClick: true,
    className: 'w-[100px] min-w-[100px]',
    render: (row) => (
      <TableActionsCell
        row={row}
        actions={actions}
        checkPermission={checkPermission}
        maxIcons={maxIcons}
      />
    ),
  };
}
