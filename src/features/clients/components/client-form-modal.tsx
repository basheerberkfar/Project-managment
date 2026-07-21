import { User } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PhoneCountryInput from '@/components/common/phone-country-input';
import ModalTitle from '@/components/common/modal-title';
import Modal from '@/components/ui/dialog';
import FormInput from '@/components/ui/formInput';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage } from '@/utils/helpers';
import {
  useClientQuery,
  type ClientFormValues,
  type CreateClientDto,
  type UpdateClientDto,
} from '@/services/clients';

type ClientFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId?: string | null;
  onCreate: (data: CreateClientDto) => Promise<unknown>;
  onUpdate: (id: string, data: UpdateClientDto) => Promise<unknown>;
  isSubmitting?: boolean;
};

export default function ClientFormModal({
  open,
  setOpen,
  clientId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: ClientFormModalProps) {
  const { t } = useTranslation('clients');
  const { showToast } = useToast();
  const { data: client } = useClientQuery(clientId ?? '');
  const isEdit = Boolean(clientId);
  const { control, handleSubmit, reset, setError, setValue } =
    useForm<ClientFormValues>({
      defaultValues: {
        name: '',
        phoneNumber: '',
        countryCode: '',
        address: '',
        birthday: '',
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      name: client?.name ?? '',
      phoneNumber: client?.phoneNumber ?? '',
      countryCode: client?.countryCode ?? '',
      address: client?.address ?? '',
      birthday: client?.birthday ?? '',
    });
  }, [
    client?.address,
    client?.birthday,
    client?.countryCode,
    client?.name,
    client?.phoneNumber,
    open,
    reset,
  ]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      const payload: CreateClientDto = {
        name: values.name.trim(),
        phoneNumber: values.phoneNumber.trim(),
        countryCode: values.countryCode.trim(),
        address: values.address.trim(),
        birthday: values.birthday,
      };
      const response = clientId
        ? await onUpdate(clientId, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('client_saved')),
      });
      setOpen(false);
      reset();
    } catch (error) {
      handleFormErrors<ClientFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
          phoneNumber: 'phoneNumber',
          countryCode: 'countryCode',
          address: 'address',
          birthday: 'birthday',
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
          title={t(isEdit ? 'edit_client' : 'add_client')}
          icon={<User size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[720px] max-w-[94vw]"
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="name"
          control={control}
          label={t('client_name')}
          placeholder={t('enter_client_name')}
          required
          showErrorOnTouchedOnly={false}
        />
        <FormInput
          name="address"
          control={control}
          label={t('address')}
          placeholder={t('enter_address')}
          required
          showErrorOnTouchedOnly={false}
        />
        <PhoneCountryInput
          control={control}
          setValue={setValue}
          codeName="countryCode"
          phoneName="phoneNumber"
          label={t('phone_number')}
          codeLabel={t('country_code')}
          phoneLabel={t('phone_number')}
          searchPlaceholder={t('search_country')}
          phonePlaceholder={t('enter_phone_number')}
          required
          showErrorOnTouchedOnly={false}
        />
        <FormInput
          name="birthday"
          control={control}
          type="date"
          label={t('birthday')}
          placeholder={t('select_birthday')}
          required
          showErrorOnTouchedOnly={false}
        />
      </div>
    </Modal>
  );
}
