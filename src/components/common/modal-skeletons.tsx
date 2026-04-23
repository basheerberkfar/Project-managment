import { Skeleton } from '@/components/ui/skeleton';
import SectionCard from '@/components/ui/section-card';

function FormFieldSkeleton({ isTextarea = false }: { isTextarea?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton
        className={`${isTextarea ? 'h-24' : 'h-[52px]'} w-full rounded-lg`}
      />
    </div>
  );
}

function DetailCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-3 sm:p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

export function ContractTypeFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton isTextarea />
        <FormFieldSkeleton isTextarea />
      </div>
    </div>
  );
}

export function ProductUnitFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton isTextarea />
        <FormFieldSkeleton isTextarea />
      </div>
    </div>
  );
}

export function BillTypeFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton isTextarea />
        <FormFieldSkeleton isTextarea />
      </div>
    </div>
  );
}

export function ProductGroupFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SectionCard title="" className="mb-0 rounded-2xl p-4 sm:p-5">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormFieldSkeleton isTextarea />
          <FormFieldSkeleton isTextarea />
        </div>
      </SectionCard>

      <SectionCard title="" className="mb-0 rounded-2xl p-4 sm:p-5">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
      </SectionCard>
    </div>
  );
}

export function ContractTypeViewModalSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DetailCardSkeleton />
        <DetailCardSkeleton />
        <DetailCardSkeleton />
        <DetailCardSkeleton />
      </div>

      <div className="mt-4 rounded-xl border border-gray-light-500 bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductUnitViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BillTypeViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductGroupViewModalSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SectionCard title="" className="mb-0 rounded-2xl p-4 sm:p-5">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DetailCardSkeleton />
          <DetailCardSkeleton />
          <DetailCardSkeleton />
          <DetailCardSkeleton />
        </div>
      </SectionCard>

      <SectionCard title="" className="mb-0 rounded-2xl p-4 sm:p-5">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DetailCardSkeleton />
          <DetailCardSkeleton />
          <DetailCardSkeleton />
          <DetailCardSkeleton />
          <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-3 sm:p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export function TaskTypeFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton isTextarea />
        <FormFieldSkeleton isTextarea />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <div className="rounded-lg border border-gray-light-500 bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TaskTypeViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CarLogTypeFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
    </div>
  );
}

export function CarLogTypeViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StoreOperationFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <FormFieldSkeleton />
    </div>
  );
}

export function StoreOperationViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BillReasonFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <FormFieldSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
    </div>
  );
}

export function BillReasonViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ContractTemplateFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <FormFieldSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
    </div>
  );
}

export function ContractTemplateViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ContractSectionFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-light-500 bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="rounded-lg border border-gray-light-500 bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ContractSectionViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ReasonFormModalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
      <div className="rounded-lg border border-gray-light-500 bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

export function ReasonViewModalSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <DetailCardSkeleton key={index} />
      ))}
    </div>
  );
}
