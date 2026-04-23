import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { SortState, SortDirection } from '@/components/common/table/types';
import { useTableSettingsStore } from '@/store/table-setting.store';
import { useTableSettingsHydration } from './use-table-settings-hydration';

interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sort?: SortState;
  search: string;
}

type DataTableAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SORT'; payload: SortState | undefined }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'HYDRATE'; payload: Partial<DataTableState> }
  | { type: 'RESET' };

const initialState: DataTableState = {
  pageIndex: 1,
  pageSize: 20,
  sort: undefined,
  search: '',
};

function dataTableReducer(
  state: DataTableState,
  action: DataTableAction
): DataTableState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, pageIndex: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, pageIndex: 1 }; // Reset to first page on size change
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, pageIndex: 1 };
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface UseDataTableOptions {
  pageKey?: string;
  searchStorageKey?: string | false;
}

const normalizeSearchValue = (value: unknown) =>
  typeof value === 'string' ? value : '';

export function useDataTable(
  config: Partial<DataTableState> = {},
  options: UseDataTableOptions = {}
) {
  const { pageKey, searchStorageKey = 'search' } = options;
  const hasHydrated = useTableSettingsHydration();
  const settings = useTableSettingsStore((s) =>
    pageKey ? s.tables[pageKey] : undefined
  );
  const setTablePageSettings = useTableSettingsStore(
    (s) => s.setTablePageSettings
  );
  const [state, dispatch] = useReducer(dataTableReducer, {
    ...initialState,
    ...config,
  });
  const didHydrateRef = useRef(false);

  useEffect(() => {
    if (!pageKey || !hasHydrated || didHydrateRef.current) return;

    const persistedPagination = settings?.pagination;
    const persistedSearch = settings?.search;
    const persistedSort = settings?.sort;
    const resolvedSearch =
      searchStorageKey && persistedSearch
        ? normalizeSearchValue(persistedSearch[searchStorageKey])
        : normalizeSearchValue(config.search);

    dispatch({
      type: 'HYDRATE',
      payload: {
        pageIndex: persistedPagination?.pageIndex ?? config.pageIndex,
        pageSize: persistedPagination?.pageSize ?? config.pageSize,
        search: resolvedSearch,
        sort: persistedSort ?? config.sort,
      },
    });

    didHydrateRef.current = true;
  }, [
    config.pageIndex,
    config.pageSize,
    config.search,
    config.sort,
    hasHydrated,
    pageKey,
    settings?.pagination,
    settings?.search,
    settings?.sort,
  ]);

  useEffect(() => {
    if (!pageKey || !hasHydrated || !didHydrateRef.current) return;

    const normalizedSearch = normalizeSearchValue(state.search);

    setTablePageSettings(pageKey, {
      ...(searchStorageKey
        ? {
            search: normalizedSearch.trim()
              ? { [searchStorageKey]: normalizedSearch.trim() }
              : {},
          }
        : {}),
      pagination: {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      },
      sort: state.sort,
    });
  }, [
    hasHydrated,
    pageKey,
    setTablePageSettings,
    state.pageIndex,
    state.pageSize,
    state.search,
    state.sort,
    searchStorageKey,
  ]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const setPageSize = useCallback((size: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: size });
  }, []);

  const setSort = useCallback((columnId: string, direction: SortDirection) => {
    dispatch({ type: 'SET_SORT', payload: { columnId, direction } });
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    setPage,
    setPageSize,
    setSort,
    setSearch,
    reset,
  };
}
