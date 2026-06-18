import { Buildings } from '@phosphor-icons/react';
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
  useDepartmentQuery,
  type CreateDepartmentDto,
  type DepartmentFormValues,
  type UpdateDepartmentDto,
} from '@/services/departments';

type DepartmentFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  departmentId?: string | null;
  onCreate: (data: CreateDepartmentDto) => Promise<unknown>;
  onUpdate: (id: string, data: UpdateDepartmentDto) => Promise<unknown>;
  isSubmitting?: boolean;
};

export default function DepartmentFormModal({
  open,
  setOpen,
  departmentId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: DepartmentFormModalProps) {
  const { t } = useTranslation('usersRoles');
  const { showToast } = useToast();
  const { data: department } = useDepartmentQuery(departmentId ?? '');
  const isEdit = Boolean(departmentId);
  const { control, handleSubmit, reset, setError } =
    useForm<DepartmentFormValues>({
      defaultValues: {
        name: '',
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      name: department?.name ?? '',
    });
  }, [department?.name, open, reset]);

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      const payload: CreateDepartmentDto = {
        name: values.name.trim(),
      };
      const response = departmentId
        ? await onUpdate(departmentId, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('department_saved')),
      });
      setOpen(false);
      reset();
    } catch (error) {
      handleFormErrors<DepartmentFormValues>({
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
          title={t(isEdit ? 'edit_department' : 'add_department')}
          icon={<Buildings size={22} className="text-white" />}
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
        label={t('department_name')}
        placeholder={t('enter_department_name')}
        required
        showErrorOnTouchedOnly={false}
      />
    </Modal>
  );
}
