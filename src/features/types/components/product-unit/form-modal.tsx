import { LinkSimpleBreakIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ProductUnitFormModalSkeleton } from '@/components/common/modal-skeletons';
import ModalTitle from '@/components/common/modal-title';
import PrimaryButton from '@/components/ui/button/primary-button';
import SecondaryButton from '@/components/ui/button/secondary-button';
import Modal from '@/components/ui/dialog';
import FormInput from '@/components/ui/formInput';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import type {
  CreateProductUnitDto,
  ProductUnitFormValues,
  UpdateProductUnitDto,
} from '@/features/types/service';
import { useProductUnitQuery } from '@/features/types/service';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage, resolveText } from '@/utils/helpers';
import { PRODUCT_UNIT_STATUS } from '../../constants/status';

type ProductUnitFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productUnitId?: number | null;
  onCreate: (data: CreateProductUnitDto) => Promise<unknown>;
  onUpdate: (
    id: number | string,
    data: UpdateProductUnitDto
  ) => Promise<unknown>;
  isSubmitting?: boolean;
};

export default function ProductUnitFormModal({
  open,
  setOpen,
  productUnitId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: ProductUnitFormModalProps) {
  const { t } = useTranslation('types');
  const { showToast } = useToast();
  const { data: productUnit, isLoading: isProductUnitLoading } =
    useProductUnitQuery(productUnitId ?? '');
  const isEdit = productUnitId != null;

  const { control, handleSubmit, reset, setError } =
    useForm<ProductUnitFormValues>({
      defaultValues: {
        titleEnglish: '',
        titleArabic: '',
        descriptionEnglish: '',
        descriptionArabic: '',
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      titleEnglish: productUnit?.title?.en ?? '',
      titleArabic: productUnit?.title?.ar ?? '',
      descriptionEnglish: resolveText(productUnit?.description, 'en'),
      descriptionArabic: resolveText(productUnit?.description, 'ar'),
    });
  }, [open, productUnit, reset]);

  const onSubmit = async (data: ProductUnitFormValues) => {
    const payload: CreateProductUnitDto = {
      title: {
        en: data.titleEnglish ? data.titleEnglish : data.titleArabic,
        ar: data.titleArabic ? data.titleArabic : data.titleEnglish,
      },
      description: {
        en: data.descriptionEnglish,
        ar: data.descriptionArabic,
      },
      status: productUnit?.status ?? PRODUCT_UNIT_STATUS.ACTIVE,
    };

    try {
      const response = productUnit
        ? await onUpdate(productUnit.id, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(
          response,
          t(isEdit ? 'product_unit_updated' : 'product_unit_saved')
        ),
      });

      setOpen(false);
      reset();
    } catch (error: unknown) {
      handleFormErrors<ProductUnitFormValues>({
        error,
        setError,
        toast: (message) =>
          showToast({
            variant: 'danger',
            description: message,
          }),
        fallbackMessage: t('operation_failed'),
      });
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t(isEdit ? 'edit_product_unit' : 'add_product_unit')}
          icon={<LinkSimpleBreakIcon size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[820px] max-w-[94vw]"
      footer={
        <>
          <SecondaryButton onClick={() => setOpen(false)}>
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
            IconSize={16}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      {productUnitId != null && isProductUnitLoading ? (
        <ProductUnitFormModalSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              name="titleArabic"
              control={control}
              label={t('title_arabic')}
              required
              rules={{ required: t('field_required') }}
              showErrorOnTouchedOnly={false}
            />
            <FormInput
              name="titleEnglish"
              control={control}
              label={t('title_english')}
              required
              rules={{ required: t('field_required') }}
              showErrorOnTouchedOnly={false}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Textarea
              name="descriptionArabic"
              control={control}
              label={t('description_arabic')}
              defaultValue=""
            />
            <Textarea
              name="descriptionEnglish"
              control={control}
              label={t('description_english')}
              defaultValue=""
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
