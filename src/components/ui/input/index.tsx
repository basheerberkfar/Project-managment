import React from 'react';
import { UploadSimple } from '@phosphor-icons/react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value ?? '');
  const fileInputId = React.useId();

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

    if (type === 'file') {
      const selectedFileName =
        typeof internalValue === 'string' && internalValue
          ? internalValue
          : t('no_file_chosen');

      return (
        <div className={clsx('w-full', wrapperClassName)}>
          <div className="relative group">
            <input
              {...props}
              id={props.id ?? fileInputId}
              name={field?.name ?? name}
              ref={field?.ref}
              type="file"
              disabled={disabled}
              className="sr-only"
              onFocus={(event) => {
                setIsFocused(true);
                props.onFocus?.(event);
              }}
              onBlur={(event) => {
                setIsFocused(false);
                props.onBlur?.(event);
                field?.onBlur?.();
              }}
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setInternalValue(selectedFile?.name ?? '');
                if (isRHF) {
                  field?.onChange?.(selectedFile);
                } else {
                  props.onChange?.(event);
                }
              }}
            />
            <label
              htmlFor={props.id ?? fileInputId}
              className={clsx(
                'flex min-h-[72px] w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 transition-all duration-200',
                'bg-white text-gray-light-900 dark:bg-dark-card-background dark:text-white',
                disabled &&
                  'cursor-not-allowed bg-light-surface-disabled opacity-60 dark:bg-dark-surface-disabled',
                error
                  ? 'border-danger-500 ring-1 ring-danger-500/30'
                  : isFocused
                    ? 'border-(--color-focus-primary) ring-1 ring-(--color-focus-primary)/20'
                    : 'border-gray-light-500 hover:border-gray-light-600 dark:border-dark-card-border dark:hover:border-gray-dark-700',
                className
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-light-100 text-primary-light-500 dark:bg-dark-card-surface dark:text-primary-dark-300">
                <UploadSimple size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {selectedFileName}
                </span>
                <span className="mt-1 block truncate text-xs text-light-text-secondary dark:text-dark-secondary">
                  {t('choose_file')}
                </span>
              </span>
            </label>

            {label && (
              <span
                className={clsx(
                  'absolute start-3 top-0 z-20 -translate-y-1/2 bg-white px-1.5 text-xs font-medium transition-colors dark:bg-dark-card-background',
                  error
                    ? 'text-danger-500'
                    : isFocused
                      ? 'text-(--color-focus-primary)'
                      : 'text-gray-light-700 dark:text-gray-dark-500'
                )}
              >
                {label}
                {props.required && (
                  <span className="ms-1 text-danger-500">*</span>
                )}
              </span>
            )}
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-danger-500 font-medium ps-1 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>
      );
    }

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
