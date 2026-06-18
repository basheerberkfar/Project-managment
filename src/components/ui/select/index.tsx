/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import clsx from 'clsx';
import { CaretDown, XCircle } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ReactSelect, {
  components,
  type ControlProps,
  type DropdownIndicatorProps,
  type ClearIndicatorProps,
  type GroupBase,
  type MenuListProps,
  type MultiValueRemoveProps,
  type OptionProps,
} from 'react-select';
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

type SelectChangeMeta = {
  action: 'select-option' | 'clear';
};

export interface SelectInputProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  isMulti?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  options?: SelectOption[];
  value?: SelectOption | SelectOption[] | null;
  defaultValue?: SelectOption | SelectOption[] | null;
  placeholder?: string;
  required?: boolean;
  onChange?: (
    value: SelectOption | SelectOption[] | null,
    actionMeta?: SelectChangeMeta
  ) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onMenuScrollToBottom?: () => void;
  onInputChange?: (
    newValue: string,
    actionMeta: { action: string }
  ) => string | void;
  inputValue?: string;
  menuIsOpen?: boolean;
  control?: Control<any>;
  name?: string;
  rules?: object;
  showErrorOnTouchedOnly?: boolean;
  filterOption?: null | ((option: SelectOption, inputValue: string) => boolean);
  [key: string]: unknown;
}

type SelectInstanceProps = {
  leftIcon?: React.ReactNode;
  isFocused: boolean;
  hasError: boolean;
  isDisabled?: boolean;
};

type OptionInstanceProps = {
  direction: 'rtl' | 'ltr';
};

type MenuListInstanceProps = {
  onMenuScrollToBottom?: () => void;
};

type MultiValueRemoveInstanceProps = {
  clearLabel: string;
  isDisabled?: boolean;
};

export const Select = ReactSelect;
export const SelectTrigger = ReactSelect;
export const SelectValue = ReactSelect;
export const SelectContent = ReactSelect;
export const SelectItem = ReactSelect;

const getSingleOption = (
  value?: SelectOption | SelectOption[] | null
): SelectOption | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

const getMultiOptions = (
  value?: SelectOption | SelectOption[] | null
): SelectOption[] => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

const areSelectValuesEqual = (
  a?: SelectOption | SelectOption[] | null,
  b?: SelectOption | SelectOption[] | null
) => {
  const aList = Array.isArray(a) ? a : a ? [a] : [];
  const bList = Array.isArray(b) ? b : b ? [b] : [];

  if (aList.length !== bList.length) return false;

  return aList.every(
    (item, index) => String(item.value) === String(bList[index]?.value)
  );
};

const Control = ({
  children,
  ...props
}: ControlProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  const { selectProps, isFocused } = props;
  const instanceProps = (selectProps as any)
    .instanceProps as SelectInstanceProps;

  return (
    <components.Control {...props}>
      {instanceProps.leftIcon ? (
        <div className="me-3 flex select-none items-center">
          <div
            className={clsx(
              'flex h-6 w-6 items-center justify-center transition-colors duration-200',
              instanceProps.hasError
                ? 'text-danger-500'
                : isFocused
                  ? 'text-(--color-focus-primary)'
                  : 'text-gray-light-700 dark:text-gray-dark-500'
            )}
          >
            {instanceProps.leftIcon}
          </div>
          <div
            className={clsx(
              'ms-3 h-5 w-px transition-colors duration-200',
              instanceProps.hasError
                ? 'bg-danger-500'
                : isFocused
                  ? 'bg-(--color-focus-primary)'
                  : 'bg-gray-light-500 dark:bg-dark-card-border'
            )}
          />
        </div>
      ) : null}
      {children}
    </components.Control>
  );
};

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>
) => (
  <components.DropdownIndicator {...props}>
    <CaretDown
      weight="bold"
      className={clsx(
        'h-4 w-4 transition-all duration-300',
        props.isFocused
          ? 'text-(--color-focus-primary)'
          : 'text-gray-light-700 dark:text-gray-dark-500',
        props.selectProps.menuIsOpen && 'rotate-180'
      )}
    />
  </components.DropdownIndicator>
);

