import { Eye, NotePencil, Plus, Receipt, Trash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '@/components/common/delete-modal';
import { Table, type Column } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { DateCalendarInput } from '@/components/ui/date-calendar';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SquareButton from '@/components/ui/squareButton';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage, formatDate } from '@/utils/helpers';
import { formatApiDate, parseApiDate } from '@/utils/date-value';
import {
  useFinancialData,
  type ProjectFeature,
  type Renewal,
} from '../financial-data';
import { BondFormModal, formatCurrency } from '../page';
import {
  useBillsQuery,
  useBondsQuery,
  useDeleteBillMutation,
  type BillDto,
} from '../service';

type ProjectInfo = {
  id: string;
  name: string | null;
  clientId: string;
  clientName: string | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
};

export function ProjectFinancialTab({ project }: { project: ProjectInfo }) {
  const { t, i18n } = useTranslation('finance');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const localData = useFinancialData();
  const billsQuery = useBillsQuery({
    ProjectId: project.id,
    Page: 1,
    PageSize: 100,
  });
  const bondsQuery = useBondsQuery({ Page: 1, PageSize: 1000 });
  const deleteBill = useDeleteBillMutation();
  const [bondOpen, setBondOpen] = useState(false);
  const [viewBill, setViewBill] = useState<BillDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BillDto | null>(null);
  const bills = useMemo(
    () => billsQuery.data?.items ?? [],
    [billsQuery.data?.items]
  );
  const billIds = useMemo(() => new Set(bills.map((bill) => bill.id)), [bills]);
  const renewalsTotal = localData.renewals
    .filter((item) => item.projectId === project.id)
    .reduce((sum, item) => sum + item.amount, 0);
  const featuresTotal = localData.features
    .filter((item) => item.projectId === project.id)
    .reduce((sum, item) => sum + item.amount, 0);
  const billsTotal = bills.reduce((sum, item) => sum + item.total, 0);
  const bondsTotal = (bondsQuery.data?.items ?? [])
    .filter((bond) => bond.billId && billIds.has(bond.billId))
    .reduce((sum, item) => sum + item.total, 0);
  const columns = useMemo<Column<BillDto>[]>(
    () => [
      {
        id: 'no',
        header: t('number'),
        render: (row) => <TableText text={row.no ?? '-'} />,
      },
      {
        id: 'type',
        header: t('type'),
        render: (row) => <TableText text={row.billTypeName ?? '-'} />,
      },
      {
        id: 'customer',
        header: t('customer'),
        render: (row) => <TableText text={row.clientName ?? '-'} />,
      },
      {
        id: 'total',
        header: t('amount'),
        render: (row) => (
          <TableText text={formatCurrency(row.total, i18n.language)} />
        ),
      },
      {
        id: 'date',
        header: t('date'),
        render: (row) => <TableText text={formatDate(row.createdAt)} />,
      },
      {
        id: 'actions',
        header: t('actions'),
        render: (row) => (
          <div className="flex gap-1">
            <SquareButton
              Icon={Eye}
              ariaLabel={t('view')}
              onClick={() => setViewBill(row)}
            />
            <SquareButton
              Icon={NotePencil}
              ariaLabel={t('edit')}
              onClick={() =>
                navigate(`/action-bill?id=${row.id}`, {
                  state: {
                    projectId: project.id,
                    clientId: project.clientId,
                    disableProjectAndClient: true,
                  },
                })
              }
            />
            <SquareButton
              Icon={Trash}
              ariaLabel={t('delete')}
              onClick={() => setDeleteTarget(row)}
            />
          </div>
        ),
      },
    ],
    [i18n.language, navigate, project.clientId, project.id, t]
  );
  const metrics = [
    [t('project_cost'), project.totalAmount],
    [t('paid'), project.paidAmount],
    [t('remaining'), project.remainingAmount],
    [t('renewals_total'), renewalsTotal],
    [t('features_total'), featuresTotal],
    [t('total_bills'), billsTotal],
    [t('total_bonds'), bondsTotal],
  ] as const;
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <PrimaryButton
          icon={<Plus size={16} />}
          onClick={() =>
            navigate('/action-bill', {
              state: {
                projectId: project.id,
                clientId: project.clientId,
                disableProjectAndClient: true,
              },
            })
          }
        >
          {t('add_bill')}
        </PrimaryButton>
        <SecondaryButton
          icon={<Plus size={16} />}
          onClick={() => setBondOpen(true)}
        >
          {t('add_bond')}
        </SecondaryButton>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <motion.article
            whileHover={{ y: -2 }}
            key={label}
            className="rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-surface"
          >
            <Receipt size={19} className="mb-2 text-primary-light-500" />
            <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
              {label}
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(value, i18n.language)}
            </p>
          </motion.article>
        ))}
      </div>
      <Table
        columns={columns}
        data={bills}
        isLoading={billsQuery.isLoading}
        emptyMessage={t('no_project_bills')}
      />
      <BondFormModal
        key={String(bondOpen)}
        open={bondOpen}
        projectId={project.id}
        onClose={() => setBondOpen(false)}
      />
      <Modal
        open={Boolean(viewBill)}
        setOpen={(open) => !open && setViewBill(null)}
        title={t('view_bill')}
        footer={
          <SecondaryButton onClick={() => setViewBill(null)}>
            {t('back')}
          </SecondaryButton>
        }
      >
        {viewBill && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [t('number'), viewBill.no ?? '-'],
              [t('customer'), viewBill.clientName ?? '-'],
              [t('amount'), formatCurrency(viewBill.total, i18n.language)],
              [t('paid'), formatCurrency(viewBill.paidAmount, i18n.language)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2 bg-gray-light-100 p-3 dark:bg-dark-card-surface"
              >
                <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
                  {label}
                </p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <DeleteModal
        open={Boolean(deleteTarget)}
        setOpen={(open) => !open && setDeleteTarget(null)}
        title={t('delete_bill')}
        deleteMessage={t('confirm_delete_bill', { number: deleteTarget?.no })}
        isLoading={deleteBill.isPending}
        handelDelete={async () => {
          if (!deleteTarget) return;
          try {
            await deleteBill.mutateAsync(deleteTarget.id);
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

export function ProjectRenewals({ projectId }: { projectId: string }) {
  const { t, i18n } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Renewal | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const records = data.renewals.filter((item) => item.projectId === projectId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">{t('renewals')}</h3>
        <PrimaryButton icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          {t('add_renewal')}
        </PrimaryButton>
      </div>
      <div className="space-y-2">
        {records.map((item) => (
          <motion.div
            layout
            key={item.id}
            className="grid items-center gap-2 rounded-2 border border-light-card-border p-3 dark:border-dark-card-border sm:grid-cols-[1fr_140px_140px_auto]"
          >
            <div>
              <b>{item.purpose}</b>
              <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
                {item.note || '-'}
              </p>
            </div>
            <span>{formatCurrency(item.amount, i18n.language)}</span>
            <span>{formatDate(item.date)}</span>
            <div className="flex gap-1">
              <SquareButton
                Icon={NotePencil}
                ariaLabel={t('edit')}
                onClick={() => {
                  setEditing(item);
                  setOpen(true);
                }}
              />
              <SquareButton
                Icon={Trash}
                ariaLabel={t('delete')}
                onClick={() => setDeleteId(item.id)}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <RenewalModal
        key={`${editing?.id ?? 'new'}-${String(open)}`}
        open={open}
        renewal={editing}
        projectId={projectId}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
      <DeleteModal
        open={Boolean(deleteId)}
        setOpen={(next) => !next && setDeleteId(null)}
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
    </div>
  );
}

export function ProjectFeatures({ projectId }: { projectId: string }) {
  const { t, i18n } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<ProjectFeature | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const records = data.features.filter((item) => item.projectId === projectId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">{t('features')}</h3>
        <PrimaryButton icon={<Plus size={16} />} onClick={() => setOpen(true)}>
          {t('add_feature')}
        </PrimaryButton>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {records.map((item) => (
          <motion.article
            whileHover={{ y: -2 }}
            key={item.id}
            className="rounded-2 border border-light-card-border p-4 dark:border-dark-card-border"
          >
            <div className="flex justify-between gap-3">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
                  {item.description || '-'}
                </p>
              </div>
              <b>{formatCurrency(item.amount, i18n.language)}</b>
            </div>
            <p className="mt-3 text-xs text-light-text-secondary dark:text-dark-secondary">
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </p>
            <div className="mt-3 flex gap-1">
              <SquareButton
                Icon={NotePencil}
                ariaLabel={t('edit')}
                onClick={() => {
                  setEditing(item);
                  setOpen(true);
                }}
              />
              <SquareButton
                Icon={Trash}
                ariaLabel={t('delete')}
                onClick={() => setDeleteId(item.id)}
              />
            </div>
          </motion.article>
        ))}
      </div>
      <FeatureModal
        key={`${editing?.id ?? 'new'}-${String(open)}`}
        open={open}
        feature={editing}
        projectId={projectId}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
      <DeleteModal
        open={Boolean(deleteId)}
        setOpen={(next) => !next && setDeleteId(null)}
        deleteMessage={t('delete')}
        handelDelete={() => {
          if (!deleteId) return;
          data.deleteFeature(deleteId);
          setDeleteId(null);
          showToast({
            variant: 'success',
            description: t('deleted_successfully'),
          });
        }}
      />
    </div>
  );
}

function RenewalModal({
  open,
  renewal,
  projectId,
  onClose,
}: {
  open: boolean;
  renewal: Renewal | null;
  projectId: string;
  onClose: () => void;
}) {
  const { t } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const [values, setValues] = useState({
    amount: renewal ? String(renewal.amount) : '',
    purpose: renewal?.purpose ?? '',
    date: renewal?.date ?? '',
    note: renewal?.note ?? '',
  });
  const valid = Boolean(
    values.amount !== '' &&
    Number(values.amount) >= 0 &&
    values.purpose.trim() &&
    values.date
  );
  return (
    <EditorModal
      open={open}
      title={t(renewal ? 'edit_renewal' : 'add_renewal')}
      valid={valid}
      onClose={onClose}
      onSave={() => {
        data.saveRenewal({
          id: renewal?.id,
          projectId,
          amount: Number(values.amount),
          purpose: values.purpose.trim(),
          date: values.date,
          note: values.note,
        });
        showToast({ variant: 'success', description: t('renewal_saved') });
        onClose();
      }}
    >
      <Input
        label={t('amount')}
        type="number"
        value={values.amount}
        onChange={(event) =>
          setValues((current) => ({ ...current, amount: event.target.value }))
        }
      />
      <Input
        label={t('purpose')}
        value={values.purpose}
        onChange={(event) =>
          setValues((current) => ({ ...current, purpose: event.target.value }))
        }
      />
      <DateCalendarInput
        label={t('date')}
        value={parseApiDate(values.date)}
        onChange={(date) =>
          setValues((current) => ({ ...current, date: formatApiDate(date) }))
        }
      />
      <Textarea
        label={t('note')}
        value={values.note}
        onChange={(event) =>
          setValues((current) => ({ ...current, note: event.target.value }))
        }
      />
    </EditorModal>
  );
}
function FeatureModal({
  open,
  feature,
  projectId,
  onClose,
}: {
  open: boolean;
  feature: ProjectFeature | null;
  projectId: string;
  onClose: () => void;
}) {
  const { t } = useTranslation('finance');
  const data = useFinancialData();
  const { showToast } = useToast();
  const [values, setValues] = useState({
    name: feature?.name ?? '',
    description: feature?.description ?? '',
    amount: feature ? String(feature.amount) : '',
    startDate: feature?.startDate ?? '',
    endDate: feature?.endDate ?? '',
  });
  const valid = Boolean(
    values.name.trim() &&
    values.amount !== '' &&
    Number(values.amount) >= 0 &&
    values.startDate &&
    values.endDate &&
    values.endDate >= values.startDate
  );
  return (
    <EditorModal
      open={open}
      title={t(feature ? 'edit_feature' : 'add_feature')}
      valid={valid}
      onClose={onClose}
      onSave={() => {
        data.saveFeature({
          id: feature?.id,
          projectId,
          name: values.name.trim(),
          description: values.description,
          amount: Number(values.amount),
          startDate: values.startDate,
          endDate: values.endDate,
        });
        showToast({ variant: 'success', description: t('feature_saved') });
        onClose();
      }}
    >
      <Input
        label={t('name')}
        value={values.name}
        onChange={(event) =>
          setValues((current) => ({ ...current, name: event.target.value }))
        }
      />
      <Input
        label={t('amount')}
        type="number"
        value={values.amount}
        onChange={(event) =>
          setValues((current) => ({ ...current, amount: event.target.value }))
        }
      />
      <DateCalendarInput
        label={t('start_date')}
        value={parseApiDate(values.startDate)}
        onChange={(date) =>
          setValues((current) => ({
            ...current,
            startDate: formatApiDate(date),
          }))
        }
      />
      <DateCalendarInput
        label={t('end_date')}
        minDate={parseApiDate(values.startDate) ?? undefined}
        value={parseApiDate(values.endDate)}
        onChange={(date) =>
          setValues((current) => ({ ...current, endDate: formatApiDate(date) }))
        }
      />
      <Textarea
        wrapperClassName="sm:col-span-2"
        label={t('description')}
        value={values.description}
        onChange={(event) =>
          setValues((current) => ({
            ...current,
            description: event.target.value,
          }))
        }
      />
    </EditorModal>
  );
}
function EditorModal({
  open,
  title,
  valid,
  onClose,
  onSave,
  children,
}: {
  open: boolean;
  title: string;
  valid: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation('finance');
  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={title}
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton disabled={!valid} onClick={onSave}>
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </Modal>
  );
}
