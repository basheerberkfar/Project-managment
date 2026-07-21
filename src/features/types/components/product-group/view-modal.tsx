import { Broadcast } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ProductGroupViewModalSkeleton } from '@/components/common/modal-skeletons';
import ModalTitle from '@/components/common/modal-title';
import SecondaryButton from '@/components/ui/button/secondary-button';
import Modal from '@/components/ui/dialog';
import SectionCard from '@/components/ui/section-card';
import { useProductTypeQuery } from '@/features/types/service';
import { resolveText } from '@/utils/helpers';
import StatusBadge from '../product-unit/status-badge';
import { PRODUCT_CATEGORY_TRANSLATION_KEYS } from '../../constants/product-category';

type ProductGroupViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productGroupId?: number | null;
};

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-3 sm:p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
      <p className="mb-1 text-xs font-medium text-gray-light-700 dark:text-gray-dark-500">
        {label}
      </p>
      <p className="text-sm whitespace-pre-wrap break-words text-gray-light-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default function ProductGroupViewModal({
  open,
  setOpen,
  productGroupId,
}: ProductGroupViewModalProps) {
  const { t } = useTranslation('types');
  const { data: productGroup, isLoading } = useProductTypeQuery(
    productGroupId ?? ''
  );
  const contractTypes = productGroup?.contract_types?.length
    ? productGroup.contract_types
    : productGroup?.contract_type
      ? [productGroup.contract_type]
      : [];
  const billTypes = productGroup?.bill_types?.length
    ? productGroup.bill_types
    : productGroup?.bill_type
      ? [productGroup.bill_type]
      : [];

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t('view_product_group')}
          icon={<Broadcast size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[860px] max-w-[94vw]"
      bodyClassName="max-h-[72vh] overflow-y-auto p-4 sm:p-5"
      footer={
        <SecondaryButton onClick={() => setOpen(false)}>
          {t('close')}
        </SecondaryButton>
      }
    >
      {isLoading ? (
        <ProductGroupViewModalSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          <SectionCard
            title={t('product_group_details')}
            className="mb-0 rounded-2xl p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailCard
                label={t('title_arabic')}
                value={productGroup?.title?.ar || '-'}
              />
              <DetailCard
                label={t('title_english')}
                value={productGroup?.title?.en || '-'}
              />
              <DetailCard
                label={t('description_arabic')}
                value={resolveText(productGroup?.description, 'ar') || '-'}
              />
              <DetailCard
                label={t('description_english')}
                value={resolveText(productGroup?.description, 'en') || '-'}
              />
            </div>
          </SectionCard>

          <SectionCard
            title={t('configuration_settings')}
            className="mb-0 rounded-2xl p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailCard
                label={t('contract_type')}
                value={
                  contractTypes.length > 0
                    ? contractTypes
                        .map((contractType) =>
                          resolveText(contractType.title, 'ar')
                        )
                        .join(' - ')
                    : '-'
                }
              />
              <DetailCard
                label={t('bill_type')}
                value={
                  billTypes.length > 0
                    ? billTypes
                        .map((billType) => resolveText(billType.title, 'ar'))
                        .join(' - ')
                    : '-'
                }
              />
              <DetailCard
                label={t('category')}
                value={
                  productGroup?.category
                    ? t(
                        PRODUCT_CATEGORY_TRANSLATION_KEYS[
                          productGroup.category
                        ] ?? 'category'
                      )
                    : '-'
                }
              />
              <DetailCard
                label={t('products_count')}
                value={String(
                  productGroup?.products_count ??
                    productGroup?.productsCount ??
                    0
                )}
              />
              <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-3 sm:p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
                <p className="mb-2 text-xs font-medium text-gray-light-700 dark:text-gray-dark-500">
                  {t('status')}
                </p>
                <StatusBadge status={productGroup?.status} />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </Modal>
  );
}
