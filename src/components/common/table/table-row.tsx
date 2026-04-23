import clsx from 'clsx';
import type { Column } from './types';
import type { CSSProperties } from 'react';
import TableText from '../table-text';

interface TableRowProps<T> {
  data: T;
  columns: Column<T>[];
  rowIndex: number;
  handelRowClick?: (row: T) => void;
}

export function TableRow<T>({
  data,
  columns,
  rowIndex,
  handelRowClick,
}: TableRowProps<T>) {
  const isEvenRow = rowIndex % 2 === 0;
  const rowBackgroundClass = isEvenRow
    ? 'bg-gray-light-100 dark:bg-dark-card-surface'
    : 'bg-white dark:bg-dark-card-background';
  const stickyRowBackgroundClass = isEvenRow
    ? 'bg-gray-light-100 dark:bg-dark-card-surface'
    : 'bg-white dark:bg-dark-card-background';

  return (
    <tr
      className={clsx(
        'group transition-colors hover:bg-primary-dark-50/50 hover:dark:bg-dark-card-border/30',
        rowBackgroundClass
      )}
    >
      {columns.map((col, colIndex) => {
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
          <td
            key={col.id || (col.accessorKey as string) || colIndex}
            style={stickyStyle}
            className={clsx(
              'px-3 py-3 border font-normal border-gray-light-500 dark:border-dark-card-border text-sm text-gray-light-800 dark:text-dark-primary',
              !col.fixedStart && !col.fixedEnd && rowBackgroundClass,
              col.className,
              handelRowClick && !col.stopRowClick && 'cursor-pointer',
              col.fixedStart &&
                `z-20 ${stickyRowBackgroundClass} group-hover:bg-primary-dark-50 dark:group-hover:bg-dark-card-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]`,
              col.fixedEnd &&
                `z-20 ${stickyRowBackgroundClass} group-hover:bg-primary-dark-50 dark:group-hover:bg-dark-card-border shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]`
            )}
            onClick={() => {
              if (!col.stopRowClick) handelRowClick?.(data);
            }}
          >
            {col.render ? (
              col.render(data, rowIndex)
            ) : col.accessorKey ? (
              <TableText text={String(data[col.accessorKey])} />
            ) : null}
          </td>
        );
      })}
    </tr>
  );
}
