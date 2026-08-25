/* eslint-disable react-refresh/only-export-components */
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
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SquareButton from '@/components/ui/squareButton';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { getApiErrorMessage, formatDate } from '@/utils/helpers';
import { formatApiDate, parseApiDate } from '@/utils/date-value';
import { hasPermission } from '@/utils/permissions';
import {
  useBillTypesQuery,
  useBillsQuery,
  useBondTypesQuery,
  useBondsQuery,
  useCreateBondMutation,
  useDeleteBillMutation,
  useDeleteBondMutation,
  useUpdateBondMutation,
  type BillDto,
  type BondDto,
  type BondPayload,
} from '../service';

type FinancePageProps = { type: 'bills' | 'bonds' };
type DeleteTarget = { id: string; number: string } | null;
const PAGE_SIZE = 10;

export const formatCurrency = (value: number, language = 'en') =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);

export default function FinancePage({ type }: FinancePageProps) {
  const { t, i18n } = useTranslation('finance');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeId, setTypeId] = useState('');
  const [viewBill, setViewBill] = useState<BillDto | null>(null);
  const [viewBond, setViewBond] = useState<BondDto | null>(null);
  const [editBond, setEditBond] = useState<BondDto | null>(null);
  const [bondOpen, setBondOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const billTypesQuery = useBillTypesQuery({ Page: 1, PageSize: 100 });
  const bondTypesQuery = useBondTypesQuery({ Page: 1, PageSize: 100 });
  const billsQuery = useBillsQuery({
    Page: page,
    PageSize: PAGE_SIZE,
    Search: search || undefined,
    BillTypeId: type === 'bills' && typeId ? typeId : undefined,
  });
  const bondsQuery = useBondsQuery({
    Page: page,
    PageSize: PAGE_SIZE,
    Search: search || undefined,
    BondTypeId: type === 'bonds' && typeId ? typeId : undefined,
  });
  const summaryBills = useBillsQuery({ Page: 1, PageSize: 1000 });
  const summaryBonds = useBondsQuery({ Page: 1, PageSize: 1000 });
  const deleteBill = useDeleteBillMutation();
  const deleteBond = useDeleteBondMutation();
  const permissionGroup =
    type === 'bills' ? PERMISSION_GROUPS.bills : PERMISSION_GROUPS.bonds;
  const canCreate = hasPermission(permissionGroup, PERMISSION_ACTIONS.create);
  const canEdit = hasPermission(permissionGroup, PERMISSION_ACTIONS.update);
  const canDelete = hasPermission(permissionGroup, PERMISSION_ACTIONS.delete);
  const items =
    type === 'bills'
      ? (billsQuery.data?.items ?? [])
      : (bondsQuery.data?.items ?? []);
  const currentQuery = type === 'bills' ? billsQuery : bondsQuery;
  const typeOptions = (
    type === 'bills'
      ? (billTypesQuery.data?.items ?? [])
      : (bondTypesQuery.data?.items ?? [])
  ).map((item) => ({ label: item.name ?? '-', value: item.id }));
  const totalBills = (summaryBills.data?.items ?? []).reduce(
    (sum, item) => sum + item.total,
    0
  );
  const totalBonds = (summaryBonds.data?.items ?? []).reduce(
    (sum, item) => sum + item.total,
    0
  );

  const billColumns = useMemo<Column<BillDto>[]>(
    () => [
      {
        id: 'no',
        header: t('number'),
        render: (row) => <TableText text={row.no ?? '-'} />,
      },
      {
        id: 'billTypeName',
        header: t('type'),
        render: (row) => <TableText text={row.billTypeName ?? '-'} />,
      },
      {
        id: 'projectName',
        header: t('project'),
        render: (row) => <TableText text={row.projectName ?? '-'} />,
      },
      {
        id: 'clientName',
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
        id: 'createdAt',
        header: t('date'),
        render: (row) => <TableText text={formatDate(row.createdAt)} />,
      },
      {
        id: 'actions',
        header: t('actions'),
        stopRowClick: true,
        render: (row) => (
          <RowActions
            onView={() => setViewBill(row)}
            onEdit={
              canEdit ? () => navigate(`/action-bill?id=${row.id}`) : undefined
            }
            onDelete={
              canDelete
                ? () => setDeleteTarget({ id: row.id, number: row.no ?? '-' })
                : undefined
            }
          />
        ),
      },
    ],
    [canDelete, canEdit, i18n.language, navigate, t]
  );
  const bondColumns = useMemo<Column<BondDto>[]>(
    () => [
      {
        id: 'no',
        header: t('number'),
        render: (row) => <TableText text={row.no ?? '-'} />,
      },
      {
        id: 'bondTypeName',
        header: t('type'),
        render: (row) => <TableText text={row.bondTypeName ?? '-'} />,
      },
      {
        id: 'billNo',
        header: t('bill_optional'),
        render: (row) => <TableText text={row.billNo ?? '-'} />,
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
        render: (row) => <TableText text={formatDate(row.date)} />,
      },
      {
        id: 'actions',
        header: t('actions'),
        stopRowClick: true,
        render: (row) => (
          <RowActions
            onView={() => setViewBond(row)}
            onEdit={
              canEdit
                ? () => {
                    setEditBond(row);
                    setBondOpen(true);
                  }
                : undefined
            }
            onDelete={
              canDelete
                ? () => setDeleteTarget({ id: row.id, number: row.no ?? '-' })
                : undefined
            }
          />
        ),
      },
    ],
    [canDelete, canEdit, i18n.language, t]
  );

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      if (type === 'bills') await deleteBill.mutateAsync(deleteTarget.id);
      else await deleteBond.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      showToast({ variant: 'success', description: t('deleted_successfully') });
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
      className="flex h-full flex-col gap-5 overflow-y-auto"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('financial_data')}
          </p>
          <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-primary">
            {t(type)}
          </h1>
        </div>
        {canCreate && (
          <PrimaryButton
            icon={<Plus size={16} />}
            onClick={() =>
              type === 'bills' ? navigate('/action-bill') : setBondOpen(true)
            }
          >
            {t(type === 'bills' ? 'add_bill' : 'add_bond')}
          </PrimaryButton>
        )}
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [t('total_bills'), totalBills],
          [t('total_bonds'), totalBonds],
          [t('remaining'), Math.max(totalBills - totalBonds, 0)],
        ].map(([label, value]) => (
          <motion.article
            key={String(label)}
            whileHover={{ y: -2 }}
            className="rounded-2 border border-light-card-border bg-white p-4 shadow-sm dark:border-dark-card-border dark:bg-dark-card-background"
          >
            <Receipt size={20} className="mb-2 text-primary-light-500" />
            <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
              {label}
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(Number(value), i18n.language)}
            </p>
          </motion.article>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          label={t('search_records')}
        />
        <SelectInput
          label={t('type')}
          value={typeOptions.find((option) => option.value === typeId) ?? null}
          options={typeOptions}
          isClearable
          onChange={(option) => {
            setTypeId((option as SelectOption | null)?.value ?? '');
            setPage(1);
          }}
        />
      </div>
      <Table
        columns={
          (type === 'bills' ? billColumns : bondColumns) as Column<
            BillDto | BondDto
          >[]
        }
        data={items}
        isLoading={currentQuery.isLoading}
        emptyMessage={t('no_records')}
        pagination={{
          pageIndex: page - 1,
          pageSize: PAGE_SIZE,
          totalCount: currentQuery.data?.totalCount ?? 0,
          onPageChange: (nextPage) => setPage(nextPage + 1),
          onPageSizeChange: () => undefined,
        }}
      />
      <RecordViewModal
        bill={viewBill}
        bond={viewBond}
        onClose={() => {
          setViewBill(null);
          setViewBond(null);
        }}
      />
      <BondFormModal
        key={`${editBond?.id ?? 'new'}-${String(bondOpen)}`}
        open={bondOpen}
        bond={editBond}
        onClose={() => {
          setBondOpen(false);
          setEditBond(null);
        }}
      />
      <DeleteModal
        open={Boolean(deleteTarget)}
        setOpen={(open) => !open && setDeleteTarget(null)}
        title={t(type === 'bills' ? 'delete_bill' : 'delete_bond')}
        deleteMessage={t(
          type === 'bills' ? 'confirm_delete_bill' : 'confirm_delete_bond',
          { number: deleteTarget?.number }
        )}
        isLoading={deleteBill.isPending || deleteBond.isPending}
        handelDelete={remove}
      />
    </motion.div>
  );
}

