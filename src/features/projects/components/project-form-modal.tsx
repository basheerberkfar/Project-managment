import { Briefcase } from '@phosphor-icons/react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ModalTitle from '@/components/common/modal-title';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Modal from '@/components/ui/dialog';
import FormInput from '@/components/ui/formInput';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage } from '@/utils/helpers';
import {
  useProjectQuery,
  type CreateProjectDto,
  type ProjectFormValues,
  type UpdateProjectDto,
} from '@/services/projects';

type ProjectFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId?: string | null;
  onCreate: (data: CreateProjectDto) => Promise<unknown>;
  onUpdate: (id: string, data: UpdateProjectDto) => Promise<unknown>;
  isSubmitting?: boolean;
};

export default function ProjectFormModal({
  open,
  setOpen,
  projectId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: ProjectFormModalProps) {
  const { t } = useTranslation('projects');
  const { showToast } = useToast();
  const { data: project } = useProjectQuery(projectId ?? '');
  const isEdit = Boolean(projectId);
  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().trim().required(t('common:field_required')),
        receiptDate: yup.string().trim().required(t('common:field_required')),
        deliveryDate: yup.string().trim().required(t('common:field_required')),
        startDate: yup.string().trim().required(t('common:field_required')),
        description: yup.string().trim().required(t('common:field_required')),
        totalAmount: yup.string().trim().required(t('common:field_required')),
        paidAmount: yup.string().trim().required(t('common:field_required')),
        status: yup.string().trim().required(t('common:field_required')),
        priority: yup.string().trim().required(t('common:field_required')),
        clientId: yup.string().trim().required(t('common:field_required')),
      }) as yup.ObjectSchema<ProjectFormValues>,
    [t]
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      receiptDate: '',
      deliveryDate: '',
      startDate: '',
      description: '',
      totalAmount: '',
      paidAmount: '',
      status: '',
      priority: '',
      clientId: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      name: project?.name ?? '',
      receiptDate: project?.receiptDate ?? '',
      deliveryDate: project?.deliveryDate ?? '',
      startDate: project?.startDate ?? '',
      description: project?.description ?? '',
      totalAmount: String(project?.totalAmount ?? ''),
      paidAmount: String(project?.paidAmount ?? ''),
      status: project?.status ?? '',
      priority: project?.priority ?? '',
      clientId: project?.clientId ?? '',
    });
  }, [open, project, reset]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload: CreateProjectDto = {
        name: values.name.trim() || null,
        receiptDate: values.receiptDate || null,
        deliveryDate: values.deliveryDate || null,
        startDate: values.startDate || null,
        description: values.description.trim() || null,
        totalAmount: Number(values.totalAmount),
        paidAmount: Number(values.paidAmount),
        status: values.status,
        priority: values.priority,
        clientId: values.clientId.trim(),
      };

      const response = projectId
        ? await onUpdate(projectId, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('project_saved')),
      });
      setOpen(false);
      reset();
    } catch (error) {
      handleFormErrors<ProjectFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
          receiptDate: 'receiptDate',
          deliveryDate: 'deliveryDate',
          startDate: 'startDate',
          description: 'description',
          totalAmount: 'totalAmount',
          paidAmount: 'paidAmount',
          status: 'status',
          priority: 'priority',
          clientId: 'clientId',
        },
        toast: (message) =>
          showToast({
            variant: 'danger',
            title: t('common:error'),
            description: message,
          }),
        fallbackMessage: t('operation_failed'),
      });
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t(isEdit ? 'edit_project' : 'add_project')}
          icon={<Briefcase size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[760px] max-w-[94vw]"
      footer={
        <>
          <SecondaryButton onClick={() => setOpen(false)}>
            {t('common:cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {t('common:save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="name"
          control={control}
          label={t('project_name')}
          placeholder={t('enter_project_name')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.name?.message}
        />
        <FormInput
          name="clientId"
          control={control}
          label={t('client_id')}
          placeholder={t('enter_client_id')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.clientId?.message}
        />
        <FormInput
          name="receiptDate"
          control={control}
          type="date"
          label={t('receipt_date')}
          placeholder={t('select_receipt_date')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.receiptDate?.message}
        />
        <FormInput
          name="deliveryDate"
          control={control}
          type="date"
          label={t('delivery_date')}
          placeholder={t('select_delivery_date')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.deliveryDate?.message}
        />
        <FormInput
          name="startDate"
          control={control}
          type="date"
          label={t('start_date')}
          placeholder={t('select_start_date')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.startDate?.message}
        />
        <FormInput
          name="status"
          control={control}
          label={t('status')}
          placeholder={t('enter_status')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.status?.message}
        />
        <FormInput
          name="priority"
          control={control}
          label={t('priority')}
          placeholder={t('enter_priority')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.priority?.message}
        />
        <FormInput
          name="totalAmount"
          control={control}
          type="number"
          label={t('total_amount')}
          placeholder={t('enter_total_amount')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.totalAmount?.message}
        />
        <FormInput
          name="paidAmount"
          control={control}
          type="number"
          label={t('paid_amount')}
          placeholder={t('enter_paid_amount')}
          required
          showErrorOnTouchedOnly={false}
          error={errors.paidAmount?.message}
        />
        <div className="md:col-span-2">
          <Textarea
            name="description"
            control={control}
            label={t('description')}
            placeholder={t('enter_description')}
            required
            error={errors.description?.message}
          />
        </div>
      </div>
    </Modal>
  );
}
