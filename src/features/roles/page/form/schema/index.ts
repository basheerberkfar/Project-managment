import * as yup from 'yup';
import type { TFunction } from 'i18next';
import type { RoleFormValues } from '@/features/roles/service';

export function getRoleSchema(t: TFunction) {
  return yup.object({
    name: yup.string().trim().required(t('role_name_required')),
    permissions_ids: yup
      .array()
      .of(yup.string().required())
      .min(1, t('select_at_least_one_permission'))
      .required(t('select_at_least_one_permission')),
  }) as yup.ObjectSchema<RoleFormValues>;
}
