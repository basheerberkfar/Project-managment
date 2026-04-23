import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/components/ui/toast';
import { useProductTypes } from '@/hooks/use-product-types';
import { useStatusOptions } from '@/hooks/use-status-options';
import { useProductUnits } from '@/hooks/use-product-units';
import {
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/features/products/service/products.query';
import { STATUS } from '@/constants/enums';
import { handleFormErrors } from '@/utils/form-errors';
import { decodeRouteId, resolveText } from '@/utils/helpers';

import type {
  ProductFormValues,
  CreateProductDto,
  UpdateProductDto,
  ProductImageDto,
  ProductFormImage,
} from '@/features/products/service/products.types';
import { getProductSchema } from './schema';
import ProductActions from '@/features/products/components/product-header';
import ProductForm from '@/features/products/components/products-forms';
import { BreadcrumbActionsSkeleton } from '@/features/products/components/breadcrumb-actions-skeleton';
import { SectionCardSkeleton } from '@/features/products/components/section-card-skeleton';
import { ImageUploaderSkeleton } from '@/features/products/components/image-uploader-skeleton';
import FormPageContainer from '@/components/common/form-page-container';

export default function ProductDetails() {
  const { t, i18n } = useTranslation('products');
  const { showToast } = useToast();
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(routeId && routeId !== 'create');
  const decodedId = isEdit ? decodeRouteId(routeId) : '';
  const currentLang = i18n.language === 'ar' ? 'ar' : 'en';

  const statusOptions = useStatusOptions('products');

  const schema = useMemo(() => getProductSchema(t), [t]);

  const { fetchProductTypes } = useProductTypes();
  const { fetchProductUnits } = useProductUnits();

  const { data: product, isLoading: isLoadingProduct } =
    useProductQuery(decodedId);

  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProductMutation();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProductMutation();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: '',
      price: 1,
      quant: 1,
      status: statusOptions[0],
      product_type: null,
      product_unit: null,
      description: '',
      opening_quant: 1,
      maintenance_quant: 1,
      notification_minimum_quantity: 1,
      icon_id: null,
      image_ids: [],
      delete_icon_id: null,
      delete_image_ids: [],
    },
  });

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      price: product.price,
      quant: product.quant,
      status:
        product.status === STATUS.ACTIVE ? statusOptions[0] : statusOptions[1],
      product_type: product.product_type
        ? {
            label:
              resolveText(product.product_type.title, currentLang) ||
              t('group'),
            value: String(product.product_type.id),
          }
        : null,
      product_unit: product.product_unit
        ? {
            label:
              resolveText(product.product_unit.title, currentLang) || t('unit'),
            value: String(product.product_unit.id),
          }
        : null,
      opening_quant: product.quant,
      maintenance_quant: product.maintaince_quant || 0,
      notification_minimum_quantity: product.notification_minimum_quantity || 0,
      description: product.description || '',
      icon_id: product.icon?.id != null ? String(product.icon.id) : null,
      image_ids:
        product.images?.map((img: ProductImageDto) => String(img.id)) ?? [],
      delete_icon_id: null,
      delete_image_ids: [],
    });
  }, [product, reset, statusOptions, currentLang, t]);

  const initialImages = useMemo<ProductFormImage[]>(() => {
    if (!product) return [];
    const iconId = product.icon?.id != null ? String(product.icon.id) : null;
    const iconItem = product.icon
      ? {
          id: product.icon.id,
          url: product.icon.url,
          name: product.name
            ? `${product.name} - ${t('main_image')}`
            : t('main_image'),
          size: 0,
          isMain: true,
        }
      : null;
    const imagesFromApi = (product.images ?? []).map(
      (img: ProductImageDto) => ({
        id: String(img.id),
        url: img.url,
        name: img.name,
        size: img.size,
        isMain: iconId === String(img.id),
      })
    );
    if (iconItem) {
      return [
        { ...iconItem, id: String(iconItem.id) },
        ...imagesFromApi
          .filter((img) => String(img.id) !== iconId)
          .map((img) => ({ ...img, id: String(img.id) })),
      ];
    }
    return imagesFromApi.map((img) => ({
      ...img,
      id: String(img.id),
    }));
  }, [product, t]);

  const buildCreatePayload = (data: ProductFormValues): CreateProductDto => {
    const resolvedIconId = data.icon_id;
    const resolvedOpeningQuant = Number(data.quant);

    return {
      name: data.name,
      price: Number(data.price),
      quant: Number(data.quant),
      status: Number(data.status?.value ?? STATUS.ACTIVE),
      product_type_id: Number(data.product_type?.value ?? 0),
      product_unit_id: Number(data.product_unit?.value ?? 0),
      opening_quant: resolvedOpeningQuant,
      ...(data.maintenance_quant != null && {
        maintaince_quant: Number(data.maintenance_quant),
      }),
      ...(data.notification_minimum_quantity != null && {
        notification_minimum_quantity: Number(
          data.notification_minimum_quantity
        ),
      }),
      ...(data.description && { description: data.description }),
      ...(resolvedIconId && { icon_id: resolvedIconId }),
      image_ids: data.image_ids?.filter((id) => id !== resolvedIconId) ?? [],
    };
  };

  const buildUpdatePayload = (data: ProductFormValues): UpdateProductDto => ({
    ...buildCreatePayload(data),
    ...(data.delete_icon_id && { delete_icon_id: data.delete_icon_id }),
    ...(data.delete_image_ids?.length && {
      delete_image_ids: data.delete_image_ids,
    }),
  });

  const onSubmit = async (data: ProductFormValues) => {
    const uploadedImagesCount = data.image_ids?.length ?? 0;
    const resolvedIconId = data.icon_id;

    if (uploadedImagesCount > 0 && !resolvedIconId) {
      const message = t('select_main_image_required');
      setError('icon_id', {
        type: 'manual',
        message,
      });
      showToast({
        variant: 'danger',
        title: t('error'),
        description: message,
      });
      return;
    }

    try {
      if (isEdit && decodedId) {
        const payload = buildUpdatePayload(data);
        const response = await updateProduct({ id: decodedId, data: payload });
        const message =
          (response as { data?: { message?: string } })?.data?.message ??
          t('operation_success');
        showToast({
          variant: 'success',
          title: t('common:success'),
          description: message,
        });
        navigate('/products');
      } else {
        const payload = buildCreatePayload(data);
        const response = await createProduct(payload);
        const message =
          (response as { data?: { message?: string } })?.data?.message ??
          t('operation_success');
        showToast({
          variant: 'success',
          title: t('common:success'),
          description: message,
        });
        navigate('/products');
      }
    } catch (error: unknown) {
      console.error(error);
      handleFormErrors<ProductFormValues>({
        error,
        setError,
        fieldMap: {
          product_type_id: 'product_type',
          product_unit_id: 'product_unit',
          maintaince_quant: 'maintenance_quant',
        },
        toast: (message) =>
          showToast({
            variant: 'danger',
            title: t('error'),
            description: message,
          }),
        fallbackMessage: t('operation_failed'),
      });
    }
  };

  const handleCancel = () => navigate('/products');

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col h-full form-container gap-4">
        <BreadcrumbActionsSkeleton />
        <SectionCardSkeleton
          titleWidth="w-48"
          fieldsCount={5}
          gridCols={5}
          hasTextarea
        />
        <SectionCardSkeleton titleWidth="w-44" fieldsCount={3} gridCols={3} />
        <ImageUploaderSkeleton />
      </div>
    );
  }

  return (
    <FormPageContainer onSubmit={handleSubmit(onSubmit)}>
      <ProductActions
        isEdit={isEdit}
        isLoading={isCreating || isUpdating}
        saveDisabled={!isDirty || isCreating || isUpdating}
        productName={product?.name}
        onCancel={handleCancel}
        onSubmit={handleSubmit(onSubmit)}
      />
      <ProductForm
        control={control}
        errors={errors}
        fetchProductTypes={fetchProductTypes}
        fetchProductUnits={fetchProductUnits}
        initialImages={initialImages}
      />
    </FormPageContainer>
  );
}
