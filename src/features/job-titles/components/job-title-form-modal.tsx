import { IdentificationCard } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/dialog';
import ModalTitle from '@/components/common/modal-title';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import FormInput from '@/components/ui/formInput';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage } from '@/utils/helpers';
import {
  useJobTitleQuery,
  type CreateJobTitleDto,
  type JobTitleFormValues,
  type UpdateJobTitleDto,
} from '@/services/job-titles';

type JobTitleFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobTitleId?: string | null;
  onCreate: (data: CreateJobTitleDto) => Promise<unknown>;
  onUpdate: (id: string, data: UpdateJobTitleDto) => Promise<unknown>;
  isSubmitting?: boolean;
};

export default function JobTitleFormModal({
  open,
  setOpen,
  jobTitleId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: JobTitleFormModalProps) {
  const { t } = useTranslation('usersRoles');
  const { showToast } = useToast();
  const { data: jobTitle } = useJobTitleQuery(jobTitleId ?? '');
  const isEdit = Boolean(jobTitleId);
  const { control, handleSubmit, reset, setError } =
    useForm<JobTitleFormValues>({
      defaultValues: {
        name: '',
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      name: jobTitle?.name ?? '',
    });
  }, [jobTitle?.name, open, reset]);

  const onSubmit = async (values: JobTitleFormValues) => {
    try {
      const payload: CreateJobTitleDto = {
        name: values.name.trim(),
      };
      const response = jobTitleId
        ? await onUpdate(jobTitleId, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('job_title_saved')),
      });
      setOpen(false);
      reset();
    } catch (error) {
      handleFormErrors<JobTitleFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
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
          title={t(isEdit ? 'edit_job_title' : 'add_job_title')}
          icon={<IdentificationCard size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[640px] max-w-[94vw]"
      footer={
        <>
          <SecondaryButton onClick={() => setOpen(false)}>
            {t('common:cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
          >
            {t('common:save')}
          </PrimaryButton>
        </>
      }
    >
      <FormInput
        name="name"
        control={control}
        label={t('job_title_name')}
        placeholder={t('enter_job_title_name')}
        required
        showErrorOnTouchedOnly={false}
      />
    </Modal>
  );
}
