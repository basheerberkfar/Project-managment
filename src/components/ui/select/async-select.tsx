import { useState, useEffect, useRef, useCallback } from 'react';
import SelectInput from './index';
import type { SelectInputProps, SelectOption } from './index';

interface AsyncSelectInputProps extends Omit<SelectInputProps, 'options'> {
  fetchOptions: (params: {
    page: number;
    search: string;
    limit: number;
  }) => Promise<{
    data: SelectOption[];
    hasMore: boolean;
  }>;
  debounceTime?: number;
  valueOption?: SelectOption | SelectOption[] | null;
}

const AsyncSelectInput = ({
  fetchOptions,
  debounceTime = 800,
  valueOption,
  ...props
}: AsyncSelectInputProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedValueOptions = Array.isArray(valueOption)
    ? valueOption
    : valueOption
      ? [valueOption]
      : [];

  const optionsWithValue = normalizedValueOptions.reduce<SelectOption[]>(
    (acc, option) =>
      acc.some((existingOption) => existingOption.value === option.value)
        ? acc
        : [option, ...acc],
    options
  );

  const loadOptions = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      isNewSearch: boolean
    ) => {
      setIsLoading(true);
      try {
        const result = await fetchOptions({
          page: currentPage,
          search: currentSearch,
          limit: 10,
        });

        if (isNewSearch) {
          setOptions(result.data);
        } else {
          setOptions((prev) => [...prev, ...result.data]);
        }
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOptions]
  );

  useEffect(() => {
    if (props.isDisabled) {
      setOptions([]);
      setPage(1);
      setHasMore(true);
      setInputValue('');
      setSearch('');
      setIsLoading(false);
      setMenuIsOpen(false);
      return;
    }

    loadOptions(1, '', true);
  }, [loadOptions, props.isDisabled]);

  const handleInputChange = (
    newValue: string,
    actionMeta: { action: string }
  ) => {
    if (props.isDisabled) return newValue;
    if (actionMeta.action !== 'input-change') return newValue;

    const searchValue = newValue.trim();
    setInputValue(searchValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setSearch(searchValue);
      loadOptions(1, searchValue, true);
    }, debounceTime);

    return newValue;
  };

  const handleMenuScrollToBottom = () => {
    if (props.isDisabled) return;
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(nextPage, search, false);
    }
  };

  return (
    <SelectInput
      {...props}
      options={optionsWithValue}
      inputValue={inputValue}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(false)}
      onInputChange={handleInputChange}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      isLoading={isLoading}
      filterOption={null}
    />
  );
};

export default AsyncSelectInput;
