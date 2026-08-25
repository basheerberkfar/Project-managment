import { Eye, NotePencil, Plus, Trash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DeleteModal from '@/components/common/delete-modal';
import { Table, type Column } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { DateCalendarInput } from '@/components/ui/date-calendar';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/toast';
import { formatApiDate, parseApiDate } from '@/utils/date-value';
import { getApiErrorMessage } from '@/utils/helpers';
import { getManagementResource } from '../catalog';
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useResourceListQuery,
  useUpdateResourceMutation,
  type ResourceConfig,
  type ResourceField,
  type ResourcePayload,
  type ResourceRecord,
  type ResourceValue,
} from '../service';

export default function ManagementPage() {
  const { resource } = useParams();
  const config = getManagementResource(resource);
  return config ? (
    <ResourcePage key={config.key} config={config} />
  ) : (
    <MissingResource />
  );
}

function MissingResource() {
  const { t } = useTranslation('management');
  return (
    <div className="flex h-full items-center justify-center text-light-text-secondary dark:text-dark-secondary">
      {t('resource_not_found')}
    </div>
  );
}

function ResourcePage({ config }: { config: ResourceConfig }) {
  const { t } = useTranslation('management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [viewing, setViewing] = useState<ResourceRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResourceRecord | null>(null);
  const query = useResourceListQuery(config.endpoint, {
    Page: page,
    PageSize: pageSize,
    Search: search || undefined,
  });
  const remove = useDeleteResourceMutation(config.endpoint);
  const tableFields = config.fields.filter((field) => field.table).slice(0, 6);
  const columns = useMemo<Column<ResourceRecord>[]>(
    () =>
      tableFields.map((field) => ({
        id: field.key,
        header: t(`field_${field.key}`),
        render: (row) => <TableText text={displayValue(row, field, t)} />,
      })),
    [tableFields, t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('workspace')}
          </p>
          <h1 className="text-2xl font-semibold">
            {t(`resource_${config.key}`)}
          </h1>
        </div>
        {!config.readOnly && (
          <PrimaryButton
            icon={<Plus size={16} />}
            onClick={() => setFormOpen(true)}
          >
            {t('add')}
          </PrimaryButton>
        )}
      </header>
      <Input
        label={t('search')}
        value={search}
        wrapperClassName="max-w-xl"
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />
      <Table
        columns={columns}
        data={query.data?.items ?? []}
        isLoading={query.isLoading}
        emptyMessage={t('no_records')}
        pagination={{
          pageIndex: page - 1,
          pageSize,
          totalCount: query.data?.totalCount ?? 0,
          onPageChange: (next) => setPage(next + 1),
          onPageSizeChange: (next) => {
            setPageSize(next);
            setPage(1);
          },
        }}
        actionsColumn={
          config.readOnly
            ? undefined
            : {
                header: t('actions'),
                actions: [
                  {
                    id: 'view',
                    label: t('view'),
                    icon: <Eye size={16} />,
                    onClick: (row) => setViewing(row),
                  },
                  {
                    id: 'edit',
                    label: t('edit'),
                    icon: <NotePencil size={16} />,
                    onClick: (row) => {
                      setEditing(row);
                      setFormOpen(true);
                    },
                  },
                  {
                    id: 'delete',
                    label: t('delete'),
                    icon: <Trash size={16} />,
                    variant: 'danger',
                    onClick: (row) => setDeleteTarget(row),
                  },
                ],
              }
        }
      />
      <ResourceForm
        key={`${editing?.id ?? 'new'}-${String(formOpen)}`}
        config={config}
        record={editing}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
      <ResourceView
        key={viewing?.id ?? 'closed'}
        config={config}
        record={viewing}
        onClose={() => setViewing(null)}
      />
      <DeleteModal
        open={Boolean(deleteTarget)}
        setOpen={(open) => !open && setDeleteTarget(null)}
        title={t('delete')}
        deleteMessage={t('delete_confirmation')}
        isLoading={remove.isPending}
        handelDelete={async () => {
          if (!deleteTarget) return;
          try {
            await remove.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
            showToast({
              variant: 'success',
              description: t('deleted_successfully'),
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

function ResourceView({
  config,
  record,
  onClose,
}: {
  config: ResourceConfig;
  record: ResourceRecord | null;
  onClose: () => void;
}) {
  const { t } = useTranslation('management');
  const [activeTab, setActiveTab] = useState('details');
  if (!record) return null;
  const children = config.children ?? [];
  return (
    <Modal
      open
      setOpen={(open) => !open && onClose()}
      title={t('view_resource', { resource: t(`resource_${config.key}`) })}
      contentClassName="sm:w-[1000px]"
      footer={<SecondaryButton onClick={onClose}>{t('close')}</SecondaryButton>}
    >
      {children.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto border-b border-light-card-border pb-3 dark:border-dark-card-border">
          {['details', ...children.map((child) => child.resourceKey)].map(
            (tab) =>
              tab === activeTab ? (
                <PrimaryButton key={tab} onClick={() => setActiveTab(tab)}>
                  {tab === 'details' ? t('details') : t(`resource_${tab}`)}
                </PrimaryButton>
              ) : (
                <SecondaryButton key={tab} onClick={() => setActiveTab(tab)}>
                  {tab === 'details' ? t('details') : t(`resource_${tab}`)}
                </SecondaryButton>
              )
          )}
        </div>
      )}
      {activeTab === 'details' && (
        <dl className="grid gap-3 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div
              key={field.key}
              className="rounded-lg bg-gray-light-100 p-3 dark:bg-dark-card-surface"
            >
              <dt className="text-xs text-light-text-secondary dark:text-dark-secondary">
                {t(`field_${field.key}`)}
              </dt>
              <dd className="mt-1 break-words font-medium">
                {displayValue(record, field, t)}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {children.map(
        (child) =>
          activeTab === child.resourceKey && (
            <RelatedResourcePanel
              key={child.resourceKey}
              resourceKey={child.resourceKey}
              fixedValues={{ [child.fieldKey]: record.id }}
              filters={{ [child.filterKey]: record.id }}
            />
          )
      )}
    </Modal>
  );
}

export function RelatedResourcePanel({
  resourceKey,
  fixedValues,
  filters,
}: {
  resourceKey: string;
  fixedValues: ResourcePayload;
  filters: Record<string, string>;
}) {
  const { t } = useTranslation('management');
  const { showToast } = useToast();
  const config = getManagementResource(resourceKey)!;
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [viewing, setViewing] = useState<ResourceRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResourceRecord | null>(null);
  const query = useResourceListQuery(config.endpoint, {
    ...filters,
    Page: 1,
    PageSize: 100,
  });
  const remove = useDeleteResourceMutation(config.endpoint);
  const hiddenKeys = new Set(Object.keys(fixedValues));
  const tableFields = config.fields
    .filter((field) => field.table && !hiddenKeys.has(field.key))
    .slice(0, 5);
  const columns: Column<ResourceRecord>[] = tableFields.map((field) => ({
    id: field.key,
    header: t(`field_${field.key}`),
    render: (row) => <TableText text={displayValue(row, field, t)} />,
  }));
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() => setFormOpen(true)}
        >
          {t('add')}
        </PrimaryButton>
      </div>
      <Table
        columns={columns}
        data={query.data?.items ?? []}
        isLoading={query.isLoading}
        emptyMessage={t('no_records')}
        actionsColumn={{
          header: t('actions'),
          actions: [
            {
              id: 'view',
              label: t('view'),
              icon: <Eye size={16} />,
              onClick: setViewing,
            },
            {
              id: 'edit',
              label: t('edit'),
              icon: <NotePencil size={16} />,
              onClick: (row) => {
                setEditing(row);
                setFormOpen(true);
              },
            },
            {
              id: 'delete',
              label: t('delete'),
              icon: <Trash size={16} />,
              variant: 'danger',
              onClick: setDeleteTarget,
            },
          ],
        }}
      />
      <ResourceForm
        key={`${editing?.id ?? 'new'}-${String(formOpen)}`}
        config={config}
        record={editing}
        fixedValues={fixedValues}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
      <ResourceView
        key={viewing?.id ?? 'closed'}
        config={config}
        record={viewing}
        onClose={() => setViewing(null)}
      />
      <DeleteModal
        open={Boolean(deleteTarget)}
        setOpen={(open) => !open && setDeleteTarget(null)}
        title={t('delete')}
        deleteMessage={t('delete_confirmation')}
        isLoading={remove.isPending}
        handelDelete={async () => {
          if (!deleteTarget) return;
          try {
            await remove.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
            showToast({
              variant: 'success',
              description: t('deleted_successfully'),
            });
          } catch (error) {
            showToast({
              variant: 'danger',
              description: getApiErrorMessage(error, t('operation_failed')),
            });
          }
        }}
      />
    </div>
  );
}

function displayValue(
  row: ResourceRecord,
  field: ResourceField,
  t: (key: string) => string
) {
  const relationNameKey = field.key.endsWith('Id')
    ? `${field.key.slice(0, -2)}Name`
    : '';
  const value = (relationNameKey && row[relationNameKey]) || row[field.key];
  if (field.type === 'boolean') return value ? t('yes') : t('no');
  return value == null || value === '' ? '-' : String(value);
}

function ResourceForm({
  config,
  record,
  fixedValues = {},
  open,
  onClose,
}: {
  config: ResourceConfig;
  record: ResourceRecord | null;
  fixedValues?: ResourcePayload;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('management');
  const { showToast } = useToast();
  const create = useCreateResourceMutation(config.endpoint);
  const update = useUpdateResourceMutation(config.endpoint);
  const [values, setValues] = useState<ResourcePayload>(() => ({
    ...Object.fromEntries(
      config.fields.map((field) => [
        field.key,
        initialValue(field, record?.[field.key]),
      ])
    ),
    ...fixedValues,
  }));
  const valid = config.fields.every(
    (field) =>
      !field.required || (values[field.key] !== '' && values[field.key] != null)
  );
  const setValue = (key: string, value: ResourceValue) =>
    setValues((current) => ({ ...current, [key]: value }));
  const save = async () => {
    if (!valid) return;
    const payload = {
      ...Object.fromEntries(
        config.fields.map((field) => [
          field.key,
          normalizeValue(field, values[field.key]),
        ])
      ),
      ...fixedValues,
    } as ResourcePayload;
    try {
      if (record) await update.mutateAsync({ id: record.id, data: payload });
      else await create.mutateAsync(payload);
      showToast({ variant: 'success', description: t('saved_successfully') });
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
      title={t(record ? 'edit_resource' : 'add_resource', {
        resource: t(`resource_${config.key}`),
      })}
      contentClassName="sm:w-[900px]"
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton
            disabled={!valid}
            isSubmitting={create.isPending || update.isPending}
            onClick={save}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields
          .filter((field) => !(field.key in fixedValues))
          .map((field) => (
            <ResourceFieldControl
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) => setValue(field.key, value)}
            />
          ))}
      </div>
    </Modal>
  );
}

function ResourceFieldControl({
  field,
  value,
  onChange,
}: {
  field: ResourceField;
  value: ResourceValue;
  onChange: (value: ResourceValue) => void;
}) {
  const { t } = useTranslation('management');
  const label = t(`field_${field.key}`);
  if (field.type === 'boolean')
    return (
      <div className="flex min-h-[52px] items-center justify-between rounded-lg border border-gray-light-500 px-4 dark:border-dark-card-border">
        <span className="text-sm">{label}</span>
        <Toggle checked={Boolean(value)} onChange={onChange} />
      </div>
    );
  if (field.type === 'textarea')
    return (
      <Textarea
        wrapperClassName="sm:col-span-2"
        label={label}
        required={field.required}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  if (field.type === 'date')
    return (
      <DateCalendarInput
        label={label}
        required={field.required}
        value={parseApiDate(String(value ?? ''))}
        onChange={(date) => onChange(formatApiDate(date))}
      />
    );
  if (field.type === 'relation' && field.relation)
    return (
      <RelationSelect
        field={field}
        value={String(value ?? '')}
        onChange={onChange}
      />
    );
  return (
    <Input
      label={label}
      required={field.required}
      type={field.type}
      value={String(value ?? '')}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function RelationSelect({
  field,
  value,
  onChange,
}: {
  field: ResourceField;
  value: string;
  onChange: (value: ResourceValue) => void;
}) {
  const { t } = useTranslation('management');
  const relationConfig = field.relation!;
  const query = useResourceListQuery(relationConfig.resource, {
    Page: 1,
    PageSize: 100,
  });
  const options = (query.data?.items ?? []).map((item) => ({
    value: item.id,
    label: String(
      item[relationConfig.labelKey] ?? item.name ?? item.title ?? item.id
    ),
  }));
  return (
    <SelectInput
      label={t(`field_${field.key}`)}
      required={field.required}
      isClearable={!field.required}
      isLoading={query.isLoading}
      options={options}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(option) =>
        onChange((option as SelectOption | null)?.value ?? '')
      }
    />
  );
}

function initialValue(
  field: ResourceField,
  value?: ResourceValue
): ResourceValue {
  if (value != null) {
    if (field.type === 'datetime-local') return String(value).slice(0, 16);
    if (field.type === 'date') return String(value).slice(0, 10);
    return value;
  }
  return field.type === 'boolean' ? false : field.type === 'number' ? '' : '';
}

function normalizeValue(
  field: ResourceField,
  value: ResourceValue
): ResourceValue {
  if (value === '' && !field.required) return null;
  if (field.type === 'number') return Number(value);
  return value;
}
