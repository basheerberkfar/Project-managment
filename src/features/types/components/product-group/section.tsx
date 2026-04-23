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
  useCreateProductTypeMutation,
  useDeleteProductTypeMutation,
  useProductTypesQuery,
  useToggleProductTypeStatusMutation,
  useUpdateProductTypeMutation,
} from '@/features/types/service';
import type { ProductTypeDto } from '@/features/types/service';
import {
  getApiErrorMessage,
  getApiSuccessMessage,
  resolveText,
} from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import { useProductGroupsTableColumns } from '../../hooks/use-product-groups-table-columns';
import ProductGroupFormModal from './form-modal';
import ProductGroupViewModal from './view-modal';
import {
  productGroupsSectionActionNames,
  productGroupsSectionInitialState,
  productGroupsSectionReducer,
} from './reducer';

const extractList = <T,>(data?: { data?: T[]; result?: T[] }) => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export default function ProductGroupsSection() {
  const { t, i18n } = useTranslation('types');
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(
    productGroupsSectionReducer,
    productGroupsSectionInitialState
  );
  const debouncedSearch = useDebounce(state.search, 500);
  const currentLang = i18n.language === 'en' ? 'en' : 'ar';

  const { data, isLoading } = useProductTypesQuery({
    page: state.pageIndex,
    limit: state.pageSize,
    'filter[search]': debouncedSearch,
  });
  const { mutateAsync: createProductGroup, isPending: isCreating } =
    useCreateProductTypeMutation();
  const { mutateAsync: updateProductGroup, isPending: isUpdating } =
    useUpdateProductTypeMutation();
  const { mutate: deleteProductGroup, isPending: isDeleting } =
    useDeleteProductTypeMutation();
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleProductTypeStatusMutation();

  const canChangeStatus = hasPermission(
    PERMISSION_GROUPS.product_types,
    PERMISSION_ACTIONS.change_status
  );

  const productGroups = useMemo(
    () => extractList<ProductTypeDto>(data),
    [data]
  );
  const totalCount =
    data?.meta?.total ??
    (data?.meta?.last_page != null
      ? data.meta.last_page * state.pageSize
      : productGroups.length);

  const displayedProductGroups = useMemo(() => {
    if (!state.sort) return productGroups;

    const sorted = [...productGroups].sort((left, right) => {
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
  }, [currentLang, productGroups, state.sort]);

  const tableColumns = useProductGroupsTableColumns({
    onView: (productGroup) => {
      dispatch({
        type: productGroupsSectionActionNames.setSelectedProductGroup,
        payload: productGroup,
      });
      dispatch({
        type: productGroupsSectionActionNames.setIsViewModalOpen,
        payload: true,
      });
    },
    onEdit: (productGroup) => {
      dispatch({
        type: productGroupsSectionActionNames.setEditingProductGroup,
        payload: productGroup,
      });
      dispatch({
        type: productGroupsSectionActionNames.setIsFormModalOpen,
        payload: true,
      });
    },
    onDelete: (productGroup) =>
      dispatch({
        type: productGroupsSectionActionNames.setDeleteProductGroup,
        payload: productGroup,
      }),
    onStatusChange: (productGroup) =>
      dispatch({
        type: productGroupsSectionActionNames.setStatusProductGroup,
        payload: productGroup,
      }),
    canChangeStatus,
  });

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <TableActions
          onChange={(event) =>
            dispatch({
              type: productGroupsSectionActionNames.setSearch,
              payload: event.target.value,
            })
          }
          value={state.search}
          searchPlaceholder={t('search_product_group')}
          handleReset={() =>
            dispatch({
              type: productGroupsSectionActionNames.setSearch,
              payload: '',
            })
          }
          handleFilter={() => undefined}
          handleSettingReset={tableColumns.handleSettingReset}
          handelApply={tableColumns.handleApplySettings}
          columns={tableColumns.columnsConfig}
          defaultColumns={tableColumns.defaultColumnsConfig}
          setColumns={tableColumns.setColumnsConfig}
          hasFilter={false}
          primaryButton={
            <Can
              group={PERMISSION_GROUPS.product_types}
              action={PERMISSION_ACTIONS.create}
            >
              <PrimaryButton
                icon={<Plus size={16} />}
                onClick={() => {
                  dispatch({
                    type: productGroupsSectionActionNames.setSelectedProductGroup,
                    payload: null,
                  });
                  dispatch({
                    type: productGroupsSectionActionNames.setEditingProductGroup,
                    payload: null,
                  });
                  dispatch({
                    type: productGroupsSectionActionNames.setIsFormModalOpen,
                    payload: true,
                  });
                }}
              >
                {t('add_product_group')}
              </PrimaryButton>
            </Can>
          }
        />

        <Table
          data={displayedProductGroups}
          columns={tableColumns.columns}
          actionsColumn={{
            header: t('actions'),
            actions: tableColumns.productGroupActions,
            checkPermission: (permission) =>
              hasPermissionKey(permission, PERMISSION_GROUPS.product_types),
            maxIcons: 3,
          }}
          isLoading={isLoading}
          sort={state.sort}
          onSort={(columnId, direction) =>
            dispatch({
              type: productGroupsSectionActionNames.setSort,
              payload: { columnId, direction },
            })
          }
          handelRowClick={(row) => {
            if (
              !hasPermission(
                PERMISSION_GROUPS.product_types,
                PERMISSION_ACTIONS.view
              )
            ) {
              return;
            }

            dispatch({
              type: productGroupsSectionActionNames.setSelectedProductGroup,
              payload: row,
            });
            dispatch({
              type: productGroupsSectionActionNames.setIsViewModalOpen,
              payload: true,
            });
          }}
          pagination={{
            pageIndex: state.pageIndex,
            pageSize: state.pageSize,
            totalCount,
            onPageChange: (value) =>
              dispatch({
                type: productGroupsSectionActionNames.setPageIndex,
                payload: value,
              }),
            onPageSizeChange: (value) =>
              dispatch({
                type: productGroupsSectionActionNames.setPageSize,
                payload: value,
              }),
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
          }}
        />
      </div>

      <ProductGroupFormModal
        key={`${state.editingProductGroup?.id ?? 'create'}-${state.isFormModalOpen ? 'open' : 'closed'}`}
        open={state.isFormModalOpen}
        setOpen={(open) => {
          dispatch({
            type: productGroupsSectionActionNames.setIsFormModalOpen,
            payload: open,
          });
          if (!open) {
            dispatch({
              type: productGroupsSectionActionNames.setEditingProductGroup,
              payload: null,
            });
          }
        }}
        productGroupId={state.editingProductGroup?.id ?? null}
        onCreate={createProductGroup}
        onUpdate={(id, payload) => updateProductGroup({ id, data: payload })}
        isSubmitting={isCreating || isUpdating}
      />

      <ProductGroupViewModal
        open={state.isViewModalOpen}
        setOpen={(open) => {
          dispatch({
            type: productGroupsSectionActionNames.setIsViewModalOpen,
            payload: open,
          });
          if (!open) {
            dispatch({
              type: productGroupsSectionActionNames.setSelectedProductGroup,
              payload: null,
            });
          }
        }}
        productGroupId={state.selectedProductGroup?.id ?? null}
      />

      <ConfirmModal
        open={Boolean(state.statusProductGroup)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: productGroupsSectionActionNames.setStatusProductGroup,
              payload: null,
            });
          }
        }}
        title={t('change_status_title')}
        message={t(
          state.statusProductGroup?.status === STATUS.ACTIVE
            ? 'deactivate_product_group_message'
            : 'activate_product_group_message',
          {
            name:
              resolveText(state.statusProductGroup?.title, currentLang) || '',
          }
        )}
        isLoading={isTogglingStatus}
        onConfirm={() => {
          if (!state.statusProductGroup) return;

          toggleStatus(state.statusProductGroup.id, {
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
                type: productGroupsSectionActionNames.setStatusProductGroup,
                payload: null,
              });
            },
          });
        }}
      />

      <DeleteModal
        open={Boolean(state.deleteProductGroup)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: productGroupsSectionActionNames.setDeleteProductGroup,
              payload: null,
            });
          }
        }}
        title={t('delete_product_group_title')}
        deleteMessage={t('delete_product_group_message', {
          name: resolveText(state.deleteProductGroup?.title, currentLang) || '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!state.deleteProductGroup) return;
          const productGroupName =
            resolveText(state.deleteProductGroup?.title, currentLang) || '';
          deleteProductGroup(state.deleteProductGroup.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(
                  response,
                  t('product_group_deleted')
                ),
              });
              dispatch({
                type: productGroupsSectionActionNames.setDeleteProductGroup,
                payload: null,
              });
            },
            onError: (error) => {
              showToast({
                variant: 'danger',
                title: t('error', { ns: 'common' }),
                description:
                  getApiErrorMessage(error, t('operation_failed')) ||
                  productGroupName,
              });
            },
          });
        }}
      />
    </>
  );
}
