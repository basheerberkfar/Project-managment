import React from 'react';
import clsx from 'clsx';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-(--color-dark-card-background) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 mb-6 transition-all duration-200',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-gray-light-900 dark:text-dark-primary mb-6 select-none">
        {title}
      </h3>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
};

export default SectionCard;
