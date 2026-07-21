import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import FormPageContainer from '@/components/common/form-page-container';
import SectionCard from '@/components/ui/section-card';
import FormInput from '@/components/ui/formInput';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import { decodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { getBillSchema } from './schema';
import {
  useCreateBillMutation,
  useBillQuery,
  type CreateBillDto,
  type BillFormValues,
  type UpdateBillDto,
  useUpdateBillMutation,
} from '@/features/bills/service';

export default function BillFormPage() {
  const { t } = useTranslation('bills');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(routeId && routeId !== 'create');
  const decodedId = isEdit ? decodeRouteId(routeId) : '';
  const { data: bill, isLoading } = useBillQuery(decodedId);
  const { mutateAsync: createBill, isPending: isCreating } =
    useCreateBillMutation();
  const { mutateAsync: updateBill, isPending: isUpdating } =
    useUpdateBillMutation();
  const schema = useMemo(() => getBillSchema(), []);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty, isValid },
  } = useForm<BillFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      relatedToProject: false,
      billTypeId: '',
      projectId: '',
      clientId: '',
      total: '',
      paidAmount: '',
    },
  });

  useEffect(() => {
    if (!bill) return;

    reset({
      relatedToProject: bill.relatedToProject ?? false,
      billTypeId: bill.billTypeId ?? '',
      projectId: bill.projectId ?? '',
      clientId: bill.clientId ?? '',
      total: bill.total != null ? String(bill.total) : '',
      paidAmount: bill.paidAmount != null ? String(bill.paidAmount) : '',
    });
  }, [reset, bill]);

  const onSubmit = async (values: BillFormValues) => {
    const payload: CreateBillDto = {
      relatedToProject: values.relatedToProject,
      billTypeId: values.billTypeId.trim() || null,
      projectId: values.projectId.trim() || null,
      clientId: values.clientId.trim() || null,
      total: values.total ? Number(values.total) : null,
      paidAmount: values.paidAmount ? Number(values.paidAmount) : null,
    };

    try {
      let response;

      if (isEdit && decodedId) {
        response = await updateBill({
          id: decodedId,
          data: payload as UpdateBillDto,
        });
      } else {
        response = await createBill(payload);
      }

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('bill_saved')),
      });
      navigate('/bills');
    } catch (error: unknown) {
      handleFormErrors<BillFormValues>({
        error,
        setError,
        fieldMap: {
          relatedToProject: 'relatedToProject',
          billTypeId: 'billTypeId',
          projectId: 'projectId',
          clientId: 'clientId',
          total: 'total',
          paidAmount: 'paidAmount',
        },
        toast: (message) =>
          showToast({
            variant: 'danger',
            title: t('error'),
            description: message,
          }),
        fallbackMessage: t('operation_failed'),
      });
    }
  };

  if (isEdit && isLoading) {
    return null;
  }

  const canSubmit = isValid && isDirty;

  return (
    <FormPageContainer onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between pb-4">
        <div />
        <div className="flex items-center gap-2">
          <SecondaryButton
            type="button"
            onClick={() => navigate('/bills')}
          >
            {t('common:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!canSubmit || isCreating || isUpdating}
          >
            {t('common:save')}
          </PrimaryButton>
        </div>
      </div>

      <SectionCard title={t('bill_information')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="relatedToProject"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-3 pt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  className="h-4 w-4 rounded border-gray-light-500"
                />
                <span className="text-sm text-gray-light-700 dark:text-gray-dark-500">
                  {t('related_to_project')}
                </span>
              </label>
            )}
          />
          <FormInput
            name="billTypeId"
            control={control}
            label={t('bill_type_id')}
            placeholder={t('enter_bill_type_id')}
            required
            showErrorOnTouchedOnly={false}
          />
          <FormInput
            name="projectId"
            control={control}
            label={t('project_id')}
            placeholder={t('enter_project_id')}
          />
          <FormInput
            name="clientId"
            control={control}
            label={t('client_id')}
            placeholder={t('enter_client_id')}
          />
          <FormInput
            name="total"
            control={control}
            label={t('total')}
            placeholder={t('enter_total')}
            type="number"
            required
            showErrorOnTouchedOnly={false}
          />
          <FormInput
            name="paidAmount"
            control={control}
            label={t('paid_amount')}
            placeholder={t('enter_paid_amount')}
            type="number"
            required
            showErrorOnTouchedOnly={false}
          />
        </div>
      </SectionCard>
    </FormPageContainer>
  );
}
