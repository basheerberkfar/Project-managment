import { useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { ChangeEvent } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import FormInput from '@/components/ui/formInput';
import Input from '@/components/ui/input';
import SquareButton from '@/components/ui/squareButton';
import SettingModal from '../setting-modal';
import ColumnsList from '../column-list';
import FilterModal from '../filter-modal';
import PrimaryButton from '@/components/ui/button/primary-button';
import SecondaryButton from '@/components/ui/button/secondary-button';
import {
  Funnel,
  MagnifyingGlass,
  SlidersHorizontal,
  Plus,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import type { TableColumnConfig } from '@/types/tableColumnConfig';

export interface ActiveFilterChip {
  id: string;
  label: string;
  value: string;
}

interface TableActionsProps {
  children?: ReactNode;

  /** Page title shown before the search field (e.g. "المستخدمون", "فواتير المشتريات") */
  pageTitle?: ReactNode;

  /** When provided, replaces the default search input */
  searchInput?: ReactNode;
  /** When searchInput is not provided: use FormInput for search (requires control + searchName) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  /** Field name for search (e.g. "search") - use with control for FormInput default */
  searchName?: string;
  /** Label for the default FormInput search */
  searchLabel?: string;
  /** Placeholder for the default FormInput search */
  searchPlaceholder?: string;
  /** Used only when searchInput and control+searchName are not provided */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Used only when searchInput and control+searchName are not provided */
  value?: string;

  /** Active filter chips to show below search; each chip has a remove button */
  activeFilters?: ActiveFilterChip[];
  /** Called when user removes a filter chip (by filter id) */
  onRemoveFilter?: (filterId: string) => void;
  /** Optional explicit handler to clear the search value chip */
  onClearSearch?: () => void;

  handleReset: () => void;
  /** Called when user clicks "Apply filter" in the filter modal */
  handleFilter: () => void;
  /** Optional: called when the filter modal is opened (e.g. to sync form to applied values) */
  onFilterModalOpen?: () => void;
  /** Backward-compatible alias for onFilterModalOpen */
  onFilterOpen?: () => void;

  handleSettingReset: () => void;
  /** Called when user clicks Apply in settings modal; receives new columns so store can be updated with the same value */
  handelApply: (newColumns?: TableColumnConfig[]) => void;

  columns: TableColumnConfig[];
  setColumns: Dispatch<SetStateAction<TableColumnConfig[]>>;
  /** Default columns (all visible) used when opening modal and when Reset is clicked */
  defaultColumns?: TableColumnConfig[];

  buttonChildren?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Permission key for the default primary button when using buttonChildren/onClick */
  primaryPermission?: string;
  /** Permission checker for the default primary button */
  checkPermission?: (permission: string) => boolean;
  /** When provided, renders this node instead of the default primary button (ignores buttonChildren/onClick). Use with Can for permission-based visibility. */
  primaryButton?: ReactNode;
  secondaryButtonChildren?: ReactNode;
  secondaryButtonIcon?: ReactNode;
  onSecondaryClick?: React.MouseEventHandler<HTMLButtonElement>;
  hasFilter?: boolean;
  hasOrdering?: boolean;
}

export default function TableActions({
  children,
  pageTitle,
  searchInput,
  control,
  searchName,
  searchLabel,
  searchPlaceholder,
  activeFilters,
  onRemoveFilter,
  onClearSearch,
  handleReset,
  handleFilter,
  onFilterModalOpen,
  onFilterOpen,
  handleSettingReset,
  handelApply,
  columns,
  setColumns,
  defaultColumns,
  onChange,
  value,
  buttonChildren,
  onClick,
  primaryPermission,
  checkPermission,
  primaryButton,
  secondaryButtonChildren,
  secondaryButtonIcon,
  onSecondaryClick,
  hasFilter = true,
  hasOrdering = true,
}: TableActionsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Draft state for column config: changes apply only when user clicks "Apply"
  const [draftColumns, setDraftColumns] = useState<TableColumnConfig[]>(() =>
    defaultColumns?.length
      ? defaultColumns.map((col) => ({
          ...col,
          visible: true,
        }))
      : columns
  );

  const useFormInputSearch = searchInput === undefined && control && searchName;

  const handleOpenSettings = () => {
    const initial =
      columns && columns.length > 0
        ? columns.map((c) => ({ ...c }))
        : defaultColumns?.length
          ? defaultColumns.map((col) => ({
              ...col,
              visible: true,
            }))
          : [];
    setDraftColumns(initial);
    setIsSettingsOpen(true);
  };

  const handleApplyColumns = () => {
    setColumns(draftColumns);
    handelApply(draftColumns);
    setIsSettingsOpen(false);
  };

  const handleResetColumns = () => {
    const defaultList = defaultColumns?.length
      ? defaultColumns
      : columns.map((c) => ({ ...c, visible: true }));
    setDraftColumns(defaultList);
    handleSettingReset();
  };

  const trimmedSearchValue = typeof value === 'string' ? value.trim() : '';
  const hasSearchChip =
    Boolean(trimmedSearchValue) &&
    searchInput === undefined &&
    !useFormInputSearch;

  const mergedActiveFilters = [
    ...(hasSearchChip &&
    !(activeFilters ?? []).some((filter) => filter.id === 'search')
      ? [
          {
            id: 'search',
            label: searchLabel ?? searchPlaceholder ?? 'Search',
            value: trimmedSearchValue,
          } satisfies ActiveFilterChip,
        ]
      : []),
    ...(activeFilters ?? []),
  ];

  const handleRemoveActiveFilter = (filterId: string) => {
    if (filterId === 'search') {
      if (onClearSearch) {
        onClearSearch();
        return;
      }

      onChange?.({
        target: { value: '' },
      } as ChangeEvent<HTMLInputElement>);
      return;
    }

    onRemoveFilter?.(filterId);
  };

  const hasAnyActiveFilters = mergedActiveFilters.length > 0;

  const canRenderDefaultPrimaryButton = Boolean(
    buttonChildren &&
    onClick &&
    (!primaryPermission ||
      (checkPermission && checkPermission(primaryPermission)))
  );

  const hasAddOrSecondaryButton = Boolean(
    primaryButton !== undefined ||
    canRenderDefaultPrimaryButton ||
    secondaryButtonChildren
  );

  const showSeparator = (hasOrdering || hasFilter) && hasAddOrSecondaryButton;

  return (
    <>
      <div className={clsx('flex flex-col gap-2')}>
        <div
          className={clsx(
            'flex lg:items-center items-start justify-between w-full flex-col md:flex-row gap-4'
          )}
        >
          <div className="flex items-center gap-4 w-full">
            {pageTitle != null && (
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {pageTitle}
              </h1>
            )}
            {searchInput !== undefined ? (
              <div className=" w-full max-w-full">{searchInput}</div>
            ) : useFormInputSearch ? (
              <div className="w-full max-w-full">
                <FormInput
                  name={searchName as Path<FieldValues>}
                  control={control}
                  label={searchLabel}
                  placeholder={searchPlaceholder}
                  leftIcon={
                    <MagnifyingGlass size={18} className="text-gray-500" />
                  }
                />
              </div>
            ) : (
              <Input
                onChange={onChange}
                value={value}
                placeholder={searchPlaceholder}
                leftIcon={
                  <MagnifyingGlass
                    size={18}
                    className="text-primary-light-500"
                  />
                }
                wrapperClassName="md:w-[350px] w-full max-w-full!"
                className="h-[34px]! min-h-[44px]! rounded-xl border-gray-light-300 bg-white py-0 text-[0.95rem] text-gray-light-900 placeholder:text-gray-light-700 ps-14 pe-4 rounded-none!"
              />
            )}
          </div>
          <div className={clsx('flex items-center gap-4')}>
            {hasOrdering && (
              <SquareButton
                Icon={SlidersHorizontal}
                className="border border-gray-light-500 dark:border-dark-card-border"
                onClick={handleOpenSettings}
              />
            )}
            {hasFilter && (
              <SquareButton
                Icon={Funnel}
                className="border border-gray-light-500 dark:border-dark-card-border"
                onClick={() => {
                  (onFilterOpen ?? onFilterModalOpen)?.();
                  setIsFilterOpen(true);
                }}
              />
            )}
            {showSeparator && <div className="h-5 bg-dark-card-border w-px" />}
            {secondaryButtonChildren && (
              <SecondaryButton
                icon={secondaryButtonIcon}
                onClick={onSecondaryClick}
              >
                {secondaryButtonChildren}
              </SecondaryButton>
            )}
            {primaryButton !== undefined
              ? primaryButton
              : canRenderDefaultPrimaryButton && (
                  <PrimaryButton icon={<Plus />} onClick={onClick}>
                    {buttonChildren}
                  </PrimaryButton>
                )}
          </div>
        </div>
        {hasAnyActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {mergedActiveFilters.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-light-200 dark:bg-dark-card-border/60 text-sm text-gray-light-800 dark:text-gray-200 px-2.5 py-1"
              >
                <span className="font-medium text-gray-400 dark:text-gray-400">
                  {chip.label}:
                </span>
                <span>{chip.value}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveActiveFilter(chip.id)}
                  className="p-0.5 rounded hover:bg-gray-light-300 dark:hover:bg-white/10 text-gray-400 dark:text-gray-400 hover:text-gray-light-900 dark:hover:text-white transition-colors"
                  aria-label="Remove filter"
                >
                  <X size={14} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {isFilterOpen && (
        <FilterModal
          open={isFilterOpen}
          setOpen={setIsFilterOpen}
          children={children}
          handelReset={handleReset}
          handelFilter={() => {
            handleFilter();
            setIsFilterOpen(false);
          }}
        />
      )}
      {isSettingsOpen && (
        <SettingModal
          open={isSettingsOpen}
          setOpen={setIsSettingsOpen}
          handelReset={handleResetColumns}
          handelApply={handleApplyColumns}
        >
          <ColumnsList columns={draftColumns} onChange={setDraftColumns} />
        </SettingModal>
      )}
    </>
  );
}
