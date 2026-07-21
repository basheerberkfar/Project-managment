import React from 'react';
import { clsx } from 'clsx';

/**
 * SecondaryButton variants as seen in the design:
 * - solid: White/Light background in light mode, dark in dark mode
 * - outline: Bordered with transparent background
 * - ghost: No border, soft background or transparent
 */
export type SecondaryButtonVariant = 'solid' | 'outline' | 'ghost';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SecondaryButtonVariant;
  icon?: React.ReactNode;
}

/**
 * A specialized Secondary/Cancel Button component that follows the project's design system.
 */
const SecondaryButton = ({
  className,
  variant = 'solid',
  icon,
  children,
  type = 'button',
  ...props
}: SecondaryButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-[.875rem] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none whitespace-nowrap';

  const variants = {
    solid:
      'bg-white dark:bg-dark-card-background text-gray-light-800 dark:text-dark-card-text border border-gray-light-500 dark:border-dark-card-border hover:bg-gray-light-100 dark:hover:bg-dark-surface-disabled',
    outline:
      'bg-transparent border border-gray-light-500 text-gray-light-800 dark:text-gray-dark-200 hover:bg-gray-light-50 active:bg-gray-light-100',
    ghost:
      'bg-gray-light-300/30 dark:bg-dark-card-border/30 text-gray-light-800 dark:text-gray-dark-200 hover:bg-gray-light-300 dark:hover:bg-dark-card-border border border-transparent',
  };

  return (
    <button
      type={type}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;
