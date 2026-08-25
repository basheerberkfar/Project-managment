import React from 'react';
import { clsx } from 'clsx';

/**
 * DangerButton variants as seen in the design:
 * - solid: Full background color
 * - outline: Bordered with transparent background
 * - ghost: No border, transparent background
 */
import { RingLoader } from 'react-spinners';

export type DangerButtonVariant = 'solid' | 'outline' | 'ghost';

export interface DangerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DangerButtonVariant;
  icon?: React.ReactNode;
  isLoading?: boolean;
  IconSize?: number;
}

/**
 * A specialized Danger Button component that follows the project's design system.
 * Supports solid, outline, and ghost variants.
 */
const DangerButton = ({
  className,
  variant = 'solid',
  icon,
  children,
  isLoading,
  IconSize = 16,
  disabled,
  ...props
}: DangerButtonProps) => {
  // baseStyles includes layout, typography, and transitional properties
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-[.875rem] font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none whitespace-nowrap';

  // Variant-specific styles using the danger color scale from globals.css
  const variants = {
    solid:
      'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 border border-transparent',
    outline:
      'bg-transparent border border-danger-500 text-danger-500 hover:bg-danger-50 active:bg-danger-100',
    ghost:
      'bg-transparent text-danger-500 hover:bg-danger-50 active:bg-danger-100 border border-transparent',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <RingLoader
          size={IconSize}
          color={variant === 'solid' ? 'white' : '#b04a4a'}
        />
      ) : (
        <>
          {icon && <span className="flex items-center shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
};

DangerButton.displayName = 'DangerButton';

export default DangerButton;
