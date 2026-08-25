import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const isSelectOption = (value: unknown): value is SelectOption => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    'value' in value
  );
};

const normalizeSelectOptions = (value: unknown): SelectOption[] => {
  if (Array.isArray(value)) {
    return value.filter(isSelectOption);
  }

  if (isSelectOption(value)) {
    return [value];
  }

  return [];
};

const getSelectValue = (
  value: unknown
): SelectOption | SelectOption[] | undefined => {
  if (Array.isArray(value)) {
    const options = value.filter(isSelectOption);
    return options.length ? options : undefined;
  }

  if (isSelectOption(value)) {
    return value;
  }

  return undefined;
};

const PAGE_LIMIT = 10;

const AsyncSelectInput = ({
  fetchOptions,
  debounceTime = 800,
  valueOption,
  ...props
}: AsyncSelectInputProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchOptionsRef = useRef(fetchOptions);
  const pageRef = useRef(1);
  const effectiveValueOption = props.value ?? valueOption ?? props.defaultValue;

  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const normalizedValueOptions = useMemo(
    () => normalizeSelectOptions(effectiveValueOption),
    [effectiveValueOption]
  );

  const selectedValue = useMemo(
    () => getSelectValue(effectiveValueOption),
    [effectiveValueOption]
  );

  const optionsWithValue = useMemo(
    () =>
      normalizedValueOptions.reduce<SelectOption[]>(
        (acc, option) =>
          acc.some(
            (existingOption) =>
              String(existingOption.value) === String(option.value)
          )
            ? acc
            : [option, ...acc],
        options
      ),
    [normalizedValueOptions, options]
  );
  const loadOptions = useCallback(
    async (
      currentPage: number,
      currentSearch: string,
      isNewSearch: boolean
    ) => {
      setIsLoading(true);

      try {
        const result = await fetchOptionsRef.current({
          page: currentPage,
          search: currentSearch,
          limit: PAGE_LIMIT,
        });

        setOptions((prev) => {
          const incoming = result.data.filter(
            (option) =>
              !prev.some(
                (existingOption) =>
                  String(existingOption.value) === String(option.value)
              )
          );

          return isNewSearch ? result.data : [...prev, ...incoming];
        });

        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (props.isDisabled) return;

    pageRef.current = 1;
    // Async option loading intentionally synchronizes this component with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOptions(1, search, true);
  }, [loadOptions, props.isDisabled, search]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (newValue: string, actionMeta: { action: string }) => {
      if (props.isDisabled) return newValue;
      if (actionMeta.action !== 'input-change') return newValue;

      const searchValue = newValue.trim();
      setInputValue(searchValue);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setSearch(searchValue);
      }, debounceTime);

      return newValue;
    },
    [debounceTime, props.isDisabled]
  );

  const handleMenuScrollToBottom = useCallback(() => {
    if (props.isDisabled) return;
    if (!menuIsOpen || !hasMore || isLoading) return;

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    void loadOptions(nextPage, search, false);
  }, [
    hasMore,
    isLoading,
    loadOptions,
    menuIsOpen,
    props.isDisabled,
    search,
  ]);

  return (
    <SelectInput
      {...props}
      options={optionsWithValue}
      value={selectedValue}
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
