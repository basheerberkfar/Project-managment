import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';

export function BreadcrumbActionsSkeleton() {
  return (
    <div
      className={clsx(
        'flex items-center justify-between border-b dark:border-dark-card-border border-white pb-2 -mx-8 px-8'
      )}
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded" />
        <Skeleton className="h-9 w-20 rounded" />
      </div>
    </div>
  );
}
