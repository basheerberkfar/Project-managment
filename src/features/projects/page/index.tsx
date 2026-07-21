import { Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Can from '@/components/can';
import DeleteModal from '@/components/common/delete-modal';
import { Table } from '@/components/common/table';
import TableActions from '@/components/common/table/table-actions';
import PrimaryButton from '@/components/ui/button/primary-button';
import { useToast } from '@/components/ui/toast';
import { PAGE_SIZE_OPTIONS, PROJECTS_TABLE_KEY } from '@/constants/constants';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTableSettings } from '@/hooks/use-page-table-settings';
import {
	useCreateProjectMutation,
	useDeleteProjectMutation,
	useProjectsQuery,
	useUpdateProjectMutation,
	type ProjectDto,
} from '@/services/projects';
import { getApiErrorMessage, getApiSuccessMessage } from '@/utils/helpers';
import { hasPermission, hasPermissionKey } from '@/utils/permissions';
import ProjectFormModal from '../components/project-form-modal';
import ProjectViewModal from '../components/project-view-modal';
import { useProjectsTableColumns } from '../hooks/use-projects-table-columns';

function sortProjects(
	items: ProjectDto[],
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

export default function ProjectsPage() {
	const { t } = useTranslation('projects');
	const { showToast } = useToast();
	const { pagination, search, sort, setTablePageSettings } =
		usePageTableSettings(PROJECTS_TABLE_KEY, {
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
	const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
	const [viewProject, setViewProject] = useState<ProjectDto | null>(null);
	const [deleteProject, setDeleteProject] = useState<ProjectDto | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const debouncedSearch = useDebounce(searchValue, 500);
	const canView = hasPermission(
		PERMISSION_GROUPS.projects,
		PERMISSION_ACTIONS.view
	);

	useEffect(() => {
		setTablePageSettings(PROJECTS_TABLE_KEY, {
			search: searchValue.trim() ? { search: searchValue.trim() } : {},
			pagination: { pageIndex, pageSize },
			sort: sortState,
		});
	}, [pageIndex, pageSize, searchValue, setTablePageSettings, sortState]);

	const { data, isLoading } = useProjectsQuery({
		page: pageIndex,
		pageSize,
		search: debouncedSearch || undefined,
	});
	const { mutateAsync: createProject, isPending: isCreating } =
		useCreateProjectMutation();
	const { mutateAsync: updateProject, isPending: isUpdating } =
		useUpdateProjectMutation();
	const { mutate: removeProject, isPending: isDeleting } =
		useDeleteProjectMutation();

	const displayedItems = useMemo(
		() => sortProjects(data?.items ?? [], sortState),
		[data?.items, sortState]
	);
	const tableColumns = useProjectsTableColumns({
		onView: setViewProject,
		onEdit: (item) => {
			setEditingProject(item);
			setIsFormOpen(true);
		},
		onDelete: setDeleteProject,
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
					searchPlaceholder={t('search_projects')}
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
							group={PERMISSION_GROUPS.projects}
							action={PERMISSION_ACTIONS.create}
						>
							<PrimaryButton
								icon={<Plus size={16} />}
								onClick={() => {
									setEditingProject(null);
									setIsFormOpen(true);
								}}
							>
								{t('add_project')}
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
						actions: tableColumns.projectTableActions,
						checkPermission: (permission) =>
							hasPermissionKey(permission, PERMISSION_GROUPS.projects),
						maxIcons: 3,
					}}
					isLoading={isLoading}
					sort={sortState}
					onSort={(columnId, direction) => setSortState({ columnId, direction })}
					handelRowClick={(row) => {
						if (!canView) return;
						setViewProject(row);
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

			<ProjectFormModal
				open={isFormOpen}
				setOpen={(open) => {
					setIsFormOpen(open);
					if (!open) setEditingProject(null);
				}}
				projectId={editingProject?.id ?? null}
				onCreate={createProject}
				onUpdate={(id, payload) => updateProject({ id, data: payload })}
				isSubmitting={isCreating || isUpdating}
			/>

			<ProjectViewModal
				open={Boolean(viewProject)}
				setOpen={(open) => {
					if (!open) setViewProject(null);
				}}
				projectId={viewProject?.id ?? null}
			/>

			<DeleteModal
				open={Boolean(deleteProject)}
				setOpen={(open) => {
					if (!open) setDeleteProject(null);
				}}
				title={t('delete_project_title')}
				deleteMessage={t('delete_project_message', {
					name: deleteProject?.name ?? '',
				})}
				isLoading={isDeleting}
				handelDelete={() => {
					if (!deleteProject) return;

				removeProject(deleteProject.id, {
					onSuccess: (response) => {
						showToast({
							variant: 'success',
							title: t('common:success'),
							description: getApiSuccessMessage(response, t('project_deleted')),
						});
						setDeleteProject(null);
					},
					onError: (error) => {
						showToast({
							variant: 'danger',
							title: t('common:error'),
							description: getApiErrorMessage(error, t('operation_failed')),
						});
					},
				});
				}}
			/>
		</>
	);
}
