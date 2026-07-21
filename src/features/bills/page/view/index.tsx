import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import DeleteModal from '@/components/common/delete-modal';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import SectionCard from '@/components/ui/section-card';
import { BillViewSkeleton } from '@/features/bills/components/bill-view-skeleton';
import { useToast } from '@/components/ui/toast';
import {
  useBillQuery,
  useDeleteBillMutation,
} from '@/features/bills/service';
import {
  decodeRouteId,
  encodeRouteId,
  formatDate,
  getApiErrorMessage,
  getApiSuccessMessage,
} from '@/utils/helpers';
import { hasPermission } from '@/utils/permissions';
import { PERMISSION_ACTIONS, PERMISSION_GROUPS } from '@/constants/permissions';
import { useState } from 'react';

export default function BillViewPage() {
  const { t } = useTranslation('bills');
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const decodedId = decodeRouteId(routeId);

  const { data: bill, isLoading } = useBillQuery(decodedId);
  const { mutate: deleteBill, isPending: isDeleting } = useDeleteBillMutation();
  const canEdit = hasPermission(
    PERMISSION_GROUPS.bills,
    PERMISSION_ACTIONS.update
  );
  const canDelete = hasPermission(
    PERMISSION_GROUPS.bills,
    PERMISSION_ACTIONS.delete
  );

  if (isLoading) {
    return <BillViewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb
        sticky
        items={[
          { label: t('bills'), link: '/bills' },
          { label: t('bills_list'), link: '/bills' },
          { label: bill?.no ?? t('bill_details') },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canDelete && (
              <SecondaryButton
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="h-10 w-10 px-0"
                title={t('common:delete')}
              >
                <Trash size={18} />
              </SecondaryButton>
            )}

            {canEdit && (
              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(`/bills/${encodeRouteId(decodedId)}`)
                }
                className="h-10 w-10 px-0"
                title={t('common:edit')}
              >
                <PencilSimpleLine size={18} />
              </PrimaryButton>
            )}
          </div>
        }
      />

      <SectionCard title={t('bill_information')}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('no')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.no ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('bill_type')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.billTypeName ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('barcode')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.barcode ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('related_to_project')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.relatedToProject ? t('yes') : t('no')}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('project_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.projectName ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('client_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.clientName ?? '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('total')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.total != null ? String(bill.total) : '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('paid_amount')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {bill?.paidAmount != null ? String(bill.paidAmount) : '-'}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('created_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(bill?.createdAt)}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('updated_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(bill?.updatedAt)}
            </p>
          </div>
        </div>
      </SectionCard>

      <DeleteModal
        open={canDelete && isDeleteOpen}
        setOpen={setIsDeleteOpen}
        title={t('delete_bill_title')}
        deleteMessage={t('delete_bill_message', {
          no: bill?.no ?? '',
        })}
        isLoading={isDeleting}
        handelDelete={() => {
          if (!decodedId) return;

          deleteBill(decodedId, {
            onSuccess: (response) => {
              showToast({
                variant: 'success',
                title: t('common:success'),
                description: getApiSuccessMessage(response, t('bill_deleted')),
              });
              setIsDeleteOpen(false);
              navigate('/bills');
            },
            onError: (error) => {
              showToast({
                variant: 'danger',
                title: t('error'),
                description: getApiErrorMessage(error, t('operation_failed')),
              });
            },
          });
        }}
      />
    </div>
  );
}
