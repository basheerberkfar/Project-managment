import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import { Clock } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import TimePicker from './index';
import type { TimeFormat, TimeValue } from './types';
import { formatTime, getCurrentTime } from './utils';
import './time-picker.css';

type DropdownPosition = 'bottom' | 'top';

export interface TimePickerInputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'name' | 'defaultValue' | 'type'
> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  rules?: object;
  value?: TimeValue;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue | null) => void;
  format?: TimeFormat;
  showSeconds?: boolean;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  minuteStep?: number;
  secondStep?: number;
  showErrorOnTouchedOnly?: boolean;
}

const TimePickerInput = <TFieldValues extends FieldValues = FieldValues>({
  label,
  error,
  wrapperClassName,
  disabled,
  placeholder,
  className,
  control,
  name,
  rules,
  value,
  defaultValue,
  onChange,
  format = '12',
  showSeconds = false,
  minTime,
  maxTime,
  minuteStep = 1,
  secondStep = 1,
  showErrorOnTouchedOnly = true,
  ...inputProps
}: TimePickerInputProps<TFieldValues>) => {
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language as 'en' | 'ar';

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition>('bottom');
  const [internalValue, setInternalValue] = useState<TimeValue | null>(
    value ?? defaultValue ?? null
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;

    const inputRect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = showSeconds ? 420 : 380;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    if (spaceBelow >= dropdownHeight) {
      setDropdownPosition('bottom');
    } else if (spaceAbove >= dropdownHeight) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition(spaceBelow > spaceAbove ? 'bottom' : 'top');
    }
  }, [showSeconds]);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      calculatePosition();
    }, 0);

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    const handleScroll = () => {
      calculatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (value !== undefined) {
      setTimeout(() => {
        setInternalValue(value);
      }, 0);
    }
  }, [value]);

  const renderInput = (
    field?: {
      value?: unknown;
      onChange?: (value: unknown) => void;
      onBlur?: () => void;
      name?: string;
      ref?: React.Ref<HTMLInputElement>;
    },
    meta?: { error?: string }
  ) => {
    const isRHF = !!field;
    const effectiveValue = field ? (field.value as TimeValue) : internalValue;
    const effectiveError = meta?.error ?? error;

    const hasValue = !!effectiveValue;
    const shouldFloat = isFocused || hasValue;

    const displayValue = effectiveValue
      ? formatTime(effectiveValue, format, showSeconds, currentLocale)
      : '';

    const handleValueChange = (nextValue: TimeValue) => {
      setInternalValue(nextValue);
      if (isRHF) {
        field?.onChange?.(nextValue);
      } else {
        onChange?.(nextValue);
      }
    };

    const handleNowClick = () => {
      const now = getCurrentTime();
      handleValueChange(now);
      setIsOpen(false);
      setIsFocused(false);
    };

    const handleDoneClick = () => {
      if (!effectiveValue) {
        handleValueChange(getCurrentTime());
      }

      setIsOpen(false);
      setIsFocused(false);
    };

    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInternalValue(null);
      if (isRHF) {
        field?.onChange?.(null);
      } else {
        onChange?.(null);
      }
    };

    return (
      <div ref={containerRef} className={clsx('w-full', wrapperClassName)}>
        <div className="relative group">
          <input
            name={field?.name ?? name}
            ref={field?.ref}
            disabled={disabled}
            readOnly
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            value={displayValue}
            onFocus={() => {
              setIsFocused(true);
              if (!disabled) setIsOpen(true);
            }}
            onBlur={field?.onBlur}
            onClick={() => {
              if (!disabled) setIsOpen(true);
            }}
            placeholder={shouldFloat ? placeholder : ' '}
            {...inputProps}
            className={clsx(
              `
              w-full min-h-[36px] py-3 text-sm rounded-md
              outline-none transition-all duration-200
              ps-4 pe-12
              cursor-pointer
              text-start

              bg-white dark:bg-dark-card-background
              border border-gray-light-500
              dark:border-dark-card-border
              text-gray-light-900
              dark:text-white

              hover:border-gray-light-600
              dark:hover:border-gray-dark-700

              focus:bg-white
              focus:border-primary-light-500
              focus:ring-1
              focus:ring-primary-light-500/20
              dark:focus:bg-dark-card-background
              dark:focus:border-primary-dark-500
              dark:focus:ring-primary-dark-500/20

              disabled:bg-light-surface-disabled
              disabled:border-transparent
              disabled:cursor-not-allowed
              dark:disabled:bg-dark-surface-disabled

              ${effectiveError ? 'border-danger-500!' : ''}
            `,
              className
            )}
          />
          <div className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClearClick}
                className="w-4 h-4 flex items-center justify-center text-gray-light-600 hover:text-gray-light-800 dark:text-gray-dark-400 dark:hover:text-gray-dark-200 transition-colors"
              >
                <span className="text-xs">x</span>
              </button>
            )}
            <div className="w-4 h-4 flex items-center justify-center transition-colors text-gray-light-800 dark:text-gray-dark-500">
              <Clock size={16} />
            </div>
          </div>
          {label && (
            <label
              className={clsx(
                'absolute px-1.5 text-sm pointer-events-none transition-all duration-200 z-20 select-none',
                shouldFloat
                  ? 'top-0 start-3 -translate-y-1/2 text-xs font-medium bg-white dark:disabled:bg-transparent! dark:bg-dark-card-background'
                  : 'top-1/2 start-4 -translate-y-1/2',
                effectiveError
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-primary-light-500 dark:text-primary-dark-500'
                    : 'text-gray-light-700 dark:text-gray-dark-500'
              )}
            >
              {label}
            </label>
          )}

          {isOpen && !disabled && (
            <div
              ref={dropdownRef}
              className={clsx(
                'time-picker-dropdown',
                dropdownPosition === 'top'
                  ? 'time-picker-dropdown-top'
                  : 'time-picker-dropdown-bottom'
              )}
            >
              <TimePicker
                value={effectiveValue || undefined}
                onChange={handleValueChange}
                format={format}
                showSeconds={showSeconds}
                minTime={minTime}
                maxTime={maxTime}
                minuteStep={minuteStep}
                secondStep={secondStep}
                locale={currentLocale}
              />

              <div className="time-picker-input-footer">
                <button
                  type="button"
                  className="time-picker-input-footer-btn"
                  onClick={handleNowClick}
                >
                  {t('time.now')}
                </button>
                <button
                  type="button"
                  className="time-picker-input-footer-btn time-picker-input-footer-btn-primary"
                  onClick={handleDoneClick}
                >
                  {t('time.done')}
                </button>
              </div>
            </div>
          )}
        </div>

        {effectiveError && (
          <p className="mt-1.5 text-xs text-danger-500 font-medium ps-1 animate-in fade-in slide-in-from-top-1">
            {effectiveError}
          </p>
        )}
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={
          defaultValue as PathValue<TFieldValues, Path<TFieldValues>>
        }
        render={({ field, fieldState }) =>
          renderInput(field, {
            error:
              showErrorOnTouchedOnly && !fieldState.isTouched
                ? undefined
                : fieldState.error?.message,
          })
        }
      />
    );
  }

  return renderInput();
};

export default TimePickerInput;
