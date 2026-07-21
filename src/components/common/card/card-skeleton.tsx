import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';

interface CardSkeletonProps {
  cardContainer?: string;
}

/** Skeleton that mirrors the shape of Card (icon + title + subTitle) for loading states */
export function CardSkeleton({ cardContainer }: CardSkeletonProps) {
  return (
    <div
      className={clsx(
        'dark:bg-dark-card-background bg-white border border-light-card-border dark:border-dark-card-border flex items-center justify-start gap-3 sm:gap-4 px-3 py-3 sm:px-[10px] sm:py-[6px] rounded-[4px] min-w-0 flex-1',
        cardContainer
      )}
    >
      <Skeleton className="w-9 h-9 shrink-0 rounded-[4px]" />
      <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
        <Skeleton className="h-3.5 w-20 sm:w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
