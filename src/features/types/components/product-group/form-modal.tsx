import { Broadcast } from '@phosphor-icons/react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ProductGroupFormModalSkeleton } from '@/components/common/modal-skeletons';
import ModalTitle from '@/components/common/modal-title';
import StatusSelect from '@/components/common/status-select';
import PrimaryButton from '@/components/ui/button/primary-button';
import SecondaryButton from '@/components/ui/button/secondary-button';
import Modal from '@/components/ui/dialog';
import FormInput from '@/components/ui/formInput';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SectionCard from '@/components/ui/section-card';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { STATUS } from '@/constants/enums';
import { useProductTypeQuery } from '@/features/types/service';
import type {
  CreateProductTypeDto,
  ProductTypeFormValues,
  UpdateProductTypeDto,
} from '@/features/types/service';
import { handleFormErrors } from '@/utils/form-errors';
import { getApiSuccessMessage, resolveText } from '@/utils/helpers';
import {
  PRODUCT_CATEGORY_ENUM,
  PRODUCT_CATEGORY_TRANSLATION_KEYS,
} from '../../constants/product-category';

type ProductGroupFormModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productGroupId?: number | null;
  onCreate: (data: CreateProductTypeDto) => Promise<unknown>;
  onUpdate: (
    id: number | string,
    data: UpdateProductTypeDto
  ) => Promise<unknown>;
  isSubmitting?: boolean;
};

function getErrorMessage(message: unknown): string | undefined {
  if (message == null) return undefined;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && message.length > 0)
    return typeof message[0] === 'string' ? message[0] : String(message[0]);
  return String(message);
}

export default function ProductGroupFormModal({
  open,
  setOpen,
  productGroupId,
  onCreate,
  onUpdate,
  isSubmitting = false,
}: ProductGroupFormModalProps) {
  const { t } = useTranslation('types');
  const { showToast } = useToast();
  const { data: productGroup, isLoading: isProductGroupLoading } =
    useProductTypeQuery(productGroupId ?? '');
  const isEdit = productGroupId != null;

  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      {
        label: t(PRODUCT_CATEGORY_TRANSLATION_KEYS[PRODUCT_CATEGORY_ENUM.OILS]),
        value: String(PRODUCT_CATEGORY_ENUM.OILS),
      },
      {
        label: t(
          PRODUCT_CATEGORY_TRANSLATION_KEYS[PRODUCT_CATEGORY_ENUM.DEVICES]
        ),
        value: String(PRODUCT_CATEGORY_ENUM.DEVICES),
      },
      {
        label: t(
          PRODUCT_CATEGORY_TRANSLATION_KEYS[PRODUCT_CATEGORY_ENUM.OTHER]
        ),
        value: String(PRODUCT_CATEGORY_ENUM.OTHER),
      },
    ],
    [t]
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    defaultValues: {
      titleEnglish: '',
      titleArabic: '',
      descriptionEnglish: '',
      descriptionArabic: '',
      contractTypes: [],
      billTypes: [],
      status: {
        label: t('active'),
        value: String(STATUS.ACTIVE),
      },
      category: null,
    },
  });

  const selectedContractTypes = useMemo(
    () =>
      productGroup?.contract_types?.map((contractType) => ({
        label: resolveText(contractType.title, 'ar'),
        value: String(contractType.id),
      })) ??
      (productGroup?.contract_type
        ? [
            {
              label: resolveText(productGroup.contract_type.title, 'ar'),
              value: String(productGroup.contract_type.id),
            },
          ]
        : []),
    [productGroup]
  );

  const selectedBillTypes = useMemo(
    () =>
      productGroup?.bill_types?.map((billType) => ({
        label: resolveText(billType.title, 'ar'),
        value: String(billType.id),
      })) ??
      (productGroup?.bill_type
        ? [
            {
              label: resolveText(productGroup.bill_type.title, 'ar'),
              value: String(productGroup.bill_type.id),
            },
          ]
        : []),
    [productGroup]
  );

  useEffect(() => {
    if (!open) return;

    reset({
      titleEnglish: productGroup?.title?.en ?? '',
      titleArabic: productGroup?.title?.ar ?? '',
      descriptionEnglish: resolveText(productGroup?.description, 'en'),
      descriptionArabic: resolveText(productGroup?.description, 'ar'),
      contractTypes: selectedContractTypes,
      billTypes: selectedBillTypes,
      status: {
        label:
          Number(productGroup?.status) === STATUS.INACTIVE
            ? t('inactive')
            : t('active'),
        value: String(
          Number(productGroup?.status) === STATUS.INACTIVE
            ? STATUS.INACTIVE
            : STATUS.ACTIVE
        ),
      },
      category:
        categoryOptions.find(
          (option) => Number(option.value) === Number(productGroup?.category)
        ) ?? null,
    });
  }, [
    categoryOptions,
    open,
    productGroup,
    reset,
    selectedBillTypes,
    selectedContractTypes,
    t,
  ]);

  const onSubmit = async (data: ProductTypeFormValues) => {
    const payload: CreateProductTypeDto = {
      title: {
        en: data.titleEnglish ? data.titleEnglish : data.titleArabic,
        ar: data.titleArabic ? data.titleArabic : data.titleEnglish,
      },
      description: {
        en: data.descriptionEnglish,
        ar: data.descriptionArabic,
      },
      contract_types: data.contractTypes.map((option) => Number(option.value)),
      bill_types: data.billTypes.map((option) => Number(option.value)),
      status: Number(data.status?.value ?? STATUS.ACTIVE) as 1 | 2,
      category: Number(data.category?.value ?? PRODUCT_CATEGORY_ENUM.OILS),
    };

    try {
      const response = productGroup
        ? await onUpdate(productGroup.id, payload)
        : await onCreate(payload);

      showToast({
        variant: 'success',
        title: t('common:success'),
        description: getApiSuccessMessage(
          response,
          t(isEdit ? 'product_group_updated' : 'product_group_saved')
        ),
      });

      setOpen(false);
      reset();
    } catch (error: unknown) {
      handleFormErrors<ProductTypeFormValues>({
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
          title={t(isEdit ? 'edit_product_group' : 'add_product_group')}
          icon={<Broadcast size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[860px] max-w-[94vw]"
      bodyClassName="max-h-[72vh] overflow-y-auto p-4 sm:p-5"
      footer={
        <>
          <SecondaryButton onClick={() => setOpen(false)}>
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
            IconSize={14}
          >
            {t('save')}
          </PrimaryButton>
        </>
      }
    >
      {productGroupId != null && isProductGroupLoading ? (
        <ProductGroupFormModalSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          <SectionCard
            title={t('product_group_details')}
            className="mb-0 rounded-2xl p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          </SectionCard>

          <SectionCard
            title={t('configuration_settings')}
            className="mb-0 rounded-2xl p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <StatusSelect
                namespace="types"
                name="status"
                control={control}
                label={t('status')}
                placeholder={t('select_status')}
                rules={{ required: t('field_required') }}
                error={getErrorMessage(errors.status?.message)}
              />
              <SelectInput
                name="category"
                control={control as never}
                label={t('category')}
                placeholder={t('select_category')}
                options={categoryOptions}
                rules={{ required: t('field_required') }}
                error={getErrorMessage(errors.category?.message)}
              />
            </div>
          </SectionCard>
        </div>
      )}
    </Modal>
  );
}
