import type { Control, FieldErrors } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import StatusSelect from '@/components/common/status-select';
import SectionCard from '@/components/ui/section-card';
import Input from '@/components/ui/input';
import AsyncSelectInput from '@/components/ui/select/async-select';
import Textarea from '@/components/ui/textarea';
import type {
  ProductFormValues,
  ProductFormImage,
} from '@/features/products/service/products.types';

export { getProductSchema } from '@/features/products/page/form/schema';

function getErrorMessage(message: unknown): string | undefined {
  if (message == null) return undefined;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && message.length > 0)
    return typeof message[0] === 'string' ? message[0] : String(message[0]);
  return String(message);
}

export interface ProductFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  fetchProductTypes: (opts: { page: number; search: string }) => Promise<{
    data: { label: string; value: string }[];
    hasMore: boolean;
  }>;
  fetchProductUnits: (opts: { page: number; search: string }) => Promise<{
    data: { label: string; value: string }[];
    hasMore: boolean;
  }>;
  initialImages: ProductFormImage[];
}

export default function ProductForm({
  control,
  errors,
  fetchProductTypes,
  fetchProductUnits,
}: ProductFormProps) {
  const { t } = useTranslation('products');
  const productTypeValue = useWatch({
    control,
    name: 'product_type',
    defaultValue: null,
  });
  const productUnitValue = useWatch({
    control,
    name: 'product_unit',
    defaultValue: null,
  });

  return (
    <div className="flex flex-col gap-4 z-0 relative">
      <SectionCard title={t('product_information')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            name="name"
            control={control}
            label={t('product_name')}
            placeholder={t('enter_product_name')}
            error={errors.name?.message as string}
          />
          <Input
            name="price"
            control={control}
            label={t('price')}
            placeholder="1"
            type="number"
            error={errors.price?.message as string}
          />
          <StatusSelect
            namespace="products"
            name="status"
            control={control}
            label={t('status')}
            placeholder={t('select_status')}
            error={getErrorMessage(errors.status?.message)}
          />
          <AsyncSelectInput
            name="product_type"
            control={control}
            label={t('product_group')}
            placeholder={t('select_product_group')}
            fetchOptions={fetchProductTypes}
            required
            valueOption={productTypeValue ?? undefined}
            error={getErrorMessage(errors.product_type?.message)}
          />
          <AsyncSelectInput
            name="product_unit"
            control={control}
            required
            label={t('product_unit')}
            placeholder={t('select_product_unit')}
            fetchOptions={fetchProductUnits}
            valueOption={productUnitValue ?? undefined}
            error={getErrorMessage(errors.product_unit?.message)}
          />
        </div>
        <div className="w-full mt-4">
          <Textarea
            name="description"
            control={control}
            label={t('description')}
            placeholder={t('enter_description')}
            error={errors.description?.message as string}
          />
        </div>
      </SectionCard>

      <SectionCard title={t('inventory_information')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="quant"
            control={control}
            label={t('start_quantity')}
            placeholder="1"
            type="number"
            error={errors.quant?.message as string}
          />
          <Input
            name="maintenance_quant"
            control={control}
            label={t('maintenance_quantity')}
            placeholder="1"
            type="number"
            error={errors.maintenance_quant?.message as string}
          />
          <Input
            name="notification_minimum_quantity"
            control={control}
            label={t('min_quantity_notification')}
            placeholder="1"
            type="number"
            error={errors.notification_minimum_quantity?.message as string}
          />
        </div>
      </SectionCard>

      {errors.icon_id?.message ? (
        <p className="-mt-2 px-1 text-sm text-danger-500">
          {String(errors.icon_id.message)}
        </p>
      ) : null}
    </div>
  );
}
