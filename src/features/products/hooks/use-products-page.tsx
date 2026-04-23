/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SelectOption } from '@/components/ui/select';
import type { ActiveFilterItem } from '@/components/common/table';
import { useDataTable } from '@/hooks/use-data-table';
import { useDebounce } from '@/hooks/use-debounce';
import { useTableSettingsStore } from '@/store/table-setting.store';
import { TABLE_KEY } from '@/constants/constants';
import {
  useProductsQuery,
  useToggleProductMutation,
  useDeleteProductMutation,
} from '@/features/products/service/products.query';
import type { ProductDto } from '@/features/products/service/products.types';
import type { SearchFilterValue } from '@/types/tableColumnConfig';
import { Users } from '@phosphor-icons/react';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useProductTypes } from '../../../hooks/use-product-types';
import { useProductsTableColumns } from './use-products-table-columns';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission } from '@/utils/permissions';

export function useProductsPage() {
  const { t } = useTranslation('products');
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productTypeFilterKey = 'filter[product_type_ids][]';
  const legacyProductTypeFilterKey = 'product_type_id';

  const canChangeStatus = hasPermission(
    PERMISSION_GROUPS.products,
    PERMISSION_ACTIONS.change_status
  );

  const storedPageSettings = useTableSettingsStore((s) => s.tables[TABLE_KEY]);
  const setTablePageSettings = useTableSettingsStore(
    (s) => s.setTablePageSettings
  );

  const hasUrlParams = Boolean(
    searchParams.get('page') ||
    searchParams.get('limit') ||
    searchParams.get('search') ||
    searchParams.get(productTypeFilterKey) ||
    searchParams.get(legacyProductTypeFilterKey)
  );

  const initialPageIndex = hasUrlParams
    ? Number(searchParams.get('page')) || 1
    : (storedPageSettings?.pagination?.pageIndex ?? 1);
  const initialPageSize = hasUrlParams
    ? Number(searchParams.get('limit')) || 5
    : (storedPageSettings?.pagination?.pageSize ?? 5);
  const initialSearch = hasUrlParams
    ? searchParams.get('search') || ''
    : typeof storedPageSettings?.search?.name === 'string'
      ? storedPageSettings.search.name
      : '';

  const storedProductTypeOption =
    storedPageSettings?.search?.product_type &&
    typeof storedPageSettings.search.product_type === 'object' &&
    storedPageSettings.search.product_type !== null &&
    'label' in storedPageSettings.search.product_type &&
    'value' in storedPageSettings.search.product_type
      ? (storedPageSettings.search.product_type as {
          label: string;
          value: string;
        })
      : null;

  const initialProductTypeId =
    searchParams.get(productTypeFilterKey) ||
    searchParams.get(legacyProductTypeFilterKey) ||
    (storedProductTypeOption?.value as string) ||
    (typeof storedPageSettings?.search?.[productTypeFilterKey] === 'string'
      ? storedPageSettings.search[productTypeFilterKey]
      : typeof storedPageSettings?.search?.[legacyProductTypeFilterKey] ===
          'string'
        ? storedPageSettings.search[legacyProductTypeFilterKey]
        : '') ||
    '';

  const {
    pageIndex,
    pageSize,
    sort,
    search,
    setPage,
    setPageSize,
    setSort,
    setSearch,
    reset: resetDataTable,
  } = useDataTable(
    {
      pageIndex: initialPageIndex,
      pageSize: initialPageSize,
      search: initialSearch,
    },
    {
      pageKey: TABLE_KEY,
      searchStorageKey: false,
    }
  );

  const productTypeId =
    searchParams.get(productTypeFilterKey) ||
    searchParams.get(legacyProductTypeFilterKey) ||
    initialProductTypeId;
  const { fetchProductTypes, useProductType } = useProductTypes();
  const { data: initialProductTypeData } = useProductType(productTypeId);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: initialSearch,
      product_type: storedProductTypeOption as SelectOption | null,
    },
  });

  useEffect(() => {
    if (initialProductTypeData) {
      setValue('product_type', initialProductTypeData);
    }
  }, [initialProductTypeData, setValue]);

  useEffect(() => {
    setValue('name', search);
  }, [search, setValue]);

  const handleApplyFilter = handleSubmit((formData) => {
    const params = new URLSearchParams(searchParams);
    if (formData.name) {
      params.set('search', formData.name);
      setSearch(formData.name);
    } else {
      params.delete('search');
      setSearch('');
    }
    if (formData.product_type?.value) {
      params.delete(legacyProductTypeFilterKey);
      params.delete(productTypeFilterKey);
      params.append(productTypeFilterKey, formData.product_type.value);
    } else {
      params.delete(productTypeFilterKey);
      params.delete(legacyProductTypeFilterKey);
    }
    setSearchParams(params);
    setPage(1);
  });

  const handleResetFilter = () => {
    resetForm({ name: '', product_type: null });
    setSearch('');
    setTablePageSettings(TABLE_KEY, {
      search: {},
      pagination: { pageIndex: 1, pageSize },
    });
    const params = new URLSearchParams();
    params.set('limit', String(pageSize));
    setSearchParams(params);
    resetDataTable();
  };

  const productTypeLabel =
    storedProductTypeOption?.label ??
    initialProductTypeData?.label ??
    productTypeId;

  const productTypeOption =
    initialProductTypeData ?? storedProductTypeOption ?? null;

  const syncFilterFormToCurrentState = useCallback(() => {
    setValue('name', search);
    setValue('product_type', productTypeOption);
  }, [setValue, search, productTypeOption]);

  const activeFiltersList = useMemo((): ActiveFilterItem[] => {
    const list: ActiveFilterItem[] = [];
    if (productTypeId && productTypeLabel) {
      list.push({
        id: 'product_type',
        label: t('product_group'),
        value: productTypeLabel,
      });
    }
    return list;
  }, [productTypeId, productTypeLabel, t]);

  const handleRemoveFilter = (id: string) => {
    const params = new URLSearchParams(searchParams);
    const nextSearchRecord: Record<string, SearchFilterValue> = {};
    if (id === 'name') {
      setSearch('');
      setValue('name', '');
      params.delete('search');
      if (productTypeId?.trim()) {
        const opt = getValues('product_type');
        nextSearchRecord[productTypeFilterKey] = productTypeId.trim();
        if (opt?.value && opt?.label) {
          nextSearchRecord.product_type = {
            label: opt.label,
            value: opt.value,
          };
        }
      }
    } else if (id === 'product_type') {
      setValue('product_type', null);
      params.delete(productTypeFilterKey);
      params.delete(legacyProductTypeFilterKey);
      if (search?.trim()) nextSearchRecord.name = search.trim();
    }
    setTablePageSettings(TABLE_KEY, {
      search: nextSearchRecord,
      pagination: { pageIndex: 1, pageSize },
    });
    setSearchParams(params);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(pageIndex));
    params.set('limit', String(pageSize));
    if (search) params.set('search', search);
    if (productTypeId) {
      params.append(productTypeFilterKey, productTypeId);
    }
    setSearchParams(params, { replace: true });
  }, [pageIndex, pageSize, productTypeId, search, setSearchParams]);

  useEffect(() => {
    const productTypeOption = getValues('product_type');
    const searchRecord: Record<string, SearchFilterValue> = {};
    if (search?.trim()) searchRecord.name = search.trim();
    if (productTypeId?.trim()) {
      searchRecord[productTypeFilterKey] = productTypeId.trim();
      if (productTypeOption?.value && productTypeOption?.label) {
        searchRecord.product_type = {
          label: productTypeOption.label,
          value: productTypeOption.value,
        };
      }
    }
    setTablePageSettings(TABLE_KEY, {
      search: searchRecord,
      pagination: { pageIndex, pageSize },
    });
  }, [
    pageIndex,
    pageSize,
    search,
    productTypeId,
    setTablePageSettings,
    getValues,
  ]);

  useEffect(() => {
    if (hasUrlParams) return;
    const unsub = useTableSettingsStore.persist.onFinishHydration(() => {
      const stored = useTableSettingsStore.getState().tables[TABLE_KEY];
      if (!stored?.pagination) return;
      const params = new URLSearchParams();
      params.set('page', String(stored.pagination.pageIndex));
      params.set('limit', String(stored.pagination.pageSize));
      if (typeof stored.search?.name === 'string' && stored.search.name)
        params.set('search', stored.search.name);
      const typeId =
        (typeof stored.search?.product_type === 'object' &&
        stored.search?.product_type !== null &&
        'value' in stored.search.product_type
          ? (stored.search.product_type as { value: string }).value
          : null) ||
        (typeof stored.search?.[productTypeFilterKey] === 'string'
          ? stored.search[productTypeFilterKey]
          : typeof stored.search?.[legacyProductTypeFilterKey] === 'string'
            ? stored.search[legacyProductTypeFilterKey]
            : '');
      if (typeId) {
        params.append(productTypeFilterKey, typeId);
      }
      setSearchParams(params);
    });
    return unsub;
  }, [hasUrlParams, setSearchParams]);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useProductsQuery({
    page: pageIndex,
    per_page: pageSize,
    sort: sort?.columnId,
    order: sort?.direction,
    search: debouncedSearch,
    ...(productTypeId?.trim()
      ? { [productTypeFilterKey]: [productTypeId.trim()] }
      : {}),
  });

  const { mutate: toggleProduct, isPending: isUpdating } =
    useToggleProductMutation();
  const { mutate: mutateDelete, isPending: isDeleting } =
    useDeleteProductMutation();

  const deleteProduct = useCallback(
    (
      id: number | string,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      mutateDelete(id, {
        onSuccess: (response) => {
          showToast({
            variant: 'success',
            title: t('common:success'),
            description: getApiSuccessMessage(response, t('operation_success')),
          });
          options?.onSuccess?.();
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, t('operation_failed'));
          showToast({
            variant: 'danger',
            title: t('error'),
            description: message,
          });
          options?.onError?.(error);
        },
      });
    },
    [mutateDelete, showToast, t]
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<ProductDto | null>(null);

  const onDeleteClick = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const onStatusChangeClick = (product: ProductDto, _newStatus: number) => {
    setPendingStatusChange(product);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange?.id) return;
    toggleProduct(pendingStatusChange.id, {
      onSuccess: (response) => {
        setIsStatusModalOpen(false);
        setPendingStatusChange(null);
        const message =
          (response as { data?: { message?: string } })?.data?.message ??
          t('operation_success');
        showToast({
          variant: 'success',
          title: t('common:success'),
          description: message,
        });
      },
    });
  };

  const tableColumns = useProductsTableColumns({
    navigate,
    onStatusChange: onStatusChangeClick,
    onDeleteClick,
    canChangeStatus,
  });

  const products = Array.isArray(data?.result)
    ? data.result
    : Array.isArray((data as unknown as { data?: unknown })?.data)
      ? (data as unknown as { data: ProductDto[] }).data
      : [];
  const meta = data?.meta;

  const cardsData = useMemo(
    () => [
      {
        title: t('products_count'),
        subTitle: '15',
        icon: <Users />,
      },
      {
        title: t('active_products'),
        subTitle: '10',
        icon: <Users />,
      },
      {
        title: t('inactive_products'),
        subTitle: '5',
        icon: <Users />,
      },
    ],
    [t]
  );

  return {
    t,
    navigate,
    search,
    setSearch,
    setPage,
    setPageSize,
    pageIndex,
    pageSize,
    sort,
    setSort,
    control,
    handleApplyFilter,
    handleResetFilter,
    activeFiltersList,
    handleRemoveFilter,
    fetchProductTypes,
    productTypeOption,
    syncFilterFormToCurrentState,
    products,
    isLoading,
    meta,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedProduct,
    setSelectedProduct,
    deleteProduct,
    isDeleting,
    cardsData,
    tableColumns,
    isStatusModalOpen,
    setIsStatusModalOpen,
    pendingStatusChange,
    setPendingStatusChange,
    handleConfirmStatusChange,
    isUpdating,
  };
}
