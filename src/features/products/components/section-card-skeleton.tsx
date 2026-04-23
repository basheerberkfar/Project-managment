import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';

export interface SectionCardSkeletonProps {
  titleWidth?: string;
  titleClassName?: string;
  /** عدد صفوف الحقول في الـ grid */
  fieldsCount?: number;
  /** عدد أعمدة الـ grid (افتراضي 5) */
  gridCols?: 1 | 2 | 3 | 5;
  /** إن كان يوجد textarea تحت الحقول */
  hasTextarea?: boolean;
}

export function SectionCardSkeleton({
  titleWidth = 'w-48',
  titleClassName,
  fieldsCount = 5,
  gridCols = 5,
  hasTextarea = false,
}: SectionCardSkeletonProps) {
  const gridClass =
    gridCols === 5
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
      : gridCols === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2';

  return (
    <div
      className={clsx(
        'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
      )}
    >
      <Skeleton className={clsx('h-6 mb-6', titleWidth, titleClassName)} />
      <div className={clsx('grid gap-4', gridClass)}>
        {Array.from({ length: fieldsCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
      {hasTextarea && (
        <div className="w-full mt-4 flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
      )}
    </div>
  );
}
