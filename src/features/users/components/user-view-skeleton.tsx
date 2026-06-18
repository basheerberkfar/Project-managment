import { BreadcrumbActionsSkeleton } from '@/features/products/components/breadcrumb-actions-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function UserViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbActionsSkeleton />
      <div className="rounded-xl border border-gray-light-500 bg-white p-6 dark:border-dark-card-border dark:bg-(--color-dark-surface-base)">
        <Skeleton className="mb-6 h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton
                className={index === 6 ? 'h-7 w-24 rounded-full' : 'h-5 w-40'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
