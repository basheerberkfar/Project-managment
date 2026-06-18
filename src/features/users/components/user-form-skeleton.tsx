import { BreadcrumbActionsSkeleton } from '@/features/products/components/breadcrumb-actions-skeleton';
import { SectionCardSkeleton } from '@/features/products/components/section-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function UserFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbActionsSkeleton />
      <SectionCardSkeleton titleWidth="w-40" fieldsCount={6} gridCols={2} />
      <div className="rounded-xl border border-gray-light-500 bg-white p-6 dark:border-dark-card-border dark:bg-(--color-dark-surface-base)">
        <Skeleton className="mb-6 h-6 w-36" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
