import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Eye, Kanban, NotePencil, Plus, Trash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '@/components/common/breadCrumb';
import DeleteModal from '@/components/common/delete-modal';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { DateCalendarInput } from '@/components/ui/date-calendar';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SquareButton from '@/components/ui/squareButton';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import {
  ProjectFeatures,
  ProjectFinancialTab,
  ProjectRenewals,
} from '@/features/finance/components/project-financial';
import { RelatedResourcePanel } from '@/features/management/page';
import ProjectMembers from '../components/project-members';
import { formatCurrency } from '@/features/finance/page';
import { useClientsQuery } from '@/services/clients';
import { getApiErrorMessage, formatDate } from '@/utils/helpers';
import { formatApiDate, parseApiDate } from '@/utils/date-value';
import {
  useCreateProjectMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useDeleteProjectMutation,
  useProjectQuery,
  useProjectsQuery,
  useTasksQuery,
  useTaskStatusesQuery,
  useUpdateTaskMutation,
  useUpdateProjectMutation,
  type ProjectDto,
  type ProjectPayload,
  type ProjectPriority,
  type ProjectStatus,
  type TaskDto,
  type TaskPayload,
  type TaskStatusDto,
} from '../service';

const PAGE_SIZE = 20;
const statusValues: ProjectStatus[] = [
  'New',
  'InProgress',
  'Completed',
  'OnHold',
  'Cancelled',
];
const priorityValues: ProjectPriority[] = [
  'Low',
  'Medium',
  'High',
  'Urgent',
  'Critical',
];
const statusColors: Record<ProjectStatus, string> = {
  New: '#944f30',
  InProgress: '#3f6d6a',
  Completed: '#34947e',
  OnHold: '#c48a3a',
  Cancelled: '#b04a4a',
};

export default function ProjectsPage() {
  const { id } = useParams();
  return id ? <ProjectDetails projectId={id} /> : <ProjectsList />;
}

