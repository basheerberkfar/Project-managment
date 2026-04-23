import * as yup from 'yup';
import type { TFunction } from 'i18next';

const numberTransform = (v: unknown): number | undefined => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

export function getProductSchema(t: TFunction) {
  return yup.object().shape({
    name: yup.string().trim().required(t('name_required')),
    product_type: yup.object().required(t('product_type_required')),
    product_unit: yup.object().required(t('product_unit_required')),
    quant: yup
      .number()
      .transform(numberTransform)
      .min(1, t('min_value_1'))
      .optional()
      .nullable(),
    price: yup
      .number()
      .transform(numberTransform)
      .min(1, t('min_value_1'))
      .optional()
      .nullable(),
    status: yup.object().optional().nullable(),
    description: yup.string().nullable(),
    opening_quant: yup
      .number()
      .transform(numberTransform)
      .min(1, t('min_value_1'))
      .optional()
      .nullable(),
    maintenance_quant: yup
      .number()
      .transform(numberTransform)
      .min(1, t('min_value_1'))
      .optional()
      .nullable(),
    notification_minimum_quantity: yup
      .number()
      .transform(numberTransform)
      .required(t('notification_minimum_quantity_required'))
      .min(1, t('min_value_1')),
    icon_id: yup.string().nullable(),
    image_ids: yup.array().of(yup.string()).optional().nullable(),
    delete_icon_id: yup.string().nullable(),
    delete_image_ids: yup.array().of(yup.string()).optional().nullable(),
  });
}
