import { Table, ActiveFilters } from '@/components/common/table';
import Card, { CardSkeleton } from '@/components/common/card';
import TableActions from '@/components/common/table/table-actions';
import DeleteModal from '@/components/common/delete-modal';
import ConfirmModal from '@/components/common/confirm-modal';
import AsyncSelectInput from '@/components/ui/select/async-select';
import { PAGE_SIZE_OPTIONS } from '@/constants/constants';
import { encodeRouteId } from '@/utils/helpers';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { hasPermissionKey } from '@/utils/permissions';
import { useProductsPage } from '../hooks/use-products-page';

const Product = () => {
  const {
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
    setPendingStatusChange,
    handleConfirmStatusChange,
    isUpdating,
  } = useProductsPage();

  const {
    columns,
    columnsConfig,
    defaultColumnsConfig,
    setColumnsConfig,
    productTableActions,
    handleSettingReset,
    handelApplySettings,
  } = tableColumns;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          : cardsData.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                subTitle={card.subTitle}
                icon={card.icon}
              />
            ))}
      </div>

      <TableActions
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        value={search}
        handleReset={handleResetFilter}
        handleFilter={handleApplyFilter}
        handleSettingReset={handleSettingReset}
        handelApply={handelApplySettings}
        columns={columnsConfig}
        defaultColumns={defaultColumnsConfig}
        setColumns={setColumnsConfig}
        buttonChildren={t('add_product')}
        onClick={() => navigate('/products/create')}
        primaryPermission={`${PERMISSION_GROUPS.products}.${PERMISSION_ACTIONS.create}`}
        checkPermission={(permission) =>
          hasPermissionKey(permission, PERMISSION_GROUPS.products)
        }
        onFilterOpen={syncFilterFormToCurrentState}
      >
        <div className="flex flex-col gap-4">
          <AsyncSelectInput
            name="product_type"
            control={control}
            label={t('product_group')}
            placeholder={t('select_product_group')}
            fetchOptions={fetchProductTypes}
            valueOption={productTypeOption}
          />
        </div>
      </TableActions>

      <ActiveFilters
        filters={activeFiltersList}
        onRemove={handleRemoveFilter}
      />

      <Table
        data={products}
        columns={columns}
        actionsColumn={{
          header: t('actions'),
          actions: productTableActions,
          checkPermission: (permission) =>
            hasPermissionKey(permission, PERMISSION_GROUPS.products),
          maxIcons: 3,
        }}
        isLoading={isLoading}
        sort={sort}
        onSort={setSort}
        handelRowClick={(row) =>
          navigate(`/products/${encodeRouteId(row.id)}/display`)
        }
        pagination={{
          pageIndex,
          pageSize,
          totalCount:
            meta?.total ??
            (meta?.last_page != null ? meta.last_page * pageSize : 0),
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        }}
      />

      <DeleteModal
        open={isDeleteOpen}
        setOpen={(open) => {
          if (!open) setSelectedProduct(null);
          setIsDeleteOpen(open);
        }}
        title={t('delete_product_title')}
        deleteMessage={t('delete_product_message', {
          name: selectedProduct?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!selectedProduct?.id) return;
          deleteProduct(selectedProduct.id, {
            onSuccess: () => {
              setIsDeleteOpen(false);
              setSelectedProduct(null);
            },
          });
        }}
      />

      <ConfirmModal
        open={isStatusModalOpen}
        setOpen={(open) => {
          if (!open) setPendingStatusChange(null);
          setIsStatusModalOpen(open);
        }}
        title={t('confirm_status_change_title')}
        message={t('confirm_status_change_message')}
        onConfirm={handleConfirmStatusChange}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default Product;
