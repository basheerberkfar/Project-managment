import * as yup from 'yup';
import type { TFunction } from 'i18next';
import type { UserFormValues } from '@/features/users/service';

export function getUserSchema(t: TFunction, isEdit: boolean) {
  return yup.object({
    name: yup.string().trim().required(t('name_required')),
    email: yup
      .string()
      .trim()
      .email(t('email_invalid'))
      .required(t('email_required')),
    password: isEdit
      ? yup.string().trim().default('')
      : yup
          .string()
          .trim()
          .min(6, t('password_min'))
          .required(t('password_required')),
    confirmPassword: isEdit
      ? yup.string().trim().default('')
      : yup
          .string()
          .trim()
          .required(t('password_confirm_required'))
          .oneOf([yup.ref('password')], t('passwords_must_match')),
    phoneNumber: yup.string().trim().required(t('phone_required')),
    countryCode: yup.string().trim().required(t('field_required')),
    gender: yup.mixed().nullable().required(t('gender_required')),
    department: yup
      .mixed()
      .nullable()
      .required(t('department_required')),
    jobTitle: yup.mixed().nullable().required(t('job_title_required')),
    isActive: yup.boolean().required(),
  }) as yup.ObjectSchema<UserFormValues>;
}
