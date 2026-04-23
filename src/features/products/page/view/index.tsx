import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useProductQuery,
  useDeleteProductMutation,
} from '@/features/products/service/products.query';
import { STATUS } from '@/constants/enums';
import SectionCard from '@/components/ui/section-card';
import BreadCrumb from '@/components/common/breadCrumb';
import PagesHeader from '@/components/common/pages-header';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import DeleteModal from '@/components/common/delete-modal';
import { DisplayProductSkeleton } from '@/features/products/components/display-product-skeleton';
import { useToast } from '@/components/ui/toast';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import {
  decodeRouteId,
  encodeRouteId,
  getApiErrorMessage,
  getApiSuccessMessage,
} from '@/utils/helpers';
import { hasPermission } from '@/utils/permissions';

const DisplayProduct = () => {
  const { t, i18n } = useTranslation('products');
  const { showToast } = useToast();
  const { id: routeId } = useParams();
  const decodedId = decodeRouteId(routeId);
  const { data: product, isLoading: isLoadingProduct } = useProductQuery(
    Number(decodedId)
  );
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteProduct, isPending: isDeleting } =
    useDeleteProductMutation();
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en';
  const canEdit = hasPermission(
    PERMISSION_GROUPS.products,
    PERMISSION_ACTIONS.update
  );
  const canDelete = hasPermission(
    PERMISSION_GROUPS.products,
    PERMISSION_ACTIONS.delete
  );

  const formatValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return '---';
    return value;
  };

  const mainInfo = [
    { label: t('product_name'), value: product?.name },
    { label: t('product-price'), value: product?.price },
    {
      label: t('product-status'),
      value: product?.status === STATUS.ACTIVE ? t('active') : t('inactive'),
    },
    {
      label: t('product_group'),
      value: product?.product_type?.title?.[currentLang],
    },
    {
      label: t('product_unit'),
      value: product?.product_unit?.title?.[currentLang],
    },
  ];

  const stockInfo = [
    { label: t('start-quantity'), value: product?.opening_quant },
    { label: t('maintenance_quantity'), value: product?.maintaince_quant },
    {
      label: t('min_quantity_notification'),
      value: product?.notification_minimum_quantity,
    },
    { label: t('quantity'), value: product?.quant },
  ];

  if (isLoadingProduct) {
    return <DisplayProductSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumb
        sticky
        items={[
          { label: t('products'), link: '/products' },
          { label: t('product-list'), link: '/products' },
          { label: product?.name || '...' },
        ]}
        actions={
          <PagesHeader
            secondaryText={
              canDelete ? <Trash className="w-4 h-4" /> : undefined
            }
            onSecondaryClick={
              canDelete ? () => setIsDeleteOpen(true) : undefined
            }
            btnText={
              canEdit ? <PencilSimpleLine className="w-4 h-4" /> : undefined
            }
            btnIcon={canEdit ? <></> : undefined}
            onClick={
              canEdit
                ? () => navigate(`/products/${encodeRouteId(decodedId)}`)
                : undefined
            }
          />
        }
      />
      <div className="flex flex-col gap-4">
        <SectionCard title={t('product-information')}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[12px] mb-4">
            {mainInfo.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-[0.875rem] dark:text-gray-dark-500 text-gray-light-800">
                  {item.label}
                </p>
                <p className="text-[0.875rem] dark:text-dark-primary text-light-text-primary">
                  {formatValue(item.value)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[0.875rem] dark:text-gray-dark-500 text-gray-light-800">
              {t('description')}
            </p>
            <p className="text-[0.875rem] dark:text-dark-primary text-light-text-primary">
              {formatValue(product?.description)}
            </p>
          </div>
        </SectionCard>

        <SectionCard title={t('product-inventory')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {stockInfo.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-[0.875rem] dark:text-gray-dark-500 text-gray-light-800">
                  {item.label}
                </p>
                <p className="text-[0.875rem] dark:text-dark-primary text-light-text-primary">
                  {formatValue(item.value)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <DeleteModal
        open={canDelete && isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('delete_product_title')}
        deleteMessage={t('delete_product_message', {
          name: product?.name ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!decodedId) return;
          deleteProduct(Number(decodedId), {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(
                  response,
                  t('operation_success')
                ),
              });
              setIsDeleteOpen(false);
              navigate('/products');
            },
            onError: (error) => {
              const message = getApiErrorMessage(error, t('operation_failed'));
              showToast({
                variant: 'danger',
                title: t('error'),
                description: message,
              });
            },
          });
        }}
      />
    </div>
  );
};

export default DisplayProduct;
