/* eslint-disable react-hooks/exhaustive-deps */
import { Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { PAGE_SIZE_OPTIONS, BILLS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { encodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import { useBillsTableColumns } from '../hooks/use-bills-table-columns';
import {
  useBillsQuery,
  useDeleteBillMutation,
  type BillDto,
} from '../service';
import { billsListActionNames } from './state/action-names';
import { billsListInitialState } from './state/initial-state';
import { billsListReducer } from './state/reducer';

function sortBills(
  items: BillDto[],
  sort?: { columnId: string; direction: 'asc' | 'desc' }
) {
  if (!sort) return items;

  const sorted = [...items].sort((left, right) =>
    String((left as Record<string, unknown>)[sort.columnId] ?? '').localeCompare(
      String((right as Record<string, unknown>)[sort.columnId] ?? ''),
      undefined,
      { numeric: true }
    )
  );

  return sort.direction === 'desc' ? sorted.reverse() : sorted;
}

export default function BillsListPage() {
  const { t } = useTranslation('bills');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { pagination, search, sort, setTablePageSettings } =
    usePageTableSettings(BILLS_TABLE_KEY, {
      defaultPageSize: billsListInitialState.pageSize,
    });
  const [state, dispatch] = useReducer(billsListReducer, {
    ...billsListInitialState,
    search:
      typeof search.search === 'string'
        ? search.search
        : billsListInitialState.search,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sort:
      sort && 'columnId' in sort && 'direction' in sort
        ? sort
        : billsListInitialState.sort,
  });
  const debouncedSearch = useDebounce(state.search, 500);
  const canViewBills = hasPermission(
    PERMISSION_GROUPS.bills,
    PERMISSION_ACTIONS.view
  );

  useEffect(() => {
    setTablePageSettings(BILLS_TABLE_KEY, {
      search: state.search.trim() ? { search: state.search.trim() } : {},
      pagination: {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      },
      sort: state.sort,
    });
  }, [
    setTablePageSettings,
    state.pageIndex,
    state.pageSize,
    state.search,
    state.sort,
  ]);

  const { data, isLoading } = useBillsQuery({
    page: state.pageIndex,
    pageSize: state.pageSize,
    search: debouncedSearch || undefined,
  });
  const { mutate: deleteBill, isPending: isDeleting } = useDeleteBillMutation();

  const displayedBills = useMemo(
    () => sortBills(data?.items ?? [], state.sort),
    [data?.items, state.sort]
  );
  const tableColumns = useBillsTableColumns({
    onView: (bill) =>
      navigate(`/bills/${encodeRouteId(bill.id)}/display`),
    onEdit: (bill) => navigate(`/bills/${encodeRouteId(bill.id)}`),
    onDelete: (bill) =>
      dispatch({
        type: billsListActionNames.setSelectedBill,
        payload: bill,
      }),
  });

  return (
    <div className="h-full flex flex-col gap-6">
      <TableActions
        onChange={(event) =>
          dispatch({
            type: billsListActionNames.setSearch,
            payload: event.target.value,
          })
        }
        value={state.search}
        searchPlaceholder={t('search_bills')}
        handleReset={() =>
          dispatch({
            type: billsListActionNames.setSearch,
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
          <Can group={PERMISSION_GROUPS.bills} action={PERMISSION_ACTIONS.create}>
            <PrimaryButton
              icon={<Plus size={16} />}
              onClick={() => navigate('/bills/create')}
            >
              {t('add_bill')}
            </PrimaryButton>
          </Can>
        }
        hasFilter={false}
      />

      <Table
        data={displayedBills}
        columns={tableColumns.columns}
        actionsColumn={{
          header: t('common:actions'),
          actions: tableColumns.billTableActions,
          checkPermission: (permission) =>
            hasPermissionKey(permission, PERMISSION_GROUPS.bills),
          maxIcons: 3,
        }}
        isLoading={isLoading}
        sort={state.sort}
        onSort={(columnId, direction) =>
          dispatch({
            type: billsListActionNames.setSort,
            payload: { columnId, direction },
          })
        }
        handelRowClick={(row) =>
          canViewBills
            ? navigate(`/bills/${encodeRouteId(row.id)}/display`)
            : undefined
        }
        pagination={{
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          totalCount: data?.pagination.totalCount ?? displayedBills.length,
          onPageChange: (page) =>
            dispatch({
              type: billsListActionNames.setPageIndex,
              payload: page,
            }),
          onPageSizeChange: (size) =>
            dispatch({
              type: billsListActionNames.setPageSize,
              payload: size,
            }),
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        }}
      />

      <DeleteModal
        open={Boolean(state.selectedBill)}
        setOpen={(open) => {
          if (!open) {
            dispatch({
              type: billsListActionNames.setSelectedBill,
              payload: null,
            });
          }
        }}
        title={t('delete_bill_title')}
        deleteMessage={t('delete_bill_message', {
          no: state.selectedBill?.no ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!state.selectedBill) return;

          deleteBill(state.selectedBill.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('bill_deleted')),
              });
              dispatch({
                type: billsListActionNames.setSelectedBill,
                payload: null,
              });
            },
          });
        }}
      />
    </div>
  );
}
