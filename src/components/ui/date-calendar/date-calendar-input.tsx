import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import { CalendarBlank } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import DateCalendar from './index';
import type { DateValue, DateRange, CalendarMode } from './types';
import { formatDate, formatDateRange } from './utils';
import './calendar.css';

type DropdownPosition = 'bottom' | 'top';

export interface DateCalendarInputProps<
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
  mode?: CalendarMode;
  control?: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  rules?: object;
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (value: Date | null) => void;
  rangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showErrorOnTouchedOnly?: boolean;
}

const DateCalendarInput = <TFieldValues extends FieldValues = FieldValues>({
  label,
  error,
  wrapperClassName,
  disabled,
  placeholder,
  className,
  mode = 'single',
  control,
  name,
  rules,
  value,
  defaultValue,
  onChange,
  rangeValue,
  onRangeChange,
  minDate,
  maxDate,
  disabledDates,
  showErrorOnTouchedOnly = true,
  ...inputProps
}: DateCalendarInputProps<TFieldValues>) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language as 'en' | 'ar';

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition>('bottom');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const portalTarget = typeof document !== 'undefined' ? document.body : null;
  const [internalValue, setInternalValue] = useState<DateValue>(value ?? null);
  const [internalRangeValue, setInternalRangeValue] = useState<DateRange>(
    rangeValue ?? { from: null, to: null }
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Calculate dropdown position based on available space
  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;

    const inputRect = containerRef.current.getBoundingClientRect();
    const dropdownHeight =
      dropdownRef.current?.getBoundingClientRect().height ?? 400;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const isRtl = currentLocale === 'ar';
    const targetRect =
      portalTarget && portalTarget !== document.body
        ? portalTarget.getBoundingClientRect()
        : null;

    // Check if there's enough space below
    if (spaceBelow >= dropdownHeight) {
      setDropdownPosition('bottom');
    } else if (spaceAbove >= dropdownHeight) {
      setDropdownPosition('top');
    } else {
      // If neither has enough space, prefer the side with more space
      setDropdownPosition(spaceBelow > spaceAbove ? 'bottom' : 'top');
    }

    setDropdownStyle({
      position:
        portalTarget && portalTarget !== document.body ? 'absolute' : 'fixed',
      top:
        spaceBelow >= dropdownHeight || spaceBelow > spaceAbove
          ? targetRect
            ? inputRect.bottom - targetRect.top + 8
            : inputRect.bottom + 8
          : targetRect
            ? Math.max(8, inputRect.top - targetRect.top - dropdownHeight - 8)
            : Math.max(8, inputRect.top - dropdownHeight - 8),
      left: isRtl
        ? 'auto'
        : targetRect
          ? inputRect.left - targetRect.left
          : Math.max(8, inputRect.left),
      right: isRtl
        ? targetRect
          ? targetRect.right - inputRect.right
          : Math.max(8, window.innerWidth - inputRect.right)
        : 'auto',
      width: 'fit-content',
      zIndex: 2147483647,
    });
  }, [currentLocale, portalTarget]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      calculatePosition();
    }, 0);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current) return;
      if (
        !containerRef.current.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
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
    const effectiveValue = field ? field.value : internalValue;
    const effectiveRangeValue = field
      ? (field.value as DateRange)
      : internalRangeValue;

    const hasValue =
      mode === 'single'
        ? !!effectiveValue
        : !!(effectiveRangeValue?.from || effectiveRangeValue?.to);
    const shouldFloat = isFocused || hasValue;

    const displayValue =
      mode === 'single'
        ? formatDate(effectiveValue as Date | null, currentLocale)
        : formatDateRange(
            effectiveRangeValue?.from || null,
            effectiveRangeValue?.to || null,
            currentLocale
          );

    const handleValueChange = (nextValue: DateValue | null) => {
      const normalized: Date | null = nextValue ?? null;
      setInternalValue(normalized);
      if (isRHF) {
        field?.onChange?.(normalized);
      } else {
        onChange?.(normalized);
      }

      setIsOpen(false);
      setIsFocused(false);
    };

    const handleRangeValueChange = (nextRange: DateRange) => {
      setInternalRangeValue(nextRange);
      if (isRHF) {
        field?.onChange?.(nextRange);
      } else {
        onRangeChange?.(nextRange);
      }

      // Close when range is complete
      if (nextRange.from && nextRange.to) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    const effectiveError = meta?.error ?? error;

    return (
      <div ref={containerRef} className={clsx('w-full', wrapperClassName)}>
        <div className="relative group">
          <input
            name={field?.name ?? name}
            ref={field?.ref}
            disabled={disabled}
            readOnly
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
              w-full min-h-[52px] py-3 text-sm rounded-lg
              outline-none transition-all duration-200
              ps-4 pe-12

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
              disabled:opacity-60
              dark:disabled:bg-dark-surface-disabled

              ${effectiveError ? 'border-danger-500' : ''}
            `,
              className
            )}
          />
          <div className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors text-gray-light-800 dark:text-gray-dark-500">
            <CalendarBlank size={16} />
          </div>
          {label && (
            <label
              className={clsx(
                'absolute px-1.5 text-sm pointer-events-none transition-all duration-200 z-20 select-none',
                shouldFloat
                  ? 'top-0 start-3 -translate-y-1/2 text-xs font-medium bg-white dark:bg-dark-card-background'
                  : 'top-1/2 start-4 -translate-y-1/2',
                effectiveError
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-primary-light-500 dark:text-primary-dark-500'
                    : 'text-gray-light-700 dark:text-gray-dark-500'
              )}
            >
              {label}
              {inputProps.required && (
                <span className="ms-1 text-danger-500">*</span>
              )}
            </label>
          )}

          {isOpen &&
            !disabled &&
            portalTarget &&
            createPortal(
              <div
                ref={dropdownRef}
                className={clsx(
                  'calendar-dropdown calendar-dropdown-portal pointer-events-auto',
                  dropdownPosition === 'top'
                    ? 'calendar-dropdown-portal-top'
                    : 'calendar-dropdown-portal-bottom'
                )}
                style={dropdownStyle}
              >
                {mode === 'single' ? (
                  <DateCalendar
                    mode="single"
                    value={(effectiveValue ?? null) as DateValue}
                    onChange={handleValueChange}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={disabledDates}
                    locale={currentLocale}
                  />
                ) : (
                  <DateCalendar
                    mode="range"
                    rangeValue={effectiveRangeValue}
                    onRangeChange={handleRangeValueChange}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabledDates={disabledDates}
                    locale={currentLocale}
                  />
                )}
              </div>,
              portalTarget
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

export default DateCalendarInput;
