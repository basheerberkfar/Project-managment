import React from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import clsx from 'clsx';
import { addEveryThreeDigits } from '@/utils/helpers';
export interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'name'
> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  control?: Control<TFieldValues>;
  name?: string;
  rules?: object;
  defaultValue?: string | number | readonly string[] | undefined;
}

const Input = <TFieldValues extends FieldValues = FieldValues>({
  type = 'text',
  label,
  error,
  disabled,
  value,
  className,
  wrapperClassName,
  leftIcon,
  rightIcon,
  onRightIconClick,
  control,
  name,
  rules,
  defaultValue,
  ...props
}: InputProps<TFieldValues>) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value ?? '');

  // Keep internal value in sync with prop value
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const effectiveValue = value !== undefined ? value : internalValue;

  const renderInput = (field?: {
    value?: unknown;
    onChange?: (value: unknown) => void;
    onBlur?: () => void;
    name?: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => {
    const isRHF = !!field;
    const inputValue = field ? field.value : effectiveValue;
    const hasValueLocal =
      inputValue !== undefined && inputValue !== '' && inputValue !== null;
    const shouldFloatLocal = isFocused || hasValueLocal;

    const formattedValue =
      type === 'number'
        ? ((v) => {
            if (v === undefined || v === '' || v === null) return '';
            const s = v.toString().replace(/\./g, '');
            const n = Number(s);
            return isNaN(n) ? s : addEveryThreeDigits(n, '.');
          })(inputValue)
        : inputValue;

    return (
      <div className={clsx('w-full', wrapperClassName)}>
        <div className="relative group">
          {leftIcon && (
            <div
              className={clsx(
                'absolute start-0 top-1/2 -translate-y-1/2 h-6 w-11 flex items-center justify-center border-e z-10 transition-colors duration-200',
                error
                  ? 'border-danger-500 text-danger-500'
                  : isFocused
                    ? 'border-(--color-focus-primary) text-(--color-focus-primary)'
                    : 'border-gray-light-500 dark:border-dark-card-border text-gray-light-700 dark:text-gray-dark-500'
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            name={field?.name ?? name}
            ref={field?.ref}
            type={type === 'number' ? 'text' : type}
            disabled={disabled}
            value={
              formattedValue as string | number | readonly string[] | undefined
            }
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
              field?.onBlur?.();
            }}
            onChange={(e) => {
              if (type === 'number') {
                const rawValue = e.target.value.replace(/\D/g, '');
                e.target.value = rawValue;
                setInternalValue(rawValue);
                if (isRHF) {
                  field?.onChange?.(rawValue === '' ? '' : Number(rawValue));
                } else {
                  props.onChange?.(e);
                }
                return;
              }

              setInternalValue(e.target.value);
              if (isRHF) {
                field?.onChange?.(e.target.value);
              } else {
                props.onChange?.(e);
              }
            }}
            placeholder={
              label
                ? shouldFloatLocal
                  ? props.placeholder
                  : ' '
                : props.placeholder
            }
            className={clsx(
              'w-full min-h-[52px] py-3 text-sm rounded-lg outline-none transition-all duration-200',
              leftIcon ? 'ps-14' : 'ps-4',
              rightIcon ? 'pe-12' : 'pe-4',
              'bg-white dark:bg-dark-card-background text-gray-light-900 dark:text-white',
              'disabled:bg-light-surface-disabled disabled:border-transparent disabled:opacity-60 dark:disabled:bg-dark-surface-disabled',
              error
                ? 'border border-danger-500 ring-1 ring-danger-500/30 focus:border-danger-500 focus:ring-danger-500/20 dark:focus:border-danger-500'
                : 'border border-gray-light-500 dark:border-dark-card-border hover:border-gray-light-600 dark:hover:border-gray-dark-700 focus:border-(--color-focus-primary) focus:ring-1 focus:ring-(--color-focus-primary)/20 dark:focus:bg-dark-card-background dark:focus:border-(--color-focus-primary)',
              className
            )}
          />

          {rightIcon && (
            <div
              onClick={!disabled ? onRightIconClick : undefined}
              className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center cursor-pointer transition-colors text-gray-light-800 dark:text-gray-dark-500 hover:text-(--color-focus-primary) z-10"
            >
              {rightIcon}
            </div>
          )}

          {label && (
            <label
              className={clsx(
                'absolute px-1.5 text-sm pointer-events-none transition-all duration-200 z-20 select-none',
                shouldFloatLocal
                  ? 'top-0 start-3 -translate-y-1/2 text-xs font-medium bg-white dark:bg-dark-card-background'
                  : 'top-1/2 start-4 -translate-y-1/2',
                error
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-(--color-focus-primary)'
                    : 'text-gray-light-700 dark:text-gray-dark-500',
                leftIcon && !shouldFloatLocal && 'ps-11'
              )}
            >
              {label}
              {props.required && (
                <span className="ms-1 text-danger-500">*</span>
              )}
            </label>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-danger-500 font-medium ps-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name as Path<TFieldValues>}
        control={control}
        rules={rules}
        defaultValue={
          defaultValue as PathValue<TFieldValues, Path<TFieldValues>>
        }
        render={({ field }) => renderInput(field)}
      />
    );
  }

  return renderInput();
};

export default Input;