const ClearIndicator = (
  props: ClearIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>
) => (
  <components.ClearIndicator {...props}>
    <XCircle
      weight="fill"
      className="h-4 w-4 text-gray-light-600 transition-colors hover:text-danger-500 dark:text-gray-dark-500"
    />
  </components.ClearIndicator>
);

const MultiValueRemove = (
  props: MultiValueRemoveProps<SelectOption, true, GroupBase<SelectOption>>
) => {
  const instanceProps = (props.selectProps as any)
    .instanceProps as MultiValueRemoveInstanceProps;

  if (instanceProps.isDisabled) {
    return null;
  }

  return (
    <components.MultiValueRemove
      {...props}
      innerProps={{
        ...props.innerProps,
        'aria-label': `${instanceProps.clearLabel} ${props.data.label}`,
      }}
    >
      <XCircle weight="fill" className="h-3.5 w-3.5" />
    </components.MultiValueRemove>
  );
};

const Option = (
  props: OptionProps<SelectOption, boolean, GroupBase<SelectOption>>
) => {
  const instanceProps = (props.selectProps as any)
    .instanceProps as OptionInstanceProps;

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        {props.data.icon ? (
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center text-gray-light-700 dark:text-gray-dark-500">
              {props.data.icon}
            </div>
            <div
              className={clsx(
                'h-4 w-px bg-gray-light-500 dark:bg-dark-card-border',
                instanceProps.direction === 'rtl' ? 'me-3' : 'ms-3'
              )}
            />
          </div>
        ) : null}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const MenuList = (
  props: MenuListProps<SelectOption, boolean, GroupBase<SelectOption>>
) => {
  const instanceProps = (props.selectProps as any)
    .instanceProps as MenuListInstanceProps;

  return (
    <components.MenuList
      {...props}
      innerProps={{
        ...props.innerProps,
        onScroll: (event) => {
          props.innerProps.onScroll?.(event);

          const target = event.currentTarget;
          if (
            target.scrollHeight > target.clientHeight &&
            Math.ceil(target.scrollTop + target.clientHeight) >=
              target.scrollHeight - 2
          ) {
            instanceProps.onMenuScrollToBottom?.();
          }
        },
      }}
    />
  );
};

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
  options = [],
  onChange,
  onBlur,
  onFocus,
  onMenuOpen,
  onMenuClose,
  onInputChange,
  inputValue,
  menuIsOpen,
  isLoading = false,
  filterOption = (option, currentInputValue) =>
    option.label.toLowerCase().includes(currentInputValue.toLowerCase()),
}: SelectInputProps) => {
  const { t, i18n } = useTranslation('common');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpenInternal, setIsOpenInternal] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<
    SelectOption | SelectOption[] | null
  >(value ?? defaultValue ?? null);
  const [internalInputValue, setInternalInputValue] = React.useState('');

  const effectivePlaceholder = placeholder ?? t('select');
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const portalTarget =
    typeof window !== 'undefined' ? document.body : undefined;

  React.useEffect(() => {
    if (value === undefined) return;

    setInternalValue((prev) => {
      if (areSelectValuesEqual(prev, value)) {
        return prev;
      }

      return value;
    });
  }, [value]);

  React.useEffect(() => {
    if (inputValue !== undefined) {
      setInternalInputValue(inputValue);
    }
  }, [inputValue]);

  const effectiveValue = value !== undefined ? value : internalValue;
  const effectiveOpen = menuIsOpen ?? isOpenInternal;
  const searchValue =
    inputValue !== undefined ? inputValue : internalInputValue;

  const syncValue = React.useCallback(
    (
      nextValue: SelectOption | SelectOption[] | null,
      field?: {
        onChange?: (value: SelectOption | SelectOption[] | null) => void;
      },
      actionMeta?: SelectChangeMeta
    ) => {
      setInternalValue(nextValue);
      field?.onChange?.(nextValue);
      onChange?.(nextValue, actionMeta);
    },
    [onChange]
  );

  const handleMenuOpen = React.useCallback(() => {
    if (menuIsOpen === undefined) {
      setIsOpenInternal(true);
    }

    setIsFocused(true);
    onMenuOpen?.();
    onFocus?.();
  }, [menuIsOpen, onFocus, onMenuOpen]);

  const handleMenuClose = React.useCallback(() => {
    if (menuIsOpen === undefined) {
      setIsOpenInternal(false);
    }

    setIsFocused(false);
    onMenuClose?.();
  }, [menuIsOpen, onMenuClose]);

  const handleInputChange = React.useCallback(
    (nextValue: string, meta: { action: string }) => {
      if (inputValue === undefined) {
        setInternalInputValue(nextValue);
      }

      const result = onInputChange?.(nextValue, meta);
      return typeof result === 'string' ? result : nextValue;
    },
    [inputValue, onInputChange]
  );

  const customFilterOption = React.useCallback(
    (
      candidate: { data: SelectOption; label: string; value: string },
      currentInputValue: string
    ) => {
      if (filterOption === null) return true;
      return filterOption(candidate.data, currentInputValue);
    },
    [filterOption]
  );

  const renderSelect = (
    field?: {
      value?: unknown;
      onChange?: (value: SelectOption | SelectOption[] | null) => void;
      onBlur?: () => void;
      name?: string;
    },
    errorOverride?: string
  ) => {
    const currentValue = field
      ? ((field.value !== undefined ? field.value : effectiveValue) as
          | SelectOption
          | SelectOption[]
          | null
          | undefined)
      : effectiveValue;
    const currentOption = getSingleOption(currentValue);
    const currentOptions = getMultiOptions(currentValue);
    const shouldFloat =
      isFocused || Boolean(searchValue) || currentOptions.length > 0;
    const displayError = errorOverride ?? error;
    const selectedValue = isMulti ? currentOptions : currentOption;

    return (
      <div className={clsx('w-full', wrapperClassName)}>
        <div className="group relative">
          {label ? (
            <label
              className={clsx(
                'pointer-events-none absolute z-10 px-1.5 text-sm transition-all duration-200 select-none',
                shouldFloat
                  ? 'start-3 top-0 -translate-y-1/2 bg-white text-xs font-medium dark:bg-dark-card-background'
                  : 'start-4 top-1/2 -translate-y-1/2',
                displayError
                  ? 'text-danger-500'
                  : isFocused
                    ? 'text-(--color-focus-primary)'
                    : 'text-gray-light-700 dark:text-gray-dark-500',
                leftIcon && !shouldFloat && 'ps-[65px]'
              )}
            >
              {label}
              {required ? (
                <span className="ms-1 text-danger-500">*</span>
              ) : null}
            </label>
          ) : null}

          <ReactSelect<SelectOption, boolean, GroupBase<SelectOption>>
            aria-label={label ?? effectivePlaceholder}
            classNamePrefix="luxury-select"
            isMulti={isMulti}
            isDisabled={isDisabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isRtl={direction === 'rtl'}
            menuIsOpen={effectiveOpen}
            menuPosition="fixed"
            menuPlacement="auto"
            options={options}
            value={
              selectedValue as SelectOption | readonly SelectOption[] | null
            }
            inputValue={searchValue}
            closeMenuOnSelect={!isMulti}
            hideSelectedOptions={isMulti}
            blurInputOnSelect={!isMulti}
            backspaceRemovesValue
            controlShouldRenderValue
            unstyled
            placeholder={shouldFloat ? effectivePlaceholder : ''}
            noOptionsMessage={() => t('no_data_available')}
            loadingMessage={() => t('loading')}
            filterOption={customFilterOption}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              field?.onBlur?.();
              onBlur?.();
              if (!effectiveOpen) {
                setIsFocused(false);
              }
            }}
            onInputChange={handleInputChange}
            onChange={(nextValue, meta) => {
              if (meta.action === 'clear') {
                syncValue(isMulti ? [] : null, field, { action: 'clear' });
                return;
              }

              if (isMulti) {
                syncValue((nextValue as SelectOption[]) ?? [], field, {
                  action: 'select-option',
                });
                return;
              }

              syncValue((nextValue as SelectOption | null) ?? null, field, {
                action: 'select-option',
              });
            }}
            components={{
              Control,
              DropdownIndicator,
              ClearIndicator,
              IndicatorSeparator: null,
              Option,
              MenuList,
              MultiValueRemove,
            }}
            {...({
              instanceProps: {
                leftIcon,
                isFocused,
                hasError: Boolean(displayError),
                isDisabled,
                direction,
                onMenuScrollToBottom,
                clearLabel: t('clear'),
              },
            } as any)}
            classNames={{
              control: ({
                isFocused: controlFocused,
                isDisabled: controlDisabled,
              }) =>
                clsx(
                  'relative flex h-[52px] min-h-[52px] w-full items-center rounded-lg px-4 text-start text-gray-light-900 transition-all duration-200 outline-none dark:text-(--color-dark-primary)',
                  controlDisabled
                    ? 'cursor-not-allowed border border-transparent bg-light-surface-disabled text-gray-light-900 opacity-60 dark:bg-dark-surface-disabled dark:text-(--color-dark-primary)'
                    : 'cursor-pointer bg-white dark:bg-dark-card-background',
                  displayError
                    ? 'border border-danger-500 ring-1 ring-danger-500/30'
                    : controlFocused || effectiveOpen
                      ? 'border border-(--color-focus-primary) ring-1 ring-(--color-focus-primary)/20'
                      : 'border border-gray-light-500 dark:border-dark-card-border',
                  !controlDisabled &&
                    !displayError &&
                    !(controlFocused || effectiveOpen) &&
                    'hover:border-gray-light-600 dark:hover:border-gray-dark-700'
                ),
              valueContainer: () =>
                clsx(
                  'min-h-[50px] min-w-0 flex-1 py-0',
                  leftIcon ? 'ps-0' : ''
                ),
              placeholder: () =>
                'm-0 text-sm font-normal text-gray-light-700 dark:text-gray-dark-500',
              singleValue: () =>
                'm-0 block truncate text-sm font-normal text-gray-light-900 dark:text-(--color-dark-primary)',
              input: () =>
                'm-0 py-0 text-sm font-normal text-gray-light-900 dark:text-(--color-dark-primary)',
              menu: () =>
                'z-[2147483647] mt-2 overflow-hidden rounded-lg border border-gray-light-500 bg-white p-1 text-start shadow-lg dark:border-dark-card-border dark:bg-dark-card-background',
              menuList: () => 'max-h-60 overflow-y-auto p-1',
              option: ({ isFocused: optionFocused, isSelected }) =>
                clsx(
                  'cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-light-900 outline-none transition-colors duration-200 dark:text-(--color-dark-primary)',
                  optionFocused &&
                    'bg-gray-light-200 dark:bg-dark-card-surface',
                  isSelected &&
                    'bg-primary-light-50/50 dark:bg-(--color-focus-primary)/10'
                ),
              multiValue: () =>
                'my-0.5 rounded-md bg-primary-light-100 px-2 py-1 dark:bg-dark-card-surface',
              multiValueLabel: () =>
                'px-0 py-0 text-xs font-medium text-primary-light-800 dark:text-white',
              multiValueRemove: () =>
                'ms-1 flex items-center rounded-sm p-0 text-primary-light-800 transition-colors hover:text-danger-500 dark:text-white',
              clearIndicator: () => 'p-0 me-2',
              dropdownIndicator: () => 'p-0',
              indicatorsContainer: () =>
                'h-full gap-2 items-center self-stretch',
              noOptionsMessage: () =>
                'px-4 py-3 text-sm text-gray-light-700 dark:text-gray-dark-500',
              loadingMessage: () =>
                'px-4 py-3 text-sm text-gray-light-700 dark:text-gray-dark-500',
            }}
            styles={{
              input: (base) => ({
                ...base,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 2147483647,
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 2147483647,
                pointerEvents: 'auto',
              }),
            }}
            menuPortalTarget={portalTarget}
          />
        </div>

        {displayError ? (
          <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 ps-1 text-xs font-medium text-danger-500">
            {displayError}
          </p>
        ) : null}
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
