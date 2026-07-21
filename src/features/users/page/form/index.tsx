import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import FormPageContainer from '@/components/common/form-page-container';
import PagesHeader from '@/components/common/pages-header';
import { useToast } from '@/components/ui/toast';
import type { SelectOption } from '@/components/ui/select';
import { useDepartments } from '@/hooks/use-departments';
import { useJobTitles } from '@/hooks/use-job-titles';
import { handleFormErrors } from '@/utils/form-errors';
import { decodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import UserForm from '@/features/users/components/user-form';
import { UserFormSkeleton } from '@/features/users/components/user-form-skeleton';
import { getUserSchema } from './schema';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUserQuery,
  type CreateUserDto,
  type UpdateUserDto,
  type UserFormValues,
} from '@/features/users/service';

export default function UserFormPage() {
  const { t } = useTranslation('usersRoles');
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const { showToast } = useToast();
  const { fetchDepartments, useDepartmentOption } = useDepartments();
  const { fetchJobTitles, useJobTitleOption } = useJobTitles();
  const isEdit = Boolean(routeId && routeId !== 'create');
  const decodedId = isEdit ? decodeRouteId(routeId) : '';
  const { data: user, isLoading: isUserLoading } = useUserQuery(decodedId);
  const {
    data: fetchedDepartmentOption,
    isLoading: isDepartmentOptionLoading,
  } = useDepartmentOption(
    user?.departmentId ?? user?.department?.id ?? null
  );
  const {
    data: fetchedJobTitleOption,
    isLoading: isJobTitleOptionLoading,
  } = useJobTitleOption(
    user?.jobTitleId ?? user?.jobTitle?.id ?? null
  );
  const departmentOption = useMemo<SelectOption | null>(
    () =>
      fetchedDepartmentOption ??
      (user?.departmentId || user?.departmentName
        ? {
            value: user?.departmentId ?? '',
            label: user?.department?.name ?? user?.departmentName ?? '',
          }
        : null),
    [
      fetchedDepartmentOption,
      user?.department?.name,
      user?.departmentId,
      user?.departmentName,
    ]
  );
  const jobTitleOption = useMemo<SelectOption | null>(
    () =>
      fetchedJobTitleOption ??
      (user?.jobTitleId || user?.jobTitleName
        ? {
            value: user?.jobTitleId ?? '',
            label: user?.jobTitle?.name ?? user?.jobTitleName ?? '',
          }
        : null),
    [
      fetchedJobTitleOption,
      user?.jobTitle?.name,
      user?.jobTitleId,
      user?.jobTitleName,
    ]
  );
  const schema = useMemo(() => getUserSchema(t, isEdit), [isEdit, t]);
  const { mutateAsync: createUser, isPending: isCreating } =
    useCreateUserMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      countryCode: '',
      gender: null,
      department: null,
      jobTitle: null,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      confirmPassword: '',
      phoneNumber: user.phoneNumber ?? '',
      countryCode: user.countryCode ?? '',
      gender: user.gender
        ? {
            label: t(user.gender === 'Male' ? 'male' : 'female'),
            value: user.gender,
          }
        : null,
      department: departmentOption ?? null,
      jobTitle: jobTitleOption ?? null,
      isActive: Boolean(user.isActive),
    });
  }, [departmentOption, jobTitleOption, reset, t, user]);

  const genderOption = useWatch({ control, name: 'gender' });
  const selectedDepartment = useWatch({ control, name: 'department' });
  const selectedJobTitle = useWatch({ control, name: 'jobTitle' });
  const isActive = useWatch({ control, name: 'isActive' });
  const isPageLoading =
    isEdit &&
    (isUserLoading ||
      (Boolean(user?.departmentId) && isDepartmentOptionLoading) ||
      (Boolean(user?.jobTitleId) && isJobTitleOptionLoading));

  const onSubmit = async (values: UserFormValues) => {
    try {
      let response;

      if (isEdit && decodedId) {
        const payload: UpdateUserDto = {
          name: values.name.trim(),
          email: values.email.trim(),
          phoneNumber: values.phoneNumber.trim(),
          countryCode: values.countryCode.trim(),
          gender: values.gender?.value as 'Male' | 'Female',
          departmentId: values.department?.value ?? '',
          jobTitleId: values.jobTitle?.value ?? '',
          isActive: values.isActive,
        };

        response = await updateUser({
          id: decodedId,
          data: payload,
        });
      } else {
        const payload: CreateUserDto = {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          phoneNumber: values.phoneNumber.trim(),
          countryCode: values.countryCode.trim(),
          gender: values.gender?.value as 'Male' | 'Female',
          departmentId: values.department?.value ?? '',
          jobTitleId: values.jobTitle?.value ?? '',
          isActive: values.isActive,
        };

        response = await createUser(payload);
      }

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('user_saved')),
      });
      navigate('/users-roles/users');
    } catch (error) {
      handleFormErrors<UserFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
          email: 'email',
          phoneNumber: 'phoneNumber',
          countryCode: 'countryCode',
          gender: 'gender',
          departmentId: 'department',
          jobTitleId: 'jobTitle',
          password: 'password',
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

  if (isPageLoading) {
    return <UserFormSkeleton />;
  }

  return (
    <FormPageContainer onSubmit={handleSubmit(onSubmit)}>
      <BreadCrumb
        sticky
        items={[
          { label: t('users_management'), link: '/users-roles/users' },
          { label: t('users_list'), link: '/users-roles/users' },
          { label: isEdit ? t('edit_user') : t('add_user') },
        ]}
        actions={
          <PagesHeader
            secondaryText={t('common:cancel')}
            onSecondaryClick={() => navigate('/users-roles/users')}
            btnText={t('common:save')}
            onClick={handleSubmit(onSubmit)}
            primaryButtonType="submit"
            primaryDisabled={!isDirty || isCreating || isUpdating}
            btnLoading={isCreating || isUpdating}
          />
        }
      />

      <UserForm
        control={control}
        errors={errors}
        setValue={setValue}
        isEdit={isEdit}
        fetchDepartments={fetchDepartments}
        fetchJobTitles={fetchJobTitles}
        departmentOption={selectedDepartment}
        jobTitleOption={selectedJobTitle}
        genderOption={genderOption}
        isActive={Boolean(isActive)}
        onActiveChange={(value) =>
          setValue('isActive', value, { shouldDirty: true })
        }
      />
    </FormPageContainer>
  );
}
