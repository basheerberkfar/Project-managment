import { Skeleton } from '@/components/ui/skeleton';

export function ImageUploaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
