import * as yup from 'yup';

export const createLoginSchema = ({
  t,
}: {
  t: (key: string) => string;
}) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .email(t('validation.invalid_email'))
      .required(t('validation.email_required')),
    password: yup
      .string()
      .min(6, t('validation.password_min'))
      .required(t('validation.password_required')),
  });
