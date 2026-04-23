import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import PagesHeader from '@/components/common/pages-header';

export interface ProductActionsProps {
  isEdit: boolean;
  isLoading?: boolean;
  /** تعطيل زر الحفظ حتى يغيّر المستخدم أي قيمة في النموذج */
  saveDisabled?: boolean;
  productName?: string;
  onCancel: () => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export default function ProductActions({
  isEdit,
  isLoading = false,
  saveDisabled = false,
  productName,
  onCancel,
  onSubmit,
}: ProductActionsProps) {
  const { t } = useTranslation('products');

  const lastCrumbLabel = isEdit
    ? productName?.trim() || t('edit-product')
    : t('add-new');

  return (
    <BreadCrumb
      sticky
      items={[
        { label: t('products'), link: '/products' },
        { label: t('product-list'), link: '/products' },
        { label: lastCrumbLabel },
      ]}
      actions={
        <PagesHeader
          secondaryText={t('cancel')}
          onSecondaryClick={onCancel}
          btnText={t('save')}
          btnLoading={isLoading}
          primaryDisabled={saveDisabled}
          onClick={onSubmit}
          primaryButtonType="submit"
        />
      }
    />
  );
}
