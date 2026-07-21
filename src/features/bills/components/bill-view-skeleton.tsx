import { BreadcrumbActionsSkeleton } from '@/features/products/components/breadcrumb-actions-skeleton';
import { SectionCardSkeleton } from '@/features/products/components/section-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function BillViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbActionsSkeleton />
      <SectionCardSkeleton titleWidth="w-40" fieldsCount={4} gridCols={2} />
      <div className="rounded-xl border border-gray-light-500 bg-white p-6 transition-all duration-200 dark:border-dark-card-border dark:bg-(--color-dark-surface-base)">
        <Skeleton className="mb-6 h-6 w-36" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-xl border border-light-card-border p-4 dark:border-dark-card-border">
            <Skeleton className="mb-4 h-10 w-full" />
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-light-card-border p-4 dark:border-dark-card-border">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-10 w-[220px]" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-light-card-border p-4 dark:border-dark-card-border"
                >
                  <div className="mb-4 flex items-center justify-between">
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
