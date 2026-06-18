import { Lock } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/dialog';
import ModalTitle from '@/components/common/modal-title';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import PasswordConfirmationFields from '@/components/common/password-input/password-confirmation-fields';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage } from '@/utils/helpers';
import {
  useChangeUserPasswordMutation,
  type ChangePasswordFormValues,
} from '@/features/users/service';

type ChangePasswordModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId?: string | null;
};

export default function ChangePasswordModal({
  open,
  setOpen,
  userId,
}: ChangePasswordModalProps) {
  const { t } = useTranslation('usersRoles');
  const { showToast } = useToast();
  const schema = useMemo(
    () =>
      yup.object({
        password: yup
          .string()
          .trim()
          .min(6, t('password_min'))
          .required(t('password_required')),
        confirmPassword: yup
          .string()
          .trim()
          .required(t('password_confirm_required'))
          .oneOf([yup.ref('password')], t('passwords_must_match')),
      }),
    [t]
  );
  const { control, handleSubmit, reset, setError } =
    useForm<ChangePasswordFormValues>({
      resolver: yupResolver(schema),
      mode: 'onChange',
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
    });
  const { mutateAsync: changePassword, isPending } =
    useChangeUserPasswordMutation();

  const onSubmit = async (values: ChangePasswordFormValues) => {
    if (!userId) return;

    try {
      const response = await changePassword({
        id: userId,
        data: {
          password: values.password,
          NewPassword: values.confirmPassword,
        },
      });

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('password_changed')),
      });
      setOpen(false);
      reset();
    } catch (error) {
      handleFormErrors<ChangePasswordFormValues>({
        error,
        setError,
        fieldMap: {
          password: 'password',
          confirmPassword: 'confirmPassword',
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
      preventAutoFocus
      title={
        <ModalTitle
          title={t('change_password_title')}
          icon={<Lock size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[640px] max-w-[94vw]"
      footer={
        <>
          <SecondaryButton onClick={() => setOpen(false)} disabled={isPending}>
            {t('common:cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            isSubmitting={isPending}
            disabled={isPending}
            IconSize={14}
          >
            {t('change_password')}
          </PrimaryButton>
        </>
      }
    >
      <input
        type="text"
        autoComplete="username"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
      <PasswordConfirmationFields
        control={control}
        passwordName="password"
        confirmPasswordName="confirmPassword"
        passwordLabel={t('new_password')}
        confirmPasswordLabel={t('new_password_confirmation')}
        passwordAutoComplete="new-password"
        confirmPasswordAutoComplete="new-password"
        required
        showErrorOnTouchedOnly={false}
        className="grid grid-cols-1 gap-4"
      />
    </Modal>
  );
}
