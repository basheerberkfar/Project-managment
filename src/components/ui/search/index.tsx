import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { MagnifyingGlass } from '@phosphor-icons/react';

type SearchProps = {
  name?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  searchContainer?: string;
  className?: string;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Search = ({
  name,
  value,
  disabled,
  placeholder,
  onChange,
  onBlur,
  onKeyDown,
  className,
  searchContainer,
}: SearchProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={clsx('relative ', searchContainer)}>
      <MagnifyingGlass
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-primary-light-500"
      />

      <input
        type="search"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? t('search')}
        className={clsx(
          'w-full bg-white dark:bg-dark-card-background',
          'border border-gray-light-500 dark:border-dark-card-border',
          'text-dark-secondary text-[0.81rem]',
          'rounded-[4px] py-[10px] pl-[40px] pr-[12px]',
          disabled && 'opacity-60 cursor-not-allowed',
          className
        )}
      />
    </div>
  );
};

export default Search;
