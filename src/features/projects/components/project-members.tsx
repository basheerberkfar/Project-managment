import { Plus, Trash } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, type Column } from '@/components/common/table';
import TableText from '@/components/common/table-text';
import { PrimaryButton } from '@/components/ui/button';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useResourceListQuery,
  type ResourceRecord,
} from '@/features/management/service';
import { useUsersQuery } from '@/features/users/service';
import { getApiErrorMessage } from '@/utils/helpers';

export default function ProjectMembers({ projectId }: { projectId: string }) {
  const { t } = useTranslation('projects');
  const { showToast } = useToast();
  const [employeeId, setEmployeeId] = useState('');
  const members = useResourceListQuery('ProjectMembers', { ProjectId: projectId, Page: 1, PageSize: 100 });
  const users = useUsersQuery({ page: 1, pageSize: 100, IsActive: true });
  const create = useCreateResourceMutation('ProjectMembers');
  const remove = useDeleteResourceMutation('ProjectMembers');
  const memberIds = new Set((members.data?.items ?? []).map((member) => String(member.employeeId)));
  const options = (users.data?.items ?? []).filter((user) => !memberIds.has(user.id)).map((user) => ({ value: user.id, label: user.name }));
  const columns: Column<ResourceRecord>[] = [
    { id: 'employeeName', header: t('member_name'), render: (row) => <TableText text={String(row.employeeName ?? '-')} /> },
    { id: 'createdAt', header: t('member_added_at'), render: (row) => <TableText text={String(row.createdAt ?? '-')} /> },
  ];
  const add = async () => {
    if (!employeeId) return;
    try {
      await create.mutateAsync({ projectId, employeeId, addedBy: null });
      setEmployeeId('');
      showToast({ variant: 'success', description: t('member_added') });
    } catch (error) {
      showToast({ variant: 'danger', description: getApiErrorMessage(error, t('operation_failed')) });
    }
  };
  return <div className="space-y-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <SelectInput wrapperClassName="flex-1" label={t('select_member')} options={options} isLoading={users.isLoading} value={options.find((option) => option.value === employeeId) ?? null} onChange={(option) => setEmployeeId((option as SelectOption | null)?.value ?? '')} />
      <PrimaryButton disabled={!employeeId} isSubmitting={create.isPending} icon={<Plus size={16} />} onClick={add}>{t('add_member')}</PrimaryButton>
    </div>
    <Table columns={columns} data={members.data?.items ?? []} isLoading={members.isLoading} emptyMessage={t('no_members')} actionsColumn={{ header: t('actions'), actions: [{ id: 'delete', label: t('delete'), icon: <Trash size={16} />, variant: 'danger', onClick: async (row) => {
      try { await remove.mutateAsync(row.id); showToast({ variant: 'success', description: t('member_removed') }); }
      catch (error) { showToast({ variant: 'danger', description: getApiErrorMessage(error, t('operation_failed')) }); }
    } }] }} />
  </div>;
}
