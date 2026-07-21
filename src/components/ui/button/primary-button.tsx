import React from 'react';
import { clsx } from 'clsx';
import { RingLoader } from 'react-spinners';

export type PrimaryButtonVariant = 'solid' | 'outline';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PrimaryButtonVariant;
  icon?: React.ReactNode;
  isSubmitting?: boolean;
  IconSize?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PrimaryButton({
  className,
  variant = 'solid',
  icon,
  children,
  disabled,
  type,
  isSubmitting,
  IconSize,
  onClick,
  ...props
}: PrimaryButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-[.875rem] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none whitespace-nowrap';

  const variants = {
    solid: clsx(
      'bg-primary-light-500 text-white text-[0.87rem] dark:bg-primary-dark-500',
      ' dark:hover:bg-dark-primary-hover hover:bg-dark-primary-hover',
      disabled &&
        'bg-light-surface-disabled text-dark-text-disabled cursor-not-allowed'
    ),
    outline:
      'bg-transparent border border-color-focus-primary text-color-focus-primary dark:text-color-focus-primary ',
  };

  return (
    <button
      disabled={disabled || isSubmitting}
      type={type}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
      onClick={onClick}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      {isSubmitting ? (
        <RingLoader
          className="text-white dark:text-primary-dark-500"
          size={IconSize}
          color="white"
        />
      ) : (
        children && <span>{children}</span>
      )}
    </button>
  );
}