function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { t } = useTranslation('finance');
  return (
    <div className="flex gap-1">
      <SquareButton Icon={Eye} ariaLabel={t('view')} onClick={onView} />
      {onEdit && (
        <SquareButton
          Icon={NotePencil}
          ariaLabel={t('edit')}
          onClick={onEdit}
        />
      )}
      {onDelete && (
        <SquareButton
          Icon={Trash}
          ariaLabel={t('delete')}
          className="hover:border-danger-500"
          onClick={onDelete}
        />
      )}
    </div>
  );
}

function RecordViewModal({
  bill,
  bond,
  onClose,
}: {
  bill: BillDto | null;
  bond: BondDto | null;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation('finance');
  const record = bill ?? bond;
  if (!record) return null;
  const rows = bill
    ? [
        [t('number'), bill.no ?? '-'],
        [t('type'), bill.billTypeName ?? '-'],
        [t('project'), bill.projectName ?? '-'],
        [t('customer'), bill.clientName ?? '-'],
        [t('amount'), formatCurrency(bill.total, i18n.language)],
        [t('paid'), formatCurrency(bill.paidAmount, i18n.language)],
      ]
    : [
        [t('number'), bond?.no ?? '-'],
        [t('type'), bond?.bondTypeName ?? '-'],
        [t('bill_optional'), bond?.billNo ?? '-'],
        [t('amount'), formatCurrency(bond?.total ?? 0, i18n.language)],
        [t('date'), formatDate(bond?.date)],
        [t('notes'), bond?.notes ?? '-'],
      ];
  return (
    <Modal
      open
      setOpen={(open) => !open && onClose()}
      title={t(bill ? 'view_bill' : 'view_bond')}
      footer={<SecondaryButton onClick={onClose}>{t('back')}</SecondaryButton>}
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2 bg-gray-light-100 p-3 dark:bg-dark-card-surface"
          >
            <dt className="text-xs text-light-text-secondary dark:text-dark-secondary">
              {label}
            </dt>
            <dd className="mt-1 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}

export function BondFormModal({
  open,
  bond,
  billId,
  projectId,
  onClose,
}: {
  open: boolean;
  bond?: BondDto | null;
  billId?: string;
  projectId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation('finance');
  const { showToast } = useToast();
  const types = useBondTypesQuery({ Page: 1, PageSize: 100 });
  const bills = useBillsQuery({ Page: 1, PageSize: 100, ProjectId: projectId });
  const createBond = useCreateBondMutation();
  const updateBond = useUpdateBondMutation();
  const [values, setValues] = useState({
    no: bond?.no ?? '',
    date: bond?.date ?? '',
    barcode: bond?.barcode ?? '',
    billId: bond?.billId ?? billId ?? '',
    bondTypeId: bond?.bondTypeId ?? '',
    total: bond ? String(bond.total) : '',
    notes: bond?.notes ?? '',
  });
  const typeOptions = (types.data?.items ?? []).map((item) => ({
    label: item.name ?? '-',
    value: item.id,
  }));
  const billOptions = (bills.data?.items ?? []).map((item) => ({
    label: item.no ?? item.id,
    value: item.id,
  }));
  const valid = Boolean(
    values.bondTypeId &&
    values.date &&
    values.total !== '' &&
    Number(values.total) >= 0
  );
  const save = async () => {
    if (!valid) return;
    const payload: BondPayload = {
      no: values.no || null,
      date: values.date,
      barcode: values.barcode || null,
      relatedToBill: Boolean(values.billId),
      billId: values.billId || null,
      bondTypeId: values.bondTypeId,
      total: Number(values.total),
      notes: values.notes || null,
    };
    try {
      if (bond) await updateBond.mutateAsync({ id: bond.id, data: payload });
      else await createBond.mutateAsync(payload);
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
      title={t(bond ? 'edit_bond' : 'add_bond')}
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton
            disabled={!valid}
            isSubmitting={createBond.isPending || updateBond.isPending}
            onClick={save}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('number')}
          value={values.no}
          onChange={(event) =>
            setValues((current) => ({ ...current, no: event.target.value }))
          }
        />
        <SelectInput
          label={t('type')}
          required
          options={typeOptions}
          value={
            typeOptions.find((option) => option.value === values.bondTypeId) ??
            null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              bondTypeId: (option as SelectOption | null)?.value ?? '',
            }))
          }
        />
        <SelectInput
          label={t('bill_optional')}
          options={billOptions}
          isClearable
          value={
            billOptions.find((option) => option.value === values.billId) ?? null
          }
          onChange={(option) =>
            setValues((current) => ({
              ...current,
              billId: (option as SelectOption | null)?.value ?? '',
            }))
          }
        />
        <Input
          label={t('amount')}
          required
          type="number"
          value={values.total}
          onChange={(event) =>
            setValues((current) => ({ ...current, total: event.target.value }))
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
        <Input
          label={t('barcode')}
          value={values.barcode}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              barcode: event.target.value,
            }))
          }
        />
        <Textarea
          label={t('notes')}
          wrapperClassName="sm:col-span-2"
          value={values.notes}
          onChange={(event) =>
            setValues((current) => ({ ...current, notes: event.target.value }))
          }
        />
      </div>
    </Modal>
  );
}
