import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import clsx from 'clsx';

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export const Toggle = ({
  checked,
  onChange,
  disabled = false,
  loading = false,
  className,
  onClick,
}: ToggleProps) => {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={(e) => {
        onClick?.(e);
        if (!loading) onChange(!checked);
      }}
      className={clsx(
        'relative cursor-pointer w-12 h-6 rounded-full transition-colors duration-200 flex items-center shrink-0',
        {
          'bg-primary-dark-500 dark:bg-primary-dark-500': checked && !disabled,
          'bg-[var(--color-primary-dark-500)]/30 dark:bg-[var(--color-primary-dark-500)]/30':
            !checked && !disabled,
          'bg-primary-dark-500/55 dark:bg-primary-dark-500/55 cursor-not-allowed':
            checked && disabled,
          'bg-[var(--color-primary-dark-500)]/18 dark:bg-[var(--color-primary-dark-500)]/18 cursor-not-allowed':
            !checked && disabled,
        },
        className
      )}
    >
      {/* loading overlay */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        </span>
      )}

      {/* thumb */}
      <span
        className={clsx(
          'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200',
          {
            'translate-x-6 rtl:-translate-x-6': checked,
            'translate-x-1 rtl:-translate-x-1': !checked,
            'opacity-70': loading,
          }
        )}
      />
    </button>
  );
};

type FormToggleProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  loading?: boolean;
};

const FormToggle = <T extends FieldValues>({
  name,
  control,
  disabled = false,
  loading = false,
}: FormToggleProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Toggle
          checked={Boolean(value)}
          onChange={onChange}
          disabled={disabled}
          loading={loading}
        />
      )}
    />
  );
};

export default FormToggle;
