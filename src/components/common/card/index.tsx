import React from 'react';
import clsx from 'clsx';

interface CardProps {
  cardContainer?: string;
  icon: React.ReactNode;
  iconStyle?: string;
  title: string;
  subTitle: string;
}
export { CardSkeleton } from './card-skeleton';
export default function Card({
  cardContainer,
  icon,
  iconStyle,
  title,
  subTitle,
}: CardProps) {
  return (
    <div
      className={clsx(
        'dark:bg-dark-card-background bg-white border border-light-card-border dark:border-dark-card-border flex items-center justify-start gap-3 sm:gap-4 px-3 py-3 sm:px-[10px] sm:py-[6px] rounded-[4px] min-w-0 flex-1',
        cardContainer
      )}
    >
      <div
        className={clsx(
          'dark:bg-focus-primary bg-primary-light-500 w-9 h-9 sm:w-[36px] sm:h-[36px] shrink-0 rounded-[4px] flex items-center justify-center p-1.5 sm:p-[8px]'
        )}
      >
        <div
          className={clsx(
            'w-5 h-5 sm:w-[20px] sm:h-[20px] text-white dark:text-dark-card-background flex items-center justify-center',
            iconStyle
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
        <h3 className="text-[0.75rem] sm:text-[0.81rem] dark:text-gray-light-800 text-gray-light-800 truncate">
          {title}
        </h3>
        <p className="text-[0.9375rem] sm:text-[1rem] dark:text-dark-primary text-nature-black font-medium tabular-nums">
          {subTitle}
        </p>
      </div>
    </div>
  );
}