function ProjectsList() {
  const { t, i18n } = useTranslation('projects');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [priority, setPriority] = useState<ProjectPriority | ''>('');
  const [editing, setEditing] = useState<ProjectDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const query = useProjectsQuery({
    Page: page,
    PageSize: PAGE_SIZE,
    Search: search || undefined,
    Status: status || undefined,
    Priority: priority || undefined,
  });
  const statusOptions = statusValues.map((value) => ({
    label: t(`api_status_${value}`),
    value,
  }));
  const priorityOptions = priorityValues.map((value) => ({
    label: t(`api_priority_${value}`),
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-5 overflow-y-auto"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('project_workspace')}
          </p>
          <h1 className="text-2xl font-semibold">{t('projects')}</h1>
        </div>
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() => setFormOpen(true)}
        >
          {t('new_project')}
        </PrimaryButton>
      </header>
      <div className="grid gap-3 md:grid-cols-[1fr_230px_230px]">
        <Input
          label={t('search_by_project_name')}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <SelectInput
          label={t('status')}
          options={statusOptions}
          isClearable
          value={statusOptions.find((item) => item.value === status) ?? null}
          onChange={(option) => {
            setStatus(
              ((option as SelectOption | null)?.value ?? '') as
                | ProjectStatus
                | ''
            );
            setPage(1);
          }}
        />
        <SelectInput
          label={t('priority')}
          options={priorityOptions}
          isClearable
          value={
            priorityOptions.find((item) => item.value === priority) ?? null
          }
          onChange={(option) => {
            setPriority(
              ((option as SelectOption | null)?.value ?? '') as
                | ProjectPriority
                | ''
            );
            setPage(1);
          }}
        />
      </div>
      {query.isLoading ? (
        <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
          {t('common:loading')}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(query.data?.items ?? []).map((project) => (
            <motion.article
              key={project.id}
              layout
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer overflow-hidden rounded-2 border border-light-card-border bg-white shadow-sm dark:border-dark-card-border dark:bg-dark-card-background"
            >
              <div
                className="h-2"
                style={{ backgroundColor: statusColors[project.status] }}
              />
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">
                      {project.name ?? '-'}
                    </h2>
                    <p className="truncate text-sm text-light-text-secondary dark:text-dark-secondary">
                      {project.clientName ?? '-'}
                    </p>
                  </div>
                  <SquareButton
                    Icon={NotePencil}
                    ariaLabel={t('edit')}
                    onClick={() => {
                      setEditing(project);
                      setFormOpen(true);
                    }}
                  />
                </div>
                <p className="line-clamp-2 min-h-10 text-sm text-light-text-secondary dark:text-dark-secondary">
                  {project.description || '-'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Metric
                    label={t('total')}
                    value={formatCurrency(project.totalAmount, i18n.language)}
                  />
                  <Metric
                    label={t('paid')}
                    value={formatCurrency(project.paidAmount, i18n.language)}
                  />
                  <Metric
                    label={t('remain')}
                    value={formatCurrency(
                      project.remainingAmount,
                      i18n.language
                    )}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-light-text-secondary dark:text-dark-secondary">
                  <span>{t(`api_status_${project.status}`)}</span>
                  <span>{formatDate(project.deliveryDate)}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      {!query.isLoading && !query.data?.items.length && (
        <p className="py-12 text-center text-light-text-secondary dark:text-dark-secondary">
          {t('project_not_found')}
        </p>
      )}
      {(query.data?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center gap-2">
          <SecondaryButton
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            {t('previous')}
          </SecondaryButton>
          <span className="self-center text-sm">
            {page} / {query.data?.totalPages}
          </span>
          <SecondaryButton
            disabled={!query.data?.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            {t('next')}
          </SecondaryButton>
        </div>
      )}
      <ProjectForm
        key={`${editing?.id ?? 'new'}-${String(formOpen)}`}
        open={formOpen}
        project={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
    </motion.div>
  );
}

function ProjectDetails({ projectId }: { projectId: string }) {
  const { t } = useTranslation('projects');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const projectQuery = useProjectQuery(projectId);
  const updateProject = useUpdateProjectMutation();
  const deleteProject = useDeleteProjectMutation();
  const [activeTab, setActiveTab] = useState('general');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const project = projectQuery.data;
  const tabs = [
    'general',
    'members',
    'financial',
    'features',
    'renewals',
    'tasks',
  ];
  if (projectQuery.isLoading)
    return (
      <p className="p-4 text-light-text-secondary dark:text-dark-secondary">
        {t('common:loading')}
      </p>
    );
  if (!project)
    return (
      <div className="flex h-full flex-col items-start justify-center gap-3">
        <h1 className="text-xl font-semibold">{t('project_not_found')}</h1>
        <SecondaryButton onClick={() => navigate('/projects')}>
          {t('back_to_projects')}
        </SecondaryButton>
      </div>
    );

  const changeStatus = async (status: ProjectStatus) => {
    const payload = toPayload(project, { status });
    try {
      await updateProject.mutateAsync({ id: project.id, data: payload });
      showToast({ variant: 'success', description: t('project_saved') });
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-4 overflow-y-auto"
    >
      <BreadCrumb
        items={[
          { label: t('projects'), link: '/projects' },
          { label: project.name ?? '-' },
        ]}
        actions={
          <SquareButton
            Icon={Trash}
            ariaLabel={t('delete')}
            onClick={() => setDeleteOpen(true)}
          />
        }
      />
      <section className="overflow-hidden rounded-2 border border-light-card-border bg-white dark:border-dark-card-border dark:bg-dark-card-background">
        <div className="space-y-4 border-b border-light-card-border p-4 dark:border-dark-card-border">
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {project.description || '-'}
          </p>
          <div className="flex flex-wrap gap-2">
            {statusValues.map((status) =>
              status === project.status ? (
                <PrimaryButton
                  key={status}
                  onClick={() => changeStatus(status)}
                >
                  {t(`api_status_${status}`)}
                </PrimaryButton>
              ) : (
                <SecondaryButton
                  key={status}
                  onClick={() => changeStatus(status)}
                >
                  {t(`api_status_${status}`)}
                </SecondaryButton>
              )
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto border-b border-light-card-border p-3 dark:border-dark-card-border">
          {tabs.map((tab) =>
            tab === activeTab ? (
              <PrimaryButton key={tab} onClick={() => setActiveTab(tab)}>
                {t(`tab_${tab}`)}
              </PrimaryButton>
            ) : (
              <SecondaryButton key={tab} onClick={() => setActiveTab(tab)}>
                {t(`tab_${tab}`)}
              </SecondaryButton>
            )
          )}
        </div>
        <div className="p-4">
          {activeTab === 'general' && <GeneralTab project={project} />}
          {activeTab === 'members' && <ProjectMembers projectId={project.id} />}
          {activeTab === 'financial' && (
            <ProjectFinancialTab project={project} />
          )}
          {activeTab === 'features' && (
            <ProjectFeatures projectId={project.id} />
          )}
          {activeTab === 'renewals' && (
            <ProjectRenewals projectId={project.id} />
          )}
          {activeTab === 'tasks' && <TasksBoard projectId={project.id} />}
        </div>
      </section>
      <DeleteModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title={t('delete')}
        deleteMessage={t('delete_project_confirmation')}
        isLoading={deleteProject.isPending}
        handelDelete={async () => {
          try {
            await deleteProject.mutateAsync(project.id);
            navigate('/projects');
            showToast({
              variant: 'success',
              description: t('project_deleted'),
            });
          } catch (error) {
            showToast({
              variant: 'danger',
              description: getApiErrorMessage(error, t('operation_failed')),
            });
          }
        }}
      />
    </motion.div>
  );
}

function GeneralTab({ project }: { project: ProjectDto }) {
  const { t, i18n } = useTranslation('projects');
  const rows = [
    [t('client'), project.clientName ?? '-'],
    [t('receipt_date'), formatDate(project.receiptDate)],
    [t('start_date'), formatDate(project.startDate)],
    [t('delivery_date'), formatDate(project.deliveryDate)],
    [t('status'), t(`api_status_${project.status}`)],
    [t('priority'), t(`api_priority_${project.priority}`)],
    [t('total_amount'), formatCurrency(project.totalAmount, i18n.language)],
    [t('paid_amount'), formatCurrency(project.paidAmount, i18n.language)],
    [
      t('remaining_amount'),
      formatCurrency(project.remainingAmount, i18n.language),
    ],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([label, value]) => (
        <Metric key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function ProjectForm({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: ProjectDto | null;
  onClose: () => void;
}) {
  const { t } = useTranslation('projects');
  const { showToast } = useToast();
  const clients = useClientsQuery({ page: 1, pageSize: 100 });
  const createProject = useCreateProjectMutation();
  const updateProject = useUpdateProjectMutation();
  const [values, setValues] = useState({
    name: project?.name ?? '',
    clientId: project?.clientId ?? '',
    receiptDate: project?.receiptDate ?? '',
    startDate: project?.startDate ?? '',
    deliveryDate: project?.deliveryDate ?? '',
    description: project?.description ?? '',
    totalAmount: project ? String(project.totalAmount) : '',
    paidAmount: project ? String(project.paidAmount) : '0',
    status: project?.status ?? ('New' as ProjectStatus),
    priority: project?.priority ?? ('Medium' as ProjectPriority),
  });
  const clientOptions = (clients.data?.items ?? []).map((client) => ({
    label: client.name,
    value: client.id,
  }));
  const statusOptions = statusValues.map((status) => ({
    label: t(`api_status_${status}`),
    value: status,
  }));
  const priorityOptions = priorityValues.map((priority) => ({
    label: t(`api_priority_${priority}`),
    value: priority,
  }));
  const valid = Boolean(
    values.name.trim() &&
    values.clientId &&
    values.receiptDate &&
    values.startDate &&
    values.deliveryDate &&
    values.totalAmount !== '' &&
    Number(values.totalAmount) >= 0 &&
    Number(values.paidAmount) >= 0 &&
    Number(values.paidAmount) <= Number(values.totalAmount)
  );
  const save = async () => {
    if (!valid) return;
    const payload: ProjectPayload = {
      name: values.name.trim(),
      clientId: values.clientId,
      receiptDate: values.receiptDate || null,
      startDate: values.startDate || null,
      deliveryDate: values.deliveryDate || null,
      description: values.description || null,
      totalAmount: Number(values.totalAmount),
      paidAmount: Number(values.paidAmount),
      status: values.status,
      priority: values.priority,
    };
    try {
      if (project)
        await updateProject.mutateAsync({ id: project.id, data: payload });
      else await createProject.mutateAsync(payload);
      showToast({ variant: 'success', description: t('project_saved') });
      onClose();
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={t(project ? 'edit_project' : 'new_project')}
      contentClassName="sm:w-[900px]"
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton
            disabled={!valid}
            isSubmitting={createProject.isPending || updateProject.isPending}
            onClick={save}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t('project_name')}
          required
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
        />
        <SelectInput
          label={t('client')}
          required
          options={clientOptions}
          isLoading={clients.isLoading}
          value={
            clientOptions.find((item) => item.value === values.clientId) ?? null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              clientId: (option as SelectOption | null)?.value ?? '',
            }))
          }
        />
        <DateCalendarInput
          label={t('receipt_date')}
          required
          value={parseApiDate(values.receiptDate)}
          onChange={(date) =>
            setValues((current) => ({
              ...current,
              receiptDate: formatApiDate(date),
            }))
          }
        />
        <DateCalendarInput
          label={t('start_date')}
          required
          value={parseApiDate(values.startDate)}
          onChange={(date) =>
            setValues((current) => ({
              ...current,
              startDate: formatApiDate(date),
            }))
          }
        />
        <DateCalendarInput
          label={t('delivery_date')}
          required
          value={parseApiDate(values.deliveryDate)}
          onChange={(date) =>
            setValues((current) => ({
              ...current,
              deliveryDate: formatApiDate(date),
            }))
          }
        />
        <SelectInput
          label={t('status')}
          required
          options={statusOptions}
          value={
            statusOptions.find((item) => item.value === values.status) ?? null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              status: ((option as SelectOption | null)?.value ??
                'New') as ProjectStatus,
            }))
          }
        />
        <SelectInput
          label={t('priority')}
          required
          options={priorityOptions}
          value={
            priorityOptions.find((item) => item.value === values.priority) ??
            null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              priority: ((option as SelectOption | null)?.value ??
                'Medium') as ProjectPriority,
            }))
          }
        />
        <Input
          label={t('total_amount')}
          required
          type="number"
          value={values.totalAmount}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              totalAmount: event.target.value,
              paidAmount:
                Number(current.paidAmount) > Number(event.target.value)
                  ? event.target.value
                  : current.paidAmount,
            }))
          }
        />
        <Input
          label={t('paid_amount')}
          required
          type="number"
          value={values.paidAmount}
          error={
            Number(values.paidAmount) > Number(values.totalAmount)
              ? t('paid_exceeds_total')
              : undefined
          }
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              paidAmount: event.target.value,
            }))
          }
        />
        <Textarea
          wrapperClassName="md:col-span-2"
          label={t('description_notes')}
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </div>
    </Modal>
  );
}

