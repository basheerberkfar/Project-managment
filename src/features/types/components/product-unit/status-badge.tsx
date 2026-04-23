import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { StatusEnum } from '@/constants/enums';
import { PRODUCT_UNIT_STATUS } from '../../constants/status';

type StatusBadgeProps = {
  status?: StatusEnum | number | null;
  className?: string;
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation('types');
  const isActive = Number(status) === PRODUCT_UNIT_STATUS.ACTIVE;

  return (
    <span
      className={clsx(
        'inline-flex min-w-[88px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold',
        isActive
          ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800/60 dark:bg-green-900/20 dark:text-green-300'
          : 'border-danger-500/20 bg-danger-500/10 text-danger-500 dark:border-danger-500/30 dark:bg-danger-500/15 dark:text-danger-400',
        className
      )}
    >
      {isActive ? t('active') : t('inactive')}
    </span>
  );
}
