/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import type { Props as ReactSelectProps } from 'react-select';
import { XCircle, CaretDown } from '@phosphor-icons/react';
import Checkbox from '../checkbox';
import {
  Controller,
  type Control,
  type Path,
  type PathValue,
} from 'react-hook-form';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectInputProps extends Omit<
  ReactSelectProps<SelectOption, boolean>,
  'name' | 'defaultValue'
> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  isMulti?: boolean;
  isClearable?: boolean;
  onMenuScrollToBottom?: () => void;
  control?: Control<any>;
  name?: string;
  rules?: object;
  defaultValue?: SelectOption | SelectOption[] | null;
  required?: boolean;
  showErrorOnTouchedOnly?: boolean;
}

const SelectInput = ({
  label,
  error,
  isMulti = false,
  isDisabled,
  isClearable = !isMulti,
  value,
  wrapperClassName,
  leftIcon,
  onMenuScrollToBottom,
  control,
  name,
  rules,
  defaultValue,
  required,
  showErrorOnTouchedOnly = true,
  placeholder,
  ...props
}: SelectInputProps) => {
  const { t } = useTranslation('common');
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const menuScrollTopRef = React.useRef(0);
  const effectivePlaceholder = placeholder ?? t('select');
  const menuPortalTarget =
    typeof document !== 'undefined' ? document.body : undefined;

  // Sync internal value with prop
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const effectiveValue = value !== undefined ? value : internalValue;

  const hasSelectValue = (currentValue: unknown) =>
    isMulti
      ? Array.isArray(currentValue) && currentValue.length > 0
      : !!currentValue &&
        (typeof currentValue === 'object'
          ? (currentValue as any).value !== '' &&
            (currentValue as any).value !== null
          : String(currentValue).trim() !== '');

  const CustomOption = (props: any) => {
    const { innerProps, innerRef, data, isFocused, isSelected, isMulti } =
      props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200',
          isFocused
            ? 'bg-gray-light-200 dark:bg-dark-card-surface'
            : 'bg-white dark:bg-dark-card-background',
          isSelected &&
            !isMulti &&
            'bg-primary-light-50/50 dark:bg-(--color-focus-primary)/10',
          'text-gray-light-900 dark:text-(--color-dark-primary)'
        )}
      >
        {isMulti && (
          <Checkbox
            checked={isSelected}
            onChange={() => {}}
            className="pointer-events-none scale-90"
          />
        )}
        {data.icon && (
          <div className="flex items-center">
            <div className="w-5 h-5 flex items-center justify-center text-gray-light-700 dark:text-gray-dark-500">
              {data.icon}
            </div>
            {!isMulti && (
              <div className="h-4 w-px bg-gray-light-500 dark:bg-dark-card-border mx-3" />
            )}
          </div>
        )}
        <span className="text-sm font-medium text-gray-light-900 dark:text-(--color-dark-primary)">
          {data.label}
        </span>
      </div>
    );
  };

  const CustomMenuList = (props: any) => {
    const { children, innerRef } = props;
    const menuListRef = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
      if (menuListRef.current) {
        menuListRef.current.scrollTop = menuScrollTopRef.current;
      }
    }, [children]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      menuScrollTopRef.current = scrollTop;
      if (
        scrollHeight > clientHeight &&
        Math.ceil(scrollTop + clientHeight) >= scrollHeight - 2
      ) {
        onMenuScrollToBottom?.();
      }
    };

    return (
      <div
        ref={(node) => {
          menuListRef.current = node;

          if (typeof innerRef === 'function') {
            innerRef(node);
            return;
          }

          if (innerRef) {
            innerRef.current = node;
          }
        }}
        onScroll={handleScroll}
        style={props.getStyles('menuList', props)}
      >
        {children}
      </div>
    );
  };

  const renderSelect = (
    field?: {
      value?: unknown;
      onChange?: (value: unknown) => void;
      onBlur?: () => void;
      name?: string;
    },
    errorOverride?: string
  ) => {
    const currentValue = field ? field.value : effectiveValue;
    const shouldFloat = isFocused || hasSelectValue(currentValue);
    const displayError = errorOverride ?? error;

    const CustomControl = ({ children, ...controlProps }: any) => {
      const { innerRef, innerProps } = controlProps;
      return (
        <div
          ref={innerRef}
          {...innerProps}
          className={clsx(
            'flex items-center px-4 transition-all duration-200 rounded-lg min-h-[52px] relative cursor-pointer',
            isDisabled
              ? 'bg-light-surface-disabled dark:bg-dark-surface-disabled border border-transparent opacity-60'
              : 'bg-white dark:bg-dark-card-background',
            displayError
              ? 'border border-danger-500 ring-1 ring-danger-500/30'
              : isFocused
                ? 'border border-(--color-focus-primary) ring-1 ring-(--color-focus-primary)/20'
                : 'border border-gray-light-500 dark:border-dark-card-border',
            !isDisabled &&
              !displayError &&
              !isFocused &&
              'hover:border-gray-light-600 dark:hover:border-gray-dark-700'
          )}
        >
          {leftIcon && (
            <div className="flex items-center me-3 select-none">
              <div
                className={clsx(
                  'w-6 h-6 flex items-center justify-center transition-colors duration-200',
                  displayError
                    ? 'text-danger-500'
                    : isFocused
                      ? 'text-(--color-focus-primary)'
                      : 'text-gray-light-700 dark:text-gray-dark-500'
                )}
              >
                {leftIcon}
              </div>
              <div
                className={clsx(
                  'h-5 w-px ms-3 transition-colors duration-200',
                  displayError
                    ? 'bg-danger-500'
                    : isFocused
                      ? 'bg-(--color-focus-primary)'
                      : 'bg-gray-light-500 dark:bg-dark-card-border'
                )}
              />
            </div>
          )}
          <div className="flex-1 flex items-center overflow-hidden">
            {children}
          </div>
        </div>
      );
    };

    return (
      <div className={clsx('w-full', wrapperClassName)}>
        <div className="relative  group">
          {label && (
            <label
              className={clsx(
                'absolute px-1.5 text-sm pointer-events-none transition-all duration-200 z-10 select-none',
                shouldFloat
                  ? 'top-0 start-3 -translate-y-1/2 text-xs font-medium bg-white dark:bg-dark-card-background'
                  : 'top-1/2 start-4 -translate-y-1/2',
                displayError
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-(--color-focus-primary)'
                    : 'text-gray-light-700 dark:text-gray-dark-500',
                leftIcon && !shouldFloat && 'ps-[65px]'
              )}
            >
              {label}
              {required && <span className="ms-1 text-danger-500">*</span>}
            </label>
          )}

          <ReactSelect
            {...props}
            placeholder={effectivePlaceholder}
            isMulti={isMulti}
            isDisabled={isDisabled}
            isClearable={isClearable}
            value={currentValue as any}
            isSearchable
            menuPortalTarget={menuPortalTarget}
            menuShouldBlockScroll={false}
            closeMenuOnScroll={false}
            captureMenuScroll
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              field?.onBlur?.();
            }}
            onChange={(newValue, actionMeta) => {
              setInternalValue(newValue as any);
              field?.onChange?.(newValue);
              props.onChange?.(newValue, actionMeta);
            }}
            menuPosition="fixed"
            menuPlacement="auto"
            classNames={{
              menu: () =>
                '!bg-white dark:!bg-dark-card-background !border !border-gray-light-500 dark:!border-dark-card-border !pointer-events-auto',
              menuPortal: () => '!z-[2147483647] !pointer-events-auto',
            }}
            components={{
              Control: CustomControl,
              IndicatorSeparator: () => null,
              DropdownIndicator: (props) => (
                <div className="px-2 flex items-center justify-center">
                  <CaretDown
                    weight="bold"
                    className={clsx(
                      'w-4 h-4 transition-all duration-300',
                      isFocused
                        ? 'text-(--color-focus-primary)'
                        : 'text-gray-light-700 dark:text-gray-dark-500',
                      props.selectProps.menuIsOpen && 'rotate-180'
                    )}
                  />
                </div>
              ),
              MultiValueRemove: ({ innerProps }) => (
                <div
                  {...innerProps}
                  className="cursor-pointer flex items-center hover:text-danger-500 transition-colors"
                >
                  <XCircle weight="fill" className="w-4 h-4" />
                </div>
              ),
              Option: CustomOption,
              MenuList: CustomMenuList,
            }}
            styles={{
              control: () => ({
                display: 'none',
              }),
              valueContainer: (base) => ({
                ...base,
                padding: '0px',
                margin: '0px',
                display: 'flex',
                gap: '4px',
              }),
              input: (base) => ({
                ...base,
                color: 'var(--select-value-color)',
                margin: '0px',
                padding: '0px',
                '& input': {
                  fontFamily: 'inherit',
                  color: 'inherit !important',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: 'var(--select-value-color)',
                margin: '0px',
                fontSize: '14px',
                fontWeight: '400',
              }),
              placeholder: (base) => ({
                ...base,
                color: shouldFloat
                  ? 'var(--select-placeholder-visible)'
                  : 'transparent',
                margin: '0px',
                fontSize: '14px',
              }),
              menu: (base) => ({
                ...base,
                zIndex: 2147483647,
                backgroundColor: 'transparent',
                borderRadius: 'var(--rounded-2)',
                marginTop: '8px',
                padding: '4px',
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease-out',
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 2147483647,
                pointerEvents: 'auto',
              }),
              menuList: (base) => ({
                ...base,
                padding: '4px',
                backgroundColor: 'inherit',
                '&::-WebkitScrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'var(--select-menu-scrollbar-thumb)',
                  borderRadius: '3px',
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: 'var(--select-multivalue-bg)',
                borderRadius: 'var(--rounded-1)',
                padding: '2px 8px',
                margin: '2px',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'var(--color-focus-primary)',
                },
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: 'var(--select-multivalue-label)',
                fontSize: '12px',
                fontWeight: '500',
              }),
              dropdownIndicator: (base, state) => ({
                ...base,
                padding: '0px',
                color: state.isFocused
                  ? 'var(--color-focus-primary)'
                  : 'var(--color-gray-light-700)',
                transition: 'all 0.3s ease',
                transform: state.selectProps.menuIsOpen
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
                '&:hover': {
                  color: 'var(--color-focus-primary)',
                },
              }),
              clearIndicator: (base) => ({
                ...base,
                padding: '0px',
                marginRight: '8px',
                color: 'var(--color-gray-light-600)',
                '&:hover': {
                  color: 'var(--color-danger-500)',
                },
              }),
            }}
          />
        </div>

        {displayError && (
          <p className="mt-1.5 text-xs text-danger-500 font-medium ps-1 animate-in fade-in slide-in-from-top-1">
            {displayError}
          </p>
        )}
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name as Path<any>}
        control={control}
        rules={rules}
        defaultValue={defaultValue as PathValue<any, Path<any>>}
        render={({ field, fieldState }) => {
          const message = fieldState.error?.message;
          const effectiveError =
            (showErrorOnTouchedOnly && !fieldState.isTouched) || !message
              ? error
              : typeof message === 'string'
                ? message
                : Array.isArray(message)
                  ? message[0]
                  : error;
          return renderSelect(field, effectiveError);
        }}
      />
    );
  }

  return renderSelect();
};

export default SelectInput;
