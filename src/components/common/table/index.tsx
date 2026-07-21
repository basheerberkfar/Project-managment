/* eslint-disable react-refresh/only-export-components -- barrel file re-exports types and components */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { TableProps } from './types';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';
import { TableSkeleton } from './table-skeleton';
import { TableEmpty } from './table-empty';
import { TablePagination } from './table-pagination';
import { createIdColumn, createActionsColumn } from './table-fixed-columns';

// Re-export types for consumer usage
export * from './types';
export { TableActionsCell } from './table-actions-cell';
export type {
  TableActionItem,
  TableActionVariant,
  TableActionsCellProps,
} from './table-actions-cell';
export {
  createIdColumn,
  createActionsColumn,
  FIXED_ID_COLUMN_ID,
  FIXED_ACTIONS_COLUMN_ID,
} from './table-fixed-columns';
export type {
  CreateActionsColumnOptions,
  CreateIdColumnOptions,
  RowWithId,
} from './table-fixed-columns';
export { default as ActiveFilters } from './active-filters';
export type { ActiveFilterItem } from './active-filters';

/** Below this count, every row mounts to the DOM (no windowing). */
const VIRTUALIZATION_THRESHOLD = 50;
const VIRTUAL_ROW_HEIGHT = 44;
const VIRTUAL_VISIBLE_ROWS = 24;
const VIRTUAL_OVERSCAN = 8;
/** Cap loading skeleton rows so choosing 500/1000 page size does not mount thousands of DOM nodes. */
const TABLE_SKELETON_ROW_CAP = 25;

export function Table<T extends { id?: number | string | null }>({
  columns,
  data,
  pagination,
  className,
  isLoading = false,
  emptyMessage = 'No data available',
  sort,
  onSort,
  handelRowClick,
  actionsColumn,
}: TableProps<T>) {
  const { t } = useTranslation('common');
  const [scrollTop, setScrollTop] = useState(0);

  const fullColumns = useMemo(() => {
    const pageIndex = pagination?.pageIndex ?? 0;
    const pageSize = pagination?.pageSize ?? 10;
    const start = [createIdColumn<T>('#', { pageIndex, pageSize })];
    const end = actionsColumn ? [createActionsColumn<T>(actionsColumn)] : [];
    return [...start, ...columns, ...end];
  }, [columns, actionsColumn, pagination?.pageIndex, pagination?.pageSize]);

  const translatedEmptyMessage =
    emptyMessage === 'No data available'
      ? t('no_data_available')
      : emptyMessage;

  const shouldVirtualize =
    !isLoading && data.length >= VIRTUALIZATION_THRESHOLD;
  const virtualWindowSize = VIRTUAL_VISIBLE_ROWS + VIRTUAL_OVERSCAN * 2;
  const maxStartIndex = Math.max(0, data.length - virtualWindowSize);
  const startIndex = shouldVirtualize
    ? Math.min(
        maxStartIndex,
        Math.max(
          0,
          Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - VIRTUAL_OVERSCAN
        )
      )
    : 0;
  const endIndex = shouldVirtualize
    ? Math.min(data.length, startIndex + virtualWindowSize)
    : data.length;
  const visibleRows = shouldVirtualize
    ? data.slice(startIndex, endIndex)
    : data;
  const topSpacerHeight = shouldVirtualize
    ? startIndex * VIRTUAL_ROW_HEIGHT
    : 0;
  const bottomSpacerHeight = shouldVirtualize
    ? Math.max(0, (data.length - endIndex) * VIRTUAL_ROW_HEIGHT)
    : 0;

  return (
    <div
      className={clsx('flex flex-col gap-4 w-full flex-1 min-h-0', className)}
    >
      {/* Table Container - Takes remaining space */}
      <div className="flex-1 w-full min-h-[320px] overflow-hidden rounded-[10px] border dark:border-dark-card-border dark:bg-dark-card-background border-gray-light-500 bg-white flex flex-col">
        {/* Scrollable Area - min-h ensures body is never squashed below sticky header */}
        <div
          className="flex-1 min-h-[280px] overflow-auto no-scrollbar isolate"
          onScroll={
            shouldVirtualize
              ? (event) => setScrollTop(event.currentTarget.scrollTop)
              : undefined
          }
        >
          <table className="relative w-full min-w-max border-separate border-spacing-0 text-start">
            <TableHeader columns={fullColumns} sort={sort} onSort={onSort} />
            <tbody>
              {isLoading ? (
                <TableSkeleton
                  columns={fullColumns}
                  rowCount={Math.min(
                    pagination?.pageSize ?? 5,
                    TABLE_SKELETON_ROW_CAP
                  )}
                />
              ) : data.length > 0 ? (
                <>
                  {topSpacerHeight > 0 ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={fullColumns.length}
                        className="h-0 border-0 p-0"
                      >
                        <div style={{ height: topSpacerHeight }} />
                      </td>
                    </tr>
                  ) : null}
                  {visibleRows.map((row, rowIndex) => {
                    const actualIndex = startIndex + rowIndex;

                    return (
                      <TableRow
                        key={row.id ?? actualIndex}
                        data={row}
                        columns={fullColumns}
                        rowIndex={actualIndex}
                        handelRowClick={handelRowClick}
                      />
                    );
                  })}
                  {bottomSpacerHeight > 0 ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={fullColumns.length}
                        className="h-0 border-0 p-0"
                      >
                        <div style={{ height: bottomSpacerHeight }} />
                      </td>
                    </tr>
                  ) : null}
                </>
              ) : (
                <TableEmpty
                  message={translatedEmptyMessage}
                  colSpan={fullColumns.length}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Fixed at bottom */}
      {pagination && <TablePagination {...pagination} />}
    </div>
  );
}
