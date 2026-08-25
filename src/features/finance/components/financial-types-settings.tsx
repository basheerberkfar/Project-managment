import { NotePencil, Plus, Trash } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteModal from '@/components/common/delete-modal';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SquareButton from '@/components/ui/squareButton';
import { useToast } from '@/components/ui/toast';
import { useUsersQuery } from '@/features/users/service';
import { getApiErrorMessage } from '@/utils/helpers';
import {
  useBillTypesQuery,
  useBondTypesQuery,
  useCreateBillTypeMutation,
  useCreateBondTypeMutation,
  useDeleteBillTypeMutation,
  useDeleteBondTypeMutation,
  useUpdateBillTypeMutation,
  useUpdateBondTypeMutation,
  type BillTypeDto,
  type BondTypeDto,
} from '../service';

export default function FinancialTypesSettings() {
  const { t } = useTranslation('finance');
  const billTypes = useBillTypesQuery({ Page: 1, PageSize: 100 });
  const bondTypes = useBondTypesQuery({ Page: 1, PageSize: 100 });
  return <div className="grid gap-4 xl:grid-cols-2"><TypeSection kind="bill" title={t('bill_types')} items={billTypes.data?.items ?? []} loading={billTypes.isLoading} /><TypeSection kind="bond" title={t('bond_types')} items={bondTypes.data?.items ?? []} loading={bondTypes.isLoading} /></div>;
}

function TypeSection({ kind, title, items, loading }: { kind: 'bill' | 'bond'; title: string; items: (BillTypeDto | BondTypeDto)[]; loading: boolean }) {
  const { t } = useTranslation('finance');
  const { showToast } = useToast();
  const [editing, setEditing] = useState<BillTypeDto | BondTypeDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const deleteBillType = useDeleteBillTypeMutation(); const deleteBondType = useDeleteBondTypeMutation();
  const remove = async () => { if (!deleteId) return; try { if (kind === 'bill') await deleteBillType.mutateAsync(deleteId); else await deleteBondType.mutateAsync(deleteId); setDeleteId(''); showToast({ variant: 'success', description: t('deleted_successfully') }); } catch (error) { showToast({ variant: 'danger', description: getApiErrorMessage(error, t('operation_failed')) }); } };
  return <section className="space-y-4 rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background"><div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><PrimaryButton icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>{t('add')}</PrimaryButton></div>{loading ? <p className="text-sm text-light-text-secondary dark:text-dark-secondary">{t('common:loading')}</p> : <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-2 bg-gray-light-100 p-3 dark:bg-dark-card-surface"><div className="min-w-0"><p className="truncate font-medium">{item.name ?? '-'}</p><p className="text-xs text-light-text-secondary dark:text-dark-secondary">{item.type ?? '-'}</p>{'cashierName' in item && <p className="text-xs text-light-text-secondary dark:text-dark-secondary">{item.cashierName ?? '-'}</p>}</div><div className="flex gap-1"><SquareButton Icon={NotePencil} ariaLabel={t('edit')} onClick={() => { setEditing(item); setFormOpen(true); }} /><SquareButton Icon={Trash} ariaLabel={t('delete')} onClick={() => setDeleteId(item.id)} /></div></div>)}</div>}<TypeForm key={`${editing?.id ?? 'new'}-${String(formOpen)}`} open={formOpen} kind={kind} item={editing} onClose={() => { setFormOpen(false); setEditing(null); }} /><DeleteModal open={Boolean(deleteId)} setOpen={(open) => !open && setDeleteId('')} title={t('delete')} deleteMessage={t('delete_type_confirmation')} isLoading={deleteBillType.isPending || deleteBondType.isPending} handelDelete={remove} /></section>;
}

function TypeForm({ open, kind, item, onClose }: { open: boolean; kind: 'bill' | 'bond'; item: BillTypeDto | BondTypeDto | null; onClose: () => void }) {
  const { t } = useTranslation('finance'); const { showToast } = useToast();
  const users = useUsersQuery({ page: 1, pageSize: 100, IsActive: true });
  const createBill = useCreateBillTypeMutation(); const updateBill = useUpdateBillTypeMutation(); const createBond = useCreateBondTypeMutation(); const updateBond = useUpdateBondTypeMutation();
  const [values, setValues] = useState({ name: item?.name ?? '', type: item?.type ?? '', cashierId: item && 'cashierId' in item ? item.cashierId : '' });
  const cashierOptions = (users.data?.items ?? []).map((user) => ({ label: user.name, value: user.id }));
  const valid = Boolean(values.name.trim() && values.type.trim() && (kind === 'bond' || values.cashierId));
  const save = async () => { if (!valid) return; try { if (kind === 'bill') { const payload = { name: values.name.trim(), type: values.type.trim(), cashierId: values.cashierId }; if (item) await updateBill.mutateAsync({ id: item.id, data: payload }); else await createBill.mutateAsync(payload); } else { const payload = { name: values.name.trim(), type: values.type.trim() }; if (item) await updateBond.mutateAsync({ id: item.id, data: payload }); else await createBond.mutateAsync(payload); } showToast({ variant: 'success', description: t('saved_successfully') }); onClose(); } catch (error) { showToast({ variant: 'danger', description: getApiErrorMessage(error, t('operation_failed')) }); } };
  return <Modal open={open} setOpen={(next) => !next && onClose()} title={t(item ? 'edit' : 'add')} footer={<><SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton><PrimaryButton disabled={!valid} isSubmitting={createBill.isPending || updateBill.isPending || createBond.isPending || updateBond.isPending} onClick={save}>{t('save')}</PrimaryButton></>}><div className="space-y-4"><Input label={t('name')} required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} /><Input label={t('type')} required value={values.type} onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))} />{kind === 'bill' && <SelectInput label={t('cashier')} required options={cashierOptions} isLoading={users.isLoading} value={cashierOptions.find((option) => option.value === values.cashierId) ?? null} onChange={(option) => setValues((current) => ({ ...current, cashierId: (option as SelectOption | null)?.value ?? '' }))} />}</div></Modal>;
}
