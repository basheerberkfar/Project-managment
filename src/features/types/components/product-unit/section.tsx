import { Plus } from '@phosphor-icons/react';
import { useMemo, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import ConfirmModal from '@/components/common/confirm-modal';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { PAGE_SIZE_OPTIONS } from '@/constants/constants';
import { STATUS } from '@/constants/enums';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCreateProductUnitMutation,
  useDeleteProductUnitMutation,
  useProductUnitsQuery,
  useToggleProductUnitStatusMutation,
  useUpdateProductUnitMutation,
  type ProductUnitDto,
} from '@/features/types/service';
import {
  getApiErrorMessage,
  getApiSuccessMessage,
  resolveText,
} from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import { useProductUnitsTableColumns } from '../../hooks/use-product-units-table-columns';
import ProductUnitFormModal from './form-modal';
import {
  productUnitsSectionActionNames,
  productUnitsSectionInitialState,
  productUnitsSectionReducer,
} from './reducer';
import ProductUnitViewModal from './view-modal';

const extractList = <T,>(data?: { data?: T[]; result?: T[] }) => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export default function ProductUnitsSection() {
  const { t, i18n } = useTranslation('types');
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(
    productUnitsSectionReducer,
    productUnitsSectionInitialState
  );
  const debouncedSearch = useDebounce(state.search, 500);
  const currentLang = i18n.language === 'en' ? 'en' : 'ar';

  const { data, isLoading } = useProductUnitsQuery({
    page: state.pageIndex,
    limit: state.pageSize,
    'filter[search]': debouncedSearch,
  });
  const { mutateAsync: createProductUnit, isPending: isCreatingProductUnit } =
    useCreateProductUnitMutation();
  const { mutateAsync: updateProductUnit, isPending: isUpdatingProductUnit } =
    useUpdateProductUnitMutation();
  const { mutate: deleteProductUnit, isPending: isDeletingProductUnit } =
    useDeleteProductUnitMutation();
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleProductUnitStatusMutation();

  const canChangeStatus = hasPermission(
    PERMISSION_GROUPS.product_units,
    PERMISSION_ACTIONS.change_status
  );

  const productUnits = useMemo(() => extractList<ProductUnitDto>(data), [data]);
  const totalCount =
    data?.meta?.total ??
    (data?.meta?.last_page != null
      ? data.meta.last_page * state.pageSize
      : productUnits.length);

  const displayedProductUnits = useMemo(() => {
    if (!state.sort) return productUnits;

    const sorted = [...productUnits].sort((left, right) => {
      const leftValue =
        state.sort!.columnId === 'title'
          ? resolveText(left.title, currentLang)
          : state.sort!.columnId === 'description'
            ? resolveText(left.description, currentLang)
            : String(
                (left as Record<string, unknown>)[state.sort!.columnId] ?? ''
              );
      const rightValue =
        state.sort!.columnId === 'title'
          ? resolveText(right.title, currentLang)
          : state.sort!.columnId === 'description'
            ? resolveText(right.description, currentLang)
            : String(
                (right as Record<string, unknown>)[state.sort!.columnId] ?? ''
              );

      return leftValue.localeCompare(rightValue, undefined, { numeric: true });
    });

    return state.sort.direction === 'desc' ? sorted.reverse() : sorted;
  }, [currentLang, productUnits, state.sort]);

  const handleDeleteProductUnit = (productUnit: ProductUnitDto | null) => {
    if (!productUnit) return;

    deleteProductUnit(productUnit.id, {
      onSuccess: (response) => {
        showToast({
          variant: 'success',
          title: t('common:success'),
          description: getApiSuccessMessage(
            response,
            t('product_unit_deleted')
          ),
        });
        dispatch({
          type: productUnitsSectionActionNames.setProductUnitToDelete,
          payload: null,
        });
      },
      onError: (error) => {
        showToast({
          variant: 'danger',
          description: getApiErrorMessage(error, t('operation_failed')),
        });
      },
    });
  };

  const tableColumns = useProductUnitsTableColumns({
    onView: (productUnit) => {
      dispatch({
        type: productUnitsSectionActionNames.setSelectedProductUnit,
        payload: productUnit,
      });
      dispatch({
        type: productUnitsSectionActionNames.setIsViewModalOpen,
        payload: true,
      });
    },
    onEdit: (productUnit) => {
      dispatch({
        type: productUnitsSectionActionNames.setEditingProductUnit,
        payload: productUnit,
      });
      dispatch({
        type: productUnitsSectionActionNames.setIsFormModalOpen,
        payload: true,
      });
    },
    onDelete: (productUnit) =>
      dispatch({
        type: productUnitsSectionActionNames.setProductUnitToDelete,
        payload: productUnit,
      }),
    onStatusChange: (productUnit) =>
      dispatch({
        type: productUnitsSectionActionNames.setStatusProductUnit,
        payload: productUnit,
      }),
    canChangeStatus,
  });

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <TableActions
          onChange={(event) =>
            dispatch({
              type: productUnitsSectionActionNames.setSearch,
              payload: event.target.value,
            })
          }
          value={state.search}
          searchPlaceholder={t('search_product_unit')}
          handleReset={() =>
            dispatch({
              type: productUnitsSectionActionNames.setSearch,
              payload: '',
            })
          }
          handleFilter={() => undefined}
          handleSettingReset={tableColumns.handleSettingReset}
          handelApply={tableColumns.handleApplySettings}
          columns={tableColumns.columnsConfig}
          defaultColumns={tableColumns.defaultColumnsConfig}
          setColumns={tableColumns.setColumnsConfig}
          primaryButton={
            <Can
              group={PERMISSION_GROUPS.product_units}
              action={PERMISSION_ACTIONS.create}
            >
              <PrimaryButton
                icon={<Plus size={16} />}
                onClick={() => {
                  dispatch({
                    type: productUnitsSectionActionNames.setSelectedProductUnit,
                    payload: null,
                  });
                  dispatch({
                    type: productUnitsSectionActionNames.setEditingProductUnit,
                    payload: null,
                  });
                  dispatch({
                    type: productUnitsSectionActionNames.setIsFormModalOpen,
                    payload: true,
                  });
                }}
              >
                {t('add_product_unit')}
              </PrimaryButton>
            </Can>
          }
          hasFilter={false}
        />

        <Table
          data={displayedProductUnits}
          columns={tableColumns.columns}
          actionsColumn={{
            header: t('actions'),
            actions: tableColumns.productUnitActions,
            checkPermission: (permission) =>
              hasPermissionKey(permission, PERMISSION_GROUPS.product_units),
            maxIcons: 3,
          }}
          isLoading={isLoading}
          sort={state.sort}
          onSort={(columnId, direction) =>
            dispatch({
              type: productUnitsSectionActionNames.setSort,
              payload: { columnId, direction },
            })
          }
          handelRowClick={(row) => {
            if (
              !hasPermission(
                PERMISSION_GROUPS.product_units,
                PERMISSION_ACTIONS.view
              )
            ) {
              return;
            }

            dispatch({
              type: productUnitsSectionActionNames.setSelectedProductUnit,
              payload: row,
            });
            dispatch({
              type: productUnitsSectionActionNames.setIsViewModalOpen,
              payload: true,
            });
          }}
          pagination={{
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            totalCount,
            onPageChange: (value) =>
              dispatch({
                type: productUnitsSectionActionNames.setPageIndex,
                payload: value,
              }),
            onPageSizeChange: (value) =>
              dispatch({
                type: productUnitsSectionActionNames.setPageSize,
                payload: value,
              }),
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
          }}
        />
      </div>

      <ProductUnitFormModal
        key={`${state.editingProductUnit?.id ?? 'create'}-${state.isFormModalOpen ? 'open' : 'closed'}`}
        open={state.isFormModalOpen}
        setOpen={(open) => {
          dispatch({
            type: productUnitsSectionActionNames.setIsFormModalOpen,
            payload: open,
          });
          if (!open) {
            dispatch({
              type: productUnitsSectionActionNames.setEditingProductUnit,
              payload: null,
            });
          }
        }}
        productUnitId={state.editingProductUnit?.id ?? null}
        onCreate={createProductUnit}
        onUpdate={(id, payload) => updateProductUnit({ id, data: payload })}
        isSubmitting={isCreatingProductUnit || isUpdatingProductUnit}
      />

      <ProductUnitViewModal
        open={state.isViewModalOpen}
        setOpen={(open) => {
          dispatch({
            type: productUnitsSectionActionNames.setIsViewModalOpen,
            payload: open,
          });
          if (!open) {
            dispatch({
              type: productUnitsSectionActionNames.setSelectedProductUnit,
              payload: null,
            });
          }
        }}
        productUnitId={state.selectedProductUnit?.id ?? null}
      />

      <ConfirmModal
        open={Boolean(state.statusProductUnit)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: productUnitsSectionActionNames.setStatusProductUnit,
              payload: null,
            });
          }
        }}
        title={t('change_status_title')}
        message={t(
          state.statusProductUnit?.status === STATUS.ACTIVE
            ? 'deactivate_product_unit_message'
            : 'activate_product_unit_message',
          {
            name:
              resolveText(state.statusProductUnit?.title, currentLang) || '',
          }
        )}
        isLoading={isTogglingStatus}
        onConfirm={() => {
          if (!state.statusProductUnit) return;

          toggleStatus(state.statusProductUnit.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(
                  response,
                  t('status_updated')
                ),
              });
              dispatch({
                type: productUnitsSectionActionNames.setStatusProductUnit,
                payload: null,
              });
            },
          });
        }}
      />

      <DeleteModal
        open={Boolean(state.productUnitToDelete)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: productUnitsSectionActionNames.setProductUnitToDelete,
              payload: null,
            });
          }
        }}
        title={t('delete_product_unit_title')}
        deleteMessage={t('delete_product_unit_message', {
          name:
            resolveText(state.productUnitToDelete?.title, currentLang) || '',
        })}
        isLoading={isDeletingProductUnit}
        handelDelete={() => handleDeleteProductUnit(state.productUnitToDelete)}
      />
    </>
  );
}