function TasksBoard({ projectId }: { projectId: string }) {
  const { t } = useTranslation('projects');
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const tasks = useTasksQuery(projectId);
  const statuses = useTaskStatusesQuery();
  const createTask = useCreateTaskMutation();
  const updateTask = useUpdateTaskMutation();
  const deleteTask = useDeleteTaskMutation();
  const statusItems = statuses.data?.items ?? [];
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const task = tasks.data?.items.find(
      (item) => item.id === String(active.id)
    );
    const status = statusItems.find((item) => item.id === String(over.id));
    if (!task || !status || task.taskStatusId === status.id) return;
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: taskPayload(task, { taskStatusId: status.id }),
      });
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  const addTask = async () => {
    const defaultStatus =
      statusItems.find((item) => item.default) ?? statusItems[0];
    if (!title.trim() || !defaultStatus) return;
    try {
      await createTask.mutateAsync({
        no: null,
        name: title.trim(),
        description: null,
        startDate: null,
        deliverDate: null,
        employeeId: null,
        projectId,
        taskStatusId: defaultStatus.id,
        priority: 'Medium',
        taskCategoryId: null,
      });
      setTitle('');
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            wrapperClassName="flex-1"
            label={t('task_title')}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <PrimaryButton
            disabled={!statusItems.length}
            isSubmitting={createTask.isPending}
            icon={<Plus size={16} />}
            onClick={addTask}
          >
            {t('add_task')}
          </PrimaryButton>
        </div>
        {tasks.isLoading || statuses.isLoading ? (
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('common:loading')}
          </p>
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            {statusItems.map((status) => (
              <TaskColumn
                key={status.id}
                status={status}
                tasks={(tasks.data?.items ?? []).filter(
                  (task) => task.taskStatusId === status.id
                )}
                onDelete={async (id) => {
                  try {
                    await deleteTask.mutateAsync(id);
                  } catch (error) {
                    showToast({
                      variant: 'danger',
                      description: getApiErrorMessage(
                        error,
                        t('operation_failed')
                      ),
                    });
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </DndContext>
  );
}
function TaskColumn({
  status,
  tasks,
  onDelete,
}: {
  status: TaskStatusDto;
  tasks: TaskDto[];
  onDelete: (id: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status.id });
  return (
    <section
      ref={setNodeRef}
      className={`min-h-64 rounded-2 border p-3 transition ${isOver ? 'border-primary-light-500 bg-primary-light-50 dark:bg-dark-card-background' : 'border-transparent bg-gray-light-100 dark:bg-dark-card-surface'}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">
          <Kanban size={16} className="inline" /> {status.name ?? '-'}
        </h3>
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: status.color ?? '#3f6d6a' }}
        />
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </section>
  );
}
function TaskCard({ task, onDelete }: { task: TaskDto; onDelete: () => void }) {
  const { t } = useTranslation('projects');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  return (
    <motion.article
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      layout
      className={`touch-none rounded-2 border border-light-card-border bg-white p-3 shadow-sm dark:border-dark-card-border dark:bg-dark-card-background ${isDragging ? 'relative z-10 opacity-80' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 cursor-grab" {...listeners} {...attributes}>
          <h4 className="font-medium">{task.name ?? '-'}</h4>
          <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
            {task.employeeName ?? t('unassigned')} · {task.priority}
          </p>
        </div>
        <div className="flex gap-1">
          <SquareButton
            Icon={Eye}
            ariaLabel={t('view')}
            onClick={() => setDetailsOpen(true)}
          />
          <SquareButton
            Icon={Trash}
            ariaLabel={t('delete')}
            onClick={onDelete}
          />
        </div>
      </div>
      <TaskDetailsModal
        task={task}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </motion.article>
  );
}

const taskRelatedResources = [
  { key: 'task-discussions', filterKey: 'TaskId' },
  { key: 'task-followers', filterKey: 'TaskId' },
  { key: 'task-prices', filterKey: 'TaskId' },
  { key: 'task-logs', filterKey: 'TaskId' },
  { key: 'tag-tasks', filterKey: 'TaskId' },
  { key: 'task-disbursement-items', filterKey: 'TaskId' },
];

function TaskDetailsModal({
  task,
  open,
  onClose,
}: {
  task: TaskDto;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('projects');
  const { t: tm } = useTranslation('management');
  const [activeTab, setActiveTab] = useState('details');
  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={task.name ?? t('task_details')}
      contentClassName="sm:w-[1000px]"
      footer={<SecondaryButton onClick={onClose}>{t('close')}</SecondaryButton>}
    >
      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-light-card-border pb-3 dark:border-dark-card-border">
        {['details', ...taskRelatedResources.map((item) => item.key)].map(
          (tab) =>
            tab === activeTab ? (
              <PrimaryButton key={tab} onClick={() => setActiveTab(tab)}>
                {tab === 'details' ? t('task_details') : tm(`resource_${tab}`)}
              </PrimaryButton>
            ) : (
              <SecondaryButton key={tab} onClick={() => setActiveTab(tab)}>
                {tab === 'details' ? t('task_details') : tm(`resource_${tab}`)}
              </SecondaryButton>
            )
        )}
      </div>
      {activeTab === 'details' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label={t('task_title')} value={task.name ?? '-'} />
          <Metric label={t('description')} value={task.description ?? '-'} />
          <Metric label={t('priority')} value={task.priority} />
          <Metric
            label={t('employee')}
            value={task.employeeName ?? t('unassigned')}
          />
          <Metric label={t('start_date')} value={formatDate(task.startDate)} />
          <Metric
            label={t('delivery_date')}
            value={formatDate(task.deliverDate)}
          />
        </div>
      )}
      {taskRelatedResources.map(
        (item) =>
          activeTab === item.key && (
            <RelatedResourcePanel
              key={item.key}
              resourceKey={item.key}
              fixedValues={{ taskId: task.id }}
              filters={{ [item.filterKey]: task.id }}
            />
          )
      )}
    </Modal>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2 bg-gray-light-100 p-3 dark:bg-dark-card-surface">
      <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
        {label}
      </p>
      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  );
}
function toPayload(
  project: ProjectDto,
  changes: Partial<ProjectPayload> = {}
): ProjectPayload {
  return {
    name: project.name,
    receiptDate: project.receiptDate,
    deliveryDate: project.deliveryDate,
    startDate: project.startDate,
    description: project.description,
    totalAmount: project.totalAmount,
    paidAmount: project.paidAmount,
    status: project.status,
    priority: project.priority,
    clientId: project.clientId,
    ...changes,
  };
}
function taskPayload(
  task: TaskDto,
  changes: Partial<TaskPayload> = {}
): TaskPayload {
  return {
    no: task.no,
    name: task.name,
    description: task.description,
    startDate: task.startDate,
    deliverDate: task.deliverDate,
    employeeId: task.employeeId,
    projectId: task.projectId,
    taskStatusId: task.taskStatusId,
    priority: task.priority,
    taskCategoryId: task.taskCategoryId,
    ...changes,
  };
}
