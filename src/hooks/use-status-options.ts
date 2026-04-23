import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SelectOption } from '@/components/ui/select';
import { STATUS } from '@/constants/enums';

export function useStatusOptions(
  namespace: 'products' | 'types' | 'clients' | 'delegates' | 'cars' = 'types'
) {
  const { t } = useTranslation(namespace);

  return useMemo<SelectOption[]>(
    () => [
      { label: t('active'), value: String(STATUS.ACTIVE) },
      { label: t('inactive'), value: String(STATUS.INACTIVE) },
    ],
    [t]
  );
}
