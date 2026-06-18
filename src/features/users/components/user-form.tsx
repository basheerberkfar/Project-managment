import { useMemo } from 'react';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AsyncSelectInput from '@/components/ui/select/async-select';
import type { SelectOption } from '@/components/ui/select';
import FormInput from '@/components/ui/formInput';
import PhoneCountryInput from '@/components/common/phone-country-input';
import SectionCard from '@/components/ui/section-card';
import SelectInput from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import PasswordConfirmationFields from '@/components/common/password-input/password-confirmation-fields';
import type { UserFormValues } from '@/features/users/service';

type UserFormProps = {
  control: Control<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  setValue: UseFormSetValue<UserFormValues>;
  isEdit: boolean;
  fetchDepartments: (params: {
    page: number;
    search: string;
    limit: number;
  }) => Promise<{ data: SelectOption[]; hasMore: boolean }>;
  fetchJobTitles: (params: {
    page: number;
    search: string;
    limit: number;
  }) => Promise<{ data: SelectOption[]; hasMore: boolean }>;
  departmentOption?: SelectOption | null;
  jobTitleOption?: SelectOption | null;
  genderOption?: SelectOption | null;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
};

function getErrorMessage(message: unknown): string | undefined {
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  return undefined;
}

export default function UserForm({
  control,
  errors,
  setValue,
  isEdit,
  fetchDepartments,
  fetchJobTitles,
  departmentOption,
  jobTitleOption,
  genderOption,
  isActive,
  onActiveChange,
}: UserFormProps) {
  const { t } = useTranslation('usersRoles');
  const genderOptions = useMemo<SelectOption[]>(
    () => [
      { label: t('male'), value: 'Male' },
      { label: t('female'), value: 'Female' },
    ],
    [t]
  );

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title={t('user_information')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="name"
            control={control}
            label={t('name')}
            placeholder={t('enter_name')}
            required
            showErrorOnTouchedOnly={false}
          />
          <FormInput
            name="email"
            control={control}
            label={t('email')}
            placeholder={t('enter_email')}
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
          <SelectInput
            name="gender"
            control={control as never}
            label={t('gender')}
            placeholder={t('select_gender')}
            options={genderOptions}
            value={genderOption ?? undefined}
            error={getErrorMessage(errors.gender?.message)}
          />
          <AsyncSelectInput
            name="department"
            control={control as never}
            label={t('department')}
            placeholder={t('select_department')}
            fetchOptions={fetchDepartments}
            valueOption={departmentOption ?? undefined}
            error={getErrorMessage(errors.department?.message)}
          />
          <AsyncSelectInput
            name="jobTitle"
            control={control as never}
            label={t('job_title')}
            placeholder={t('select_job_title')}
            fetchOptions={fetchJobTitles}
            valueOption={jobTitleOption ?? undefined}
            error={getErrorMessage(errors.jobTitle?.message)}
          />
        </div>

        {!isEdit ? (
          <div className="mt-4">
            <PasswordConfirmationFields
              control={control}
              passwordName="password"
              confirmPasswordName="confirmPassword"
              passwordLabel={t('password')}
              confirmPasswordLabel={t('confirm_password')}
              passwordPlaceholder={t('enter_password')}
              confirmPasswordPlaceholder={t('confirm_password')}
              required
              showErrorOnTouchedOnly={false}
            />
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-light-500 dark:border-dark-card-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-light-900 dark:text-dark-primary">
              {t('status')}
            </p>
            <p className="text-xs text-gray-light-700 dark:text-gray-dark-500">
              {isActive ? t('active') : t('inactive')}
            </p>
          </div>
          <Toggle checked={isActive} onChange={onActiveChange} />
        </div>
      </SectionCard>
    </div>
  );
}
