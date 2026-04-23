import clsx from 'clsx';
import React from 'react';

type SquareButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
  Icon?: React.ElementType;
};

const SquareButton = ({
  onClick,
  disabled = false,
  Icon,
  type = 'button',
  className,
  ariaLabel = 'Filter',
}: SquareButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'w-[40px] h-[40px] border rounded-sm cursor-pointer',
        'bg-white dark:bg-dark-card-background',
        'border-light-card-border dark:border-dark-card-background',
        'p-[12px]',
        'transition-all duration-300',
        'hover:bg-gray-light-200 dark:hover:bg-primary-dark-900',
        'flex items-center justify-center',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {Icon && (
        <Icon
          size={16}
          className="text-primary-light-500 dark:text-primary-dark-500"
        />
      )}
    </button>
  );
};

export default SquareButton;
