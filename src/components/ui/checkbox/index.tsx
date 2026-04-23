import { useEffect, useRef } from 'react';
import clsx from 'clsx';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  indeterminate?: boolean;
};

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  className,
  label,
  indeterminate = false,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={clsx(
        'relative inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[1]"
      />

      <span
        className={clsx(
          'w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors',
          'peer-focus-visible:ring-1 peer-focus-visible:ring-primary-light-500/30 peer-focus-visible:border-primary-light-500',
          'dark:peer-focus-visible:ring-primary-dark-500/30 dark:peer-focus-visible:border-primary-dark-500',
          checked || indeterminate
            ? 'bg-primary-light-500 border-primary-light-500 dark:bg-primary-dark-500 dark:border-primary-dark-500'
            : 'bg-white dark:bg-dark-card-surface border-gray-light-800 dark:border-dark-card-border'
        )}
      >
        {indeterminate && (
          <svg
            viewBox="0 0 24 24"
            className="w-[12px] h-[12px] text-white dark:text-dark-navbar"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        )}
        {checked && !indeterminate && (
          <svg
            viewBox="0 0 24 24"
            className="w-[12px] h-[12px] text-white dark:text-dark-navbar"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {label && <span className="text-sm dark:text-white">{label}</span>}
    </label>
  );
}
