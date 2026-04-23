import { BreadcrumbActionsSkeleton } from '@/features/products/components/breadcrumb-actions-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';

export function RoleViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbActionsSkeleton />
      <div
        className={clsx(
          'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
        )}
      >
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div
        className={clsx(
          'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
        )}
      >
        <Skeleton className="h-6 w-36 mb-6" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-xl border border-light-card-border dark:border-dark-card-border p-4">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-light-card-border dark:border-dark-card-border p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-light-card-border dark:border-dark-card-border p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-5 rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((__, childIndex) => (
                      <Skeleton
                        key={childIndex}
                        className="h-11 w-full rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
