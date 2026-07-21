import * as yup from 'yup';
import type { TFunction } from 'i18next';
import type { RoleFormValues } from '@/features/roles/service';

export function getRoleSchema(t: TFunction) {
  return yup.object({
    name: yup.string().trim().required(t('role_name_required')),
    guardName: yup.string().trim().required(t('guard_name_required')),
  }) as yup.ObjectSchema<RoleFormValues>;
}
