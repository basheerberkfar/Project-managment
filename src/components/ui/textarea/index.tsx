import React from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import clsx from 'clsx';

export interface TextareaProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'defaultValue' | 'name'
> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  control?: Control<TFieldValues>;
  name?: string;
  rules?: object;
  defaultValue?: string | number | readonly string[] | undefined;
}

const Textarea = <TFieldValues extends FieldValues = FieldValues>({
  label,
  error,
  disabled,
  value,
  className,
  wrapperClassName,
  control,
  name,
  rules,
  defaultValue,
  ...props
}: TextareaProps<TFieldValues>) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value ?? '');

  // Keep internal value in sync with prop value
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const effectiveValue = value !== undefined ? value : internalValue;

  const renderTextarea = (field?: {
    value?: unknown;
    onChange?: (value: unknown) => void;
    onBlur?: () => void;
    name?: string;
    ref?: React.Ref<HTMLTextAreaElement>;
  }) => {
    const isRHF = !!field;
    const textValue = field ? field.value : effectiveValue;
    const hasValueLocal =
      textValue !== undefined && textValue !== '' && textValue !== null;
    const shouldFloatLocal = isFocused || hasValueLocal;

    return (
      <div className={clsx('w-full', wrapperClassName)}>
        <div className="relative group">
          <textarea
            {...props}
            name={field?.name ?? name}
            ref={field?.ref}
            disabled={disabled}
            value={textValue as string | number | readonly string[] | undefined}
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
              setInternalValue(e.target.value);
              if (isRHF) {
                field?.onChange?.(e.target.value);
              } else {
                props.onChange?.(e);
              }
            }}
            placeholder={shouldFloatLocal ? props.placeholder : ' '}
            className={clsx(
              'w-full min-h-[120px] py-3 px-4 text-sm rounded-lg outline-none transition-all duration-200 resize-none',
              'bg-white dark:bg-dark-card-background text-gray-light-900 dark:text-white',
              'disabled:bg-light-surface-disabled disabled:border-transparent disabled:opacity-60 dark:disabled:bg-dark-surface-disabled',
              error
                ? 'border border-danger-500 ring-1 ring-danger-500/30 focus:border-danger-500 focus:ring-danger-500/20 dark:focus:border-danger-500'
                : 'border border-gray-light-500 dark:border-dark-card-border hover:border-gray-light-600 dark:hover:border-gray-dark-700 focus:bg-white focus:border-(--color-focus-primary) focus:ring-1 focus:ring-(--color-focus-primary)/20 dark:focus:bg-dark-card-background dark:focus:border-(--color-focus-primary)',
              className
            )}
          />

          {label && (
            <label
              className={clsx(
                'absolute px-1.5 text-sm pointer-events-none transition-all duration-200 z-10 select-none',
                shouldFloatLocal
                  ? 'top-0 start-3 -translate-y-1/2 text-xs font-medium bg-white dark:bg-dark-card-background'
                  : 'top-4 start-4',
                error
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-(--color-focus-primary)'
                    : 'text-gray-light-700 dark:text-gray-dark-500'
              )}
            >
              {label}
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
        render={({ field }) => renderTextarea(field)}
      />
    );
  }

  return renderTextarea();
};

export default Textarea;
