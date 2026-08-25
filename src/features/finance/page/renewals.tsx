import { NotePencil, Plus, Trash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteModal from '@/components/common/delete-modal';
import { Table, type Column } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { DateCalendarInput } from '@/components/ui/date-calendar';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SquareButton from '@/components/ui/squareButton';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { useProjectsQuery } from '@/features/projects/service';
import { formatDate } from '@/utils/helpers';
import { formatApiDate, parseApiDate } from '@/utils/date-value';
import { useFinancialData, type Renewal } from '../financial-data';
import { formatCurrency } from '.';

export default function RenewalsPage() {
  const { t, i18n } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const projects = useProjectsQuery({ Page: 1, PageSize: 100 });
  const [editing, setEditing] = useState<Renewal | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const projectNames = useMemo(
    () =>
      new Map(
        (projects.data?.items ?? []).map((project) => [
          project.id,
          project.name ?? '-',
        ])
      ),
    [projects.data?.items]
  );
  const columns = useMemo<Column<Renewal>[]>(
    () => [
      {
        id: 'project',
        header: t('project'),
        render: (row) => (
          <TableText text={projectNames.get(row.projectId) ?? '-'} />
        ),
      },
      {
        id: 'purpose',
        header: t('purpose'),
        render: (row) => <TableText text={row.purpose} />,
      },
      {
        id: 'amount',
        header: t('amount'),
        render: (row) => (
          <TableText text={formatCurrency(row.amount, i18n.language)} />
        ),
      },
      {
        id: 'date',
        header: t('date'),
        render: (row) => <TableText text={formatDate(row.date)} />,
      },
      {
        id: 'note',
        header: t('note'),
        render: (row) => <TableText text={row.note || '-'} />,
      },
      {
        id: 'actions',
        header: t('actions'),
        render: (row) => (
          <div className="flex gap-1">
            <SquareButton
              Icon={NotePencil}
              ariaLabel={t('edit')}
              onClick={() => {
                setEditing(row);
                setFormOpen(true);
              }}
            />
            <SquareButton
              Icon={Trash}
              ariaLabel={t('delete')}
              onClick={() => setDeleteId(row.id)}
            />
          </div>
        ),
      },
    ],
    [i18n.language, projectNames, t]
  );
  const total = data.renewals.reduce((sum, item) => sum + item.amount, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-5 overflow-y-auto"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('financial_data')}
          </p>
          <h1 className="text-2xl font-semibold">{t('renewals')}</h1>
        </div>
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() => setFormOpen(true)}
        >
          {t('add_renewal')}
        </PrimaryButton>
      </header>
      <div className="rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
        <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
          {t('renewals_total')}
        </p>
        <p className="mt-1 text-2xl font-semibold">
          {formatCurrency(total, i18n.language)}
        </p>
      </div>
      <Table
        columns={columns}
        data={data.renewals}
        emptyMessage={t('no_records')}
      />
      <RenewalForm
        key={`${editing?.id ?? 'new'}-${String(formOpen)}`}
        open={formOpen}
        renewal={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
      <DeleteModal
        open={Boolean(deleteId)}
        setOpen={(open) => !open && setDeleteId(null)}
        title={t('delete')}
        deleteMessage={t('delete')}
        handelDelete={() => {
          if (!deleteId) return;
          data.deleteRenewal(deleteId);
          setDeleteId(null);
          showToast({
            variant: 'success',
            description: t('deleted_successfully'),
          });
        }}
      />
    </motion.div>
  );
}

function RenewalForm({
  open,
  renewal,
  onClose,
}: {
  open: boolean;
  renewal: Renewal | null;
  onClose: () => void;
}) {
  const { t } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const projects = useProjectsQuery({ Page: 1, PageSize: 100 });
  const [values, setValues] = useState({
    projectId: renewal?.projectId ?? '',
    amount: renewal ? String(renewal.amount) : '',
    purpose: renewal?.purpose ?? '',
    date: renewal?.date ?? '',
    note: renewal?.note ?? '',
  });
  const projectOptions = (projects.data?.items ?? []).map((project) => ({
    label: project.name ?? '-',
    value: project.id,
  }));
  const valid = Boolean(
    values.projectId &&
    values.amount !== '' &&
    Number(values.amount) >= 0 &&
    values.purpose.trim() &&
    values.date
  );
  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={t(renewal ? 'edit_renewal' : 'add_renewal')}
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton
            disabled={!valid}
            onClick={() => {
              data.saveRenewal({
                id: renewal?.id,
                projectId: values.projectId,
                amount: Number(values.amount),
                purpose: values.purpose.trim(),
                date: values.date,
                note: values.note,
              });
              showToast({
                variant: 'success',
                description: t('renewal_saved'),
              });
              onClose();
            }}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput
          label={t('project')}
          required
          options={projectOptions}
          isLoading={projects.isLoading}
          value={
            projectOptions.find(
              (option) => option.value === values.projectId
            ) ?? null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              projectId: (option as SelectOption | null)?.value ?? '',
            }))
          }
        />
        <Input
          label={t('amount')}
          required
          type="number"
          value={values.amount}
          onChange={(event) =>
            setValues((current) => ({ ...current, amount: event.target.value }))
          }
        />
        <Input
          label={t('purpose')}
          required
          value={values.purpose}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              purpose: event.target.value,
            }))
          }
        />
        <DateCalendarInput
          label={t('date')}
          required
          value={parseApiDate(values.date)}
          onChange={(date) =>
            setValues((current) => ({ ...current, date: formatApiDate(date) }))
          }
        />
        <Textarea
          wrapperClassName="sm:col-span-2"
          label={t('note')}
          value={values.note}
          onChange={(event) =>
            setValues((current) => ({ ...current, note: event.target.value }))
          }
        />
      </div>
    </Modal>
  );
}
