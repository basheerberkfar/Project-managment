import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';

/** Skeleton that mirrors the display product page: breadcrumb, section cards with label/value rows, image area */
export function DisplayProductSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb + actions */}
      <div
        className={clsx(
          'flex items-center justify-between border-b dark:border-dark-card-border border-white pb-2 -mx-8 px-8'
        )}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-10 rounded" />
          <Skeleton className="h-9 w-10 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Section: Product information */}
        <div
          className={clsx(
            'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
          )}
        >
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>

        {/* Section: Inventory */}
        <div
          className={clsx(
            'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
          )}
        >
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Images */}
        <div
          className={clsx(
            'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200'
          )}
        >
          <Skeleton className="h-6 w-28 mb-4" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
