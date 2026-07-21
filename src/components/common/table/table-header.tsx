import clsx from 'clsx';
import { SortAscending, SortDescending } from '@phosphor-icons/react';
import type { Column, SortDirection, SortState } from './types';
import type { CSSProperties } from 'react';

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sort?: SortState;
  onSort?: (columnId: string, direction: SortDirection) => void;
}

export function TableHeader<T>({ columns, sort, onSort }: TableHeaderProps<T>) {
  const handleSort = (col: Column<T>) => {
    if (!onSort || !col.sortable) return;

    const colId = col.id || (col.accessorKey as string);
    if (!colId) return;

    const isCurrent = sort?.columnId === colId;
    let direction: SortDirection = 'asc';

    if (isCurrent && sort?.direction === 'asc') {
      direction = 'desc';
    }

    onSort(colId, direction);
  };

  return (
    <thead className="dark:bg-dark-card-border bg-gray-light-200 sticky top-[-2px] z-50">
      <tr className="">
        {columns.map((col, index) => {
          const colId = col.id || (col.accessorKey as string);
          const isSorted = sort?.columnId === colId;
          const isSortable = col.sortable && !!onSort;
          const stickyStyle: CSSProperties | undefined = col.fixedStart
            ? {
                position: 'sticky',
                insetInlineStart: 0,
              }
            : col.fixedEnd
              ? {
                  position: 'sticky',
                  insetInlineEnd: 0,
                }
              : undefined;

          return (
            <th
              key={col.id || (col.accessorKey as string) || index}
              onClick={() => handleSort(col)}
              style={stickyStyle}
              className={clsx(
                'py-3 px-3 text-sm border border-light-card-border dark:border-dark-card-border text-gray-light-900 dark:text-dark-primary font-semibold whitespace-nowrap',
                col.headerClassName,
                col.fixedStart &&
                  'z-60 bg-gray-light-200 dark:bg-dark-card-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]',
                col.fixedEnd &&
                  'z-60 bg-gray-light-200 dark:bg-dark-card-border shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]',
                isSortable &&
                  'cursor-pointer select-none group hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
              )}
            >
              <div className="flex justify-between items-center gap-1">
                <span>{col.header}</span>
                {isSortable && (
                  <div
                    className={clsx(
                      'flex items-center justify-center transition-opacity text-gray-500',
                      isSorted
                        ? 'opacity-100 text-[var(--color-primary-dark-500)]'
                        : 'opacity-0 group-hover:opacity-50'
                    )}
                  >
                    {isSorted && sort?.direction === 'desc' ? (
                      <SortDescending size={16} weight="bold" />
                    ) : (
                      <SortAscending size={16} weight="bold" />
                    )}
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
