import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import DeleteModal from '@/components/common/delete-modal';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import SectionCard from '@/components/ui/section-card';
import RolePermissionsSection from '@/features/roles/components/role-permissions-section';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { RoleViewSkeleton } from '@/features/roles/components/role-view-skeleton';
import { useToast } from '@/components/ui/toast';
import {
  useDeleteRoleMutation,
  useRolePermissionsQuery,
  useRoleQuery,
} from '@/features/roles/service';
import {
  decodeRouteId,
  encodeRouteId,
  formatDate,
  getApiErrorMessage,
  getApiSuccessMessage,
} from '@/utils/helpers';
import { hasPermission } from '@/utils/permissions';
import { useState } from 'react';

export default function RoleViewPage() {
  const { t } = useTranslation('usersRoles');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const decodedId = decodeRouteId(routeId);

  const { data: role, isLoading } = useRoleQuery(decodedId);
  const { data: permissionsData, isLoading: isPermissionsLoading } =
    useRolePermissionsQuery(decodedId);
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation();
  const canEdit = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.update
  );
  const canDelete = hasPermission(
    PERMISSION_GROUPS.roles,
    PERMISSION_ACTIONS.delete
  );
  const canManageRole = !role?.isDefault;

  if (isLoading || isPermissionsLoading) {
    return <RoleViewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb
        sticky
        items={[
          { label: t('users_roles'), link: '/users-roles/roles' },
          { label: t('roles_list'), link: '/users-roles/roles' },
          { label: role?.name ?? t('role_details') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canDelete && canManageRole && (
              <SecondaryButton
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="h-10 w-10 px-0"
                title={t('delete')}
              >
                <Trash size={18} />
              </SecondaryButton>
            )}

            {canEdit && canManageRole && (
              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(`/users-roles/roles/${encodeRouteId(decodedId)}`)
                }
                className="h-10 w-10 px-0"
                title={t('edit')}
              >
                <PencilSimpleLine size={18} />
              </PrimaryButton>
            )}
          </div>
        }
      />

      <SectionCard title={t('role_information')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('role_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {role?.name ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('created_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(role?.createdAt)}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('updated_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(role?.updatedAt)}
            </p>
          </div>
        </div>
      </SectionCard>

      <RolePermissionsSection
        groups={permissionsData?.groups ?? []}
        selectedPermissions={permissionsData?.selectedIds ?? []}
        readOnly
      />

      <DeleteModal
        open={canDelete && canManageRole && isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('delete_role_title')}
        deleteMessage={t('delete_role_message', {
          name: role?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!decodedId) return;

          deleteRole(decodedId, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('role_deleted')),
              });
              setIsDeleteOpen(false);
              navigate('/users-roles/roles');
            },
            onError: (error) => {
              showToast({
                variant: 'danger',
                title: t('error'),
                description: getApiErrorMessage(error, t('operation_failed')),
              });
            },
          });
        }}
      />
    </div>
  );
}
