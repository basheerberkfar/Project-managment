import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type UserStatusBadgeProps = {
  isActive?: boolean;
};

export default function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  const { t } = useTranslation('usersRoles');

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        isActive
          ? 'bg-primary-light-500/10 text-primary-dark-500'
          : 'bg-danger-500/10 text-danger-500'
      )}
    >
      {isActive ? t('active') : t('inactive')}
    </span>
  );
}
