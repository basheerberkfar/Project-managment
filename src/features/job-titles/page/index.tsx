import { Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { JOB_TITLES_TABLE_KEY, PAGE_SIZE_OPTIONS } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import { getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import {
  useCreateJobTitleMutation,
  useDeleteJobTitleMutation,
  useJobTitlesQuery,
  useUpdateJobTitleMutation,
  type JobTitleDto,
} from '@/services/job-titles';
import JobTitleFormModal from '../components/job-title-form-modal';
import JobTitleViewModal from '../components/job-title-view-modal';
import { useJobTitlesTableColumns } from '../hooks/use-job-titles-table-columns';

function sortJobTitles(
  items: JobTitleDto[],
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

export default function JobTitlesPage() {
  const { t } = useTranslation('usersRoles');
  const { showToast } = useToast();
  const { pagination, search, sort, setTablePageSettings } =
    usePageTableSettings(JOB_TITLES_TABLE_KEY, {
      defaultPageSize: 10,
    });
  const [searchValue, setSearchValue] = useState(
    typeof search.search === 'string' ? search.search : ''
  );
  const [pageIndex, setPageIndex] = useState(pagination.pageIndex);
  const [pageSize, setPageSize] = useState(pagination.pageSize);
  const [sortState, setSortState] = useState(
    sort && 'columnId' in sort && 'direction' in sort ? sort : undefined
  );
  const [editingJobTitle, setEditingJobTitle] = useState<JobTitleDto | null>(null);
  const [viewJobTitle, setViewJobTitle] = useState<JobTitleDto | null>(null);
  const [deleteJobTitle, setDeleteJobTitle] = useState<JobTitleDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const canView = hasPermission(
    PERMISSION_GROUPS.job_titles,
    PERMISSION_ACTIONS.view
  );

  useEffect(() => {
    setTablePageSettings(JOB_TITLES_TABLE_KEY, {
      search: searchValue.trim() ? { search: searchValue.trim() } : {},
      pagination: { pageIndex, pageSize },
      sort: sortState,
    });
  }, [pageIndex, pageSize, searchValue, setTablePageSettings, sortState]);

  const { data, isLoading } = useJobTitlesQuery({
    page: pageIndex,
    pageSize,
    search: debouncedSearch || undefined,
  });
  const { mutateAsync: createJobTitle, isPending: isCreating } =
    useCreateJobTitleMutation();
  const { mutateAsync: updateJobTitle, isPending: isUpdating } =
    useUpdateJobTitleMutation();
  const { mutate: removeJobTitle, isPending: isDeleting } =
    useDeleteJobTitleMutation();

  const displayedItems = useMemo(
    () => sortJobTitles(data?.items ?? [], sortState),
    [data?.items, sortState]
  );
  const tableColumns = useJobTitlesTableColumns({
    onView: setViewJobTitle,
    onEdit: (item) => {
      setEditingJobTitle(item);
      setIsFormOpen(true);
    },
    onDelete: setDeleteJobTitle,
  });

  return (
    <>
      <div className="h-full flex flex-col gap-6">
        <TableActions
          onChange={(event) => {
            setSearchValue(event.target.value);
            setPageIndex(1);
          }}
          value={searchValue}
          searchPlaceholder={t('search_job_titles')}
          handleReset={() => {
            setSearchValue('');
            setPageIndex(1);
          }}
          handleFilter={() => undefined}
          handleSettingReset={tableColumns.handleSettingReset}
          handelApply={tableColumns.handleApplySettings}
          columns={tableColumns.columnsConfig}
          defaultColumns={tableColumns.defaultColumnsConfig}
          setColumns={tableColumns.setColumnsConfig}
          primaryButton={
            <Can
              group={PERMISSION_GROUPS.job_titles}
              action={PERMISSION_ACTIONS.create}
            >
              <PrimaryButton
                icon={<Plus size={16} />}
                onClick={() => {
                  setEditingJobTitle(null);
                  setIsFormOpen(true);
                }}
              >
                {t('add_job_title')}
              </PrimaryButton>
            </Can>
          }
          hasFilter={false}
        />

        <Table
          data={displayedItems}
          columns={tableColumns.columns}
          actionsColumn={{
            header: t('common:actions'),
            actions: tableColumns.jobTitleTableActions,
            checkPermission: (permission) =>
              hasPermissionKey(permission, PERMISSION_GROUPS.job_titles),
            maxIcons: 3,
          }}
          isLoading={isLoading}
          sort={sortState}
          onSort={(columnId, direction) => setSortState({ columnId, direction })}
          handelRowClick={(row) => {
            if (!canView) return;
            setViewJobTitle(row);
          }}
          pagination={{
            pageIndex,
            pageSize,
            totalCount: data?.pagination.totalCount ?? displayedItems.length,
            onPageChange: setPageIndex,
            onPageSizeChange: (value) => {
              setPageSize(value);
              setPageIndex(1);
            },
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
          }}
        />
      </div>

      <JobTitleFormModal
        open={isFormOpen}
        setOpen={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingJobTitle(null);
        }}
        jobTitleId={editingJobTitle?.id ?? null}
        onCreate={createJobTitle}
        onUpdate={(id, payload) => updateJobTitle({ id, data: payload })}
        isSubmitting={isCreating || isUpdating}
      />

      <JobTitleViewModal
        open={Boolean(viewJobTitle)}
        setOpen={(open) => {
          if (!open) setViewJobTitle(null);
        }}
        jobTitleId={viewJobTitle?.id ?? null}
      />

      <DeleteModal
        open={Boolean(deleteJobTitle)}
        setOpen={(open) => {
          if (!open) setDeleteJobTitle(null);
        }}
        title={t('delete_job_title_title')}
        deleteMessage={t('delete_job_title_message', {
          name: deleteJobTitle?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!deleteJobTitle) return;

          removeJobTitle(deleteJobTitle.id, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(
                  response,
                  t('job_title_deleted')
                ),
              });
              setDeleteJobTitle(null);
            },
          });
        }}
      />
    </>
  );
}
