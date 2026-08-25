import { FloppyDisk } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import BreadCrumb from '@/components/common/breadCrumb';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/toast';
import { useClientsQuery } from '@/services/clients';
import { getApiErrorMessage } from '@/utils/helpers';
import { useProjectsQuery } from '@/features/projects/service';
import {
  useBillQuery,
  useBillTypesQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  type BillPayload,
} from '../service';

type BillRouteState = {
  projectId?: string;
  clientId?: string;
  disableProjectAndClient?: boolean;
};

export default function BillFormPage() {
  const { t } = useTranslation('finance');
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const id = params.get('id') ?? '';
  const state = (location.state ?? {}) as BillRouteState;
  const { showToast } = useToast();
  const billQuery = useBillQuery(id);
  const typesQuery = useBillTypesQuery({ Page: 1, PageSize: 100 });
  const projectsQuery = useProjectsQuery({ Page: 1, PageSize: 100 });
  const clientsQuery = useClientsQuery({ page: 1, pageSize: 100 });
  const createBill = useCreateBillMutation();
  const updateBill = useUpdateBillMutation();
  const [values, setValues] = useState({
    no: '',
    barcode: '',
    relatedToProject: Boolean(state.projectId),
    billTypeId: '',
    projectId: state.projectId ?? '',
    clientId: state.clientId ?? '',
    total: '',
    paidAmount: '',
  });

  useEffect(() => {
    if (!billQuery.data) return;
    // API detail hydrates the edit form after the route has mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues({
      no: billQuery.data.no ?? '',
      barcode: billQuery.data.barcode ?? '',
      relatedToProject: billQuery.data.relatedToProject,
      billTypeId: billQuery.data.billTypeId,
      projectId: billQuery.data.projectId ?? '',
      clientId: billQuery.data.clientId ?? '',
      total: String(billQuery.data.total),
      paidAmount: String(billQuery.data.paidAmount),
    });
  }, [billQuery.data]);

  const typeOptions = useMemo(
    () =>
      (typesQuery.data?.items ?? []).map((item) => ({
        label: item.name ?? '-',
        value: item.id,
      })),
    [typesQuery.data?.items]
  );
  const projectOptions = useMemo(
    () =>
      (projectsQuery.data?.items ?? []).map((item) => ({
        label: item.name ?? '-',
        value: item.id,
      })),
    [projectsQuery.data?.items]
  );
  const clientOptions = useMemo(
    () =>
      (clientsQuery.data?.items ?? []).map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [clientsQuery.data?.items]
  );
  const valid = Boolean(
    values.billTypeId &&
    values.total !== '' &&
    Number(values.total) >= 0 &&
    values.paidAmount !== '' &&
    Number(values.paidAmount) >= 0 &&
    Number(values.paidAmount) <= Number(values.total) &&
    (values.relatedToProject ? values.projectId : values.clientId)
  );
  const close = () =>
    state.projectId
      ? navigate(`/projects/${state.projectId}`, { replace: true })
      : navigate('/bills');

  const save = async () => {
    if (!valid) return;
    const selectedProject = projectsQuery.data?.items.find(
      (project) => project.id === values.projectId
    );
    const payload: BillPayload = {
      no: values.no || null,
      barcode: values.barcode || null,
      relatedToProject: values.relatedToProject,
      billTypeId: values.billTypeId,
      projectId: values.relatedToProject ? values.projectId : null,
      clientId: values.relatedToProject
        ? (selectedProject?.clientId ?? values.clientId) || null
        : values.clientId,
      total: Number(values.total),
      paidAmount: Number(values.paidAmount),
    };
    try {
      if (id) await updateBill.mutateAsync({ id, data: payload });
      else await createBill.mutateAsync(payload);
      showToast({ variant: 'success', description: t('saved_successfully') });
      close();
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
      className="h-full overflow-y-auto"
    >
      <div className="w-full space-y-5">
        <BreadCrumb
          items={[
            {
              label: t('bills'),
              link: state.projectId ? `/projects/${state.projectId}` : '/bills',
            },
            { label: t(id ? 'edit_bill' : 'add_bill') },
          ]}
        />
        <section className="rounded-2 border border-light-card-border bg-white p-5 dark:border-dark-card-border dark:bg-dark-card-background">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('number')}
              value={values.no}
              onChange={(event) =>
                setValues((current) => ({ ...current, no: event.target.value }))
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
            <SelectInput
              label={t('type')}
              required
              options={typeOptions}
              isLoading={typesQuery.isLoading}
              value={
                typeOptions.find(
                  (option) => option.value === values.billTypeId
                ) ?? null
              }
              onChange={(option) =>
                setValues((current) => ({
                  ...current,
                  billTypeId: (option as SelectOption | null)?.value ?? '',
                }))
              }
            />
            <div className="flex min-h-[52px] items-center justify-between rounded-lg border border-gray-light-500 px-4 dark:border-dark-card-border">
              <span className="text-sm">{t('related_to_project')}</span>
              <Toggle
                checked={values.relatedToProject}
                disabled={state.disableProjectAndClient}
                onChange={(relatedToProject) =>
                  setValues((current) => ({
                    ...current,
                    relatedToProject,
                    projectId: relatedToProject ? current.projectId : '',
                    clientId: relatedToProject ? '' : current.clientId,
                  }))
                }
              />
            </div>
            {values.relatedToProject ? (
              <SelectInput
                label={t('project')}
                required
                isDisabled={state.disableProjectAndClient}
                options={projectOptions}
                isLoading={projectsQuery.isLoading}
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
            ) : (
              <SelectInput
                label={t('customer')}
                required
                options={clientOptions}
                isLoading={clientsQuery.isLoading}
                value={
                  clientOptions.find(
                    (option) => option.value === values.clientId
                  ) ?? null
                }
                onChange={(option) =>
                  setValues((current) => ({
                    ...current,
                    clientId: (option as SelectOption | null)?.value ?? '',
                  }))
                }
              />
            )}
            <Input
              label={t('amount')}
              required
              type="number"
              value={values.total}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  total: event.target.value,
                  paidAmount:
                    Number(current.paidAmount) > Number(event.target.value)
                      ? event.target.value
                      : current.paidAmount,
                }))
              }
            />
            <Input
              label={t('paid')}
              required
              type="number"
              value={values.paidAmount}
              error={
                Number(values.paidAmount) > Number(values.total)
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
            <div className="rounded-2 bg-gray-light-100 p-4 dark:bg-dark-card-surface">
              <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
                {t('remaining')}
              </p>
              <p className="mt-1 font-semibold">
                {Math.max(
                  Number(values.total || 0) - Number(values.paidAmount || 0),
                  0
                )}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={close}>{t('cancel')}</SecondaryButton>
            <PrimaryButton
              disabled={!valid}
              isSubmitting={createBill.isPending || updateBill.isPending}
              icon={<FloppyDisk size={16} />}
              onClick={save}
            >
              {t('save')}
            </PrimaryButton>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
