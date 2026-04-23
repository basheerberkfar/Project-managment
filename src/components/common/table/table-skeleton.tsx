import { Skeleton } from '@/components/ui/skeleton';
import type { Column } from './types';

interface TableSkeletonProps<T> {
  columns: Column<T>[];
  rowCount?: number;
}

export function TableSkeleton<T>({
  columns,
  rowCount = 5,
}: TableSkeletonProps<T>) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <tr
          key={idx}
          className="border-b border-[var(--color-dark-card-border)] last:border-0"
        >
          {columns.map((_, colIdx) => (
            <td key={colIdx} className="py-4 px-6">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
