import { LinkSimpleBreakIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ProductUnitViewModalSkeleton } from '@/components/common/modal-skeletons';
import ModalTitle from '@/components/common/modal-title';
import SecondaryButton from '@/components/ui/button/secondary-button';
import Modal from '@/components/ui/dialog';
import { useProductUnitQuery } from '@/features/types/service';
import { resolveText } from '@/utils/helpers';
import StatusBadge from './status-badge';

type ProductUnitViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productUnitId?: number | null;
};

export default function ProductUnitViewModal({
  open,
  setOpen,
  productUnitId,
}: ProductUnitViewModalProps) {
  const { t } = useTranslation('types');
  const { data: productUnit, isLoading } = useProductUnitQuery(
    productUnitId ?? ''
  );

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t('view_product_unit')}
          icon={<LinkSimpleBreakIcon size={22} className="text-white" />}
          iconBackground="bg-primary-light-500/10"
        />
      }
      contentClassName="w-[94vw] sm:w-[920px] max-w-[94vw]"
      footer={
        <SecondaryButton onClick={() => setOpen(false)}>
          {t('close')}
        </SecondaryButton>
      }
    >
      {isLoading ? (
        <ProductUnitViewModalSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard label={t('id')} value={`#${productUnit?.id ?? '-'}`} />
          <DetailCard
            label={t('title_arabic')}
            value={productUnit?.title?.ar || '-'}
          />
          <DetailCard
            label={t('title_english')}
            value={productUnit?.title?.en || '-'}
          />
          <DetailCard
            label={t('description_arabic')}
            value={resolveText(productUnit?.description, 'ar') || '-'}
          />
          <DetailCard
            label={t('description_english')}
            value={resolveText(productUnit?.description, 'en') || '-'}
          />
          <DetailCard
            label={t('products_count')}
            value={String(productUnit?.products_count ?? 0)}
          />
          <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
            <p className="mb-2 text-xs font-medium text-gray-light-700 dark:text-gray-dark-500">
              {t('status')}
            </p>
            <StatusBadge status={productUnit?.status} />
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-light-500 bg-gray-light-100/40 p-4 dark:border-dark-card-border dark:bg-dark-card-surface/40">
      <p className="mb-1 text-xs font-medium text-gray-light-700 dark:text-gray-dark-500">
        {label}
      </p>
      <p className="text-sm whitespace-pre-wrap break-words text-gray-light-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
