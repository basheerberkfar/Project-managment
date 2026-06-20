import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import FormPageContainer from '@/components/common/form-page-container';
import SectionCard from '@/components/ui/section-card';
import FormInput from '@/components/ui/formInput';
import { useToast } from '@/components/ui/toast';
import { handleFormErrors } from '@/utils/form-errors';
import RolePageActions from '@/features/roles/components/role-page-actions';
import RolePermissionsSection from '@/features/roles/components/role-permissions-section';
import { RoleFormSkeleton } from '@/features/roles/components/role-form-skeleton';
import { decodeRouteId, getApiSuccessMessage } from '@/utils/helpers';
import { getRoleSchema } from './schema';
import {
  normalizeRolePermissionIds,
  useCreateRoleMutation,
  useRolePermissionsQuery,
  useRoleQuery,
  useUpdateRoleMutation,
  type CreateRoleDto,
  type RoleFormValues,
  type UpdateRoleDto,
} from '@/features/roles/service';

export default function RoleFormPage() {
  const { t } = useTranslation('usersRoles');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEdit = Boolean(routeId && routeId !== 'create');
  const decodedId = isEdit ? decodeRouteId(routeId) : '';
  const { data: role, isLoading } = useRoleQuery(decodedId);
  const { data: permissionsData, isLoading: isPermissionsLoading } =
    useRolePermissionsQuery();
  const { mutateAsync: createRole, isPending: isCreating } =
    useCreateRoleMutation();
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useUpdateRoleMutation();
  const schema = useMemo(() => getRoleSchema(t), [t]);
  const [selectedPermissionsState, setSelectedPermissionsState] = useState<
    string[]
  >([]);
  const [permissionsTouched, setPermissionsTouched] = useState(false);
  const selectedPermissions = permissionsTouched
    ? selectedPermissionsState
    : normalizeRolePermissionIds(role?.permissions ?? role?.permission);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty, isValid },
  } = useForm<RoleFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      guardName: '',
    },
  });

  useEffect(() => {
    if (!role) return;

    reset({
      name: role.name ?? '',
      guardName: role.guardName ?? '',
    });
  }, [reset, role]);

  const onSubmit = async (values: RoleFormValues) => {
    const payload: CreateRoleDto = {
      name: values.name.trim(),
      PermissionIds: selectedPermissions,
    };

    try {
      let response;

      if (isEdit && decodedId) {
        response = await updateRole({
          id: decodedId,
          data: payload as UpdateRoleDto,
        });
      } else {
        response = await createRole(payload);
      }

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(response, t('role_saved')),
      });
      navigate('/users-roles/roles');
    } catch (error: unknown) {
      handleFormErrors<RoleFormValues>({
        error,
        setError,
        fieldMap: {
          name: 'name',
          guardName: 'guardName',
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

  if ((isEdit && isLoading) || isPermissionsLoading) {
    return <RoleFormSkeleton />;
  }

  const canSubmit =
    isEdit
      ? isValid && (isDirty || permissionsTouched)
      : isValid && (isDirty || permissionsTouched);

  return (
    <FormPageContainer onSubmit={handleSubmit(onSubmit)}>
      <RolePageActions
        isEdit={isEdit}
        onCancel={() => navigate('/users-roles/roles')}
        onSubmit={handleSubmit(onSubmit)}
        saveDisabled={!canSubmit || isCreating || isUpdating}
      />

      <>
        <SectionCard title={t('role_information')}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              name="name"
              control={control}
              label={t('role_name')}
              placeholder={t('enter_role_name')}
              rules={{ required: t('role_name_required') }}
              required
            />
          </div>
        </SectionCard>

        <RolePermissionsSection
          groups={permissionsData?.groups ?? []}
          selectedPermissions={selectedPermissions}
          onChange={(permissionIds) => {
            setSelectedPermissionsState(permissionIds);
            setPermissionsTouched(true);
          }}
        />
      </>
    </FormPageContainer>
  );
}
