import { X } from '@phosphor-icons/react';
import clsx from 'clsx';

export interface ActiveFilterItem {
  id: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilterItem[];
  onRemove: (id: string) => void;
  className?: string;
}

export default function ActiveFilters({
  filters,
  onRemove,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-2 min-h-[36px]',
        className
      )}
    >
      {filters.map(({ id, label, value }) => (
        <span
          key={id}
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
            'text-sm font-medium',
            'bg-gray-light-200 dark:bg-dark-card-surface',
            'text-gray-light-900 dark:text-(--color-dark-primary)',
            'border border-gray-light-400 dark:border-dark-card-border'
          )}
        >
          <span className="text-gray-light-700 dark:text-gray-dark-500">
            {label}:
          </span>
          <span>{value}</span>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className={clsx(
              'p-0.5 rounded cursor-pointer hover:bg-gray-light-400 dark:hover:bg-dark-card-border',
              'text-gray-light-700 dark:text-gray-dark-500',
              'hover:text-gray-light-900 dark:hover:text-(--color-dark-primary)',
              'transition-colors'
            )}
            aria-label="Remove filter"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </span>
      ))}
    </div>
  );
}
