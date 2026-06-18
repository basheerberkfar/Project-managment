import { Key, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import DeleteModal from '@/components/common/delete-modal';
import SectionCard from '@/components/ui/section-card';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { hasPermission } from '@/utils/permissions';
import {
  decodeRouteId,
  encodeRouteId,
  getApiErrorMessage,
  getApiSuccessMessage,
} from '@/utils/helpers';
import ChangePasswordModal from '@/features/users/components/change-password-modal';
import UserStatusBadge from '@/features/users/components/user-status-badge';
import { UserViewSkeleton } from '@/features/users/components/user-view-skeleton';
import { useDeleteUserMutation, useUserQuery } from '@/features/users/service';

export default function UserViewPage() {
  const { t } = useTranslation('usersRoles');
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const { showToast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const decodedId = decodeRouteId(routeId);
  const { data: user, isLoading } = useUserQuery(decodedId);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation();
  const canEdit = hasPermission(
    PERMISSION_GROUPS.users,
    PERMISSION_ACTIONS.update
  );
  const canDelete = hasPermission(
    PERMISSION_GROUPS.users,
    PERMISSION_ACTIONS.delete
  );
  const canChangePassword = hasPermission(
    PERMISSION_GROUPS.users,
    PERMISSION_ACTIONS.change_password
  );
  const canManageUser = !user?.isDefault;

  if (isLoading) {
    return <UserViewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb
        sticky
        items={[
          { label: t('users_management'), link: '/users-roles/users' },
          { label: t('users_list'), link: '/users-roles/users' },
          { label: user?.name ?? t('user_details') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canChangePassword && canManageUser ? (
              <SecondaryButton
                type="button"
                onClick={() => setIsPasswordOpen(true)}
                className="h-10 w-10 px-0"
                title={t('change_password')}
              >
                <Key size={18} />
              </SecondaryButton>
            ) : null}
            {canDelete && canManageUser ? (
              <SecondaryButton
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="h-10 w-10 px-0"
                title={t('common:delete')}
              >
                <Trash size={18} />
              </SecondaryButton>
            ) : null}
            {canEdit && canManageUser ? (
              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(`/users-roles/users/${encodeRouteId(decodedId)}`)
                }
                className="h-10 w-10 px-0"
                title={t('common:edit')}
              >
                <PencilSimpleLine size={18} />
              </PrimaryButton>
            ) : null}
          </div>
        }
      />

      <SectionCard title={t('user_information')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.name ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('email')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.email ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('phone_number')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.phoneNumber ? (
                <span dir="ltr" className="inline-flex items-center gap-1">
                  {user.countryCode ? <span>{user.countryCode}</span> : null}
                  <span>{user.phoneNumber}</span>
                </span>
              ) : (
                '-'
              )}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('gender')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.gender
                ? t(user.gender === 'Male' ? 'male' : 'female')
                : '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('department')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.department?.name ?? user?.departmentName ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('job_title')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {user?.jobTitle?.name ?? user?.jobTitleName ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('status')}
            </p>
            <UserStatusBadge isActive={user?.isActive} />
          </div>
        </div>
      </SectionCard>

      <DeleteModal
        open={canManageUser && isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('delete_user_title')}
        deleteMessage={t('delete_user_message', {
          name: user?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!decodedId) return;

          deleteUser(decodedId, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('user_deleted')),
              });
              navigate('/users-roles/users');
            },
            onError: (error) => {
              showToast({
                variant: 'danger',
                title: t('common:error'),
                description: getApiErrorMessage(error, t('operation_failed')),
              });
            },
          });
        }}
      />

      <ChangePasswordModal
        open={canManageUser && isPasswordOpen}
        setOpen={setIsPasswordOpen}
        userId={decodedId}
      />
    </div>
  );
}
