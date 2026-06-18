import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import PagesHeader from '@/components/common/pages-header';

export default function RolePageActions({
  isEdit,
  onCancel,
  onSubmit,
  saveDisabled = false,
}: {
  isEdit: boolean;
  onCancel: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  saveDisabled?: boolean;
}) {
  const { t } = useTranslation('usersRoles');

  return (
    <BreadCrumb
      sticky
      items={[
        { label: t('users_roles'), link: '/users-roles/roles' },
        { label: t('roles_list'), link: '/users-roles/roles' },
        { label: isEdit ? t('edit_role') : t('add_role') },
      ]}
      actions={
        <PagesHeader
          secondaryText={t('cancel')}
          onSecondaryClick={onCancel}
          btnText={t('save')}
          onClick={onSubmit}
          primaryButtonType="submit"
          primaryDisabled={saveDisabled}
        />
      }
    />
  );
}
