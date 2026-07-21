import { forwardRef } from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom class for the skeleton shape/size */
  className?: string;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={clsx(
          'animate-pulse rounded-md bg-[var(--color-gray-dark-700)] opacity-20',
          'dark:opacity-30',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
