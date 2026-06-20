import { User } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ModalTitle from '@/components/common/modal-title';
import Modal from '@/components/ui/dialog';
import SectionCard from '@/components/ui/section-card';
import { useClientQuery } from '@/services/clients';
import { formatDate } from '@/utils/helpers';

type ClientViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId?: string | null;
};

export default function ClientViewModal({
  open,
  setOpen,
  clientId,
}: ClientViewModalProps) {
  const { t } = useTranslation('clients');
  const { data: client } = useClientQuery(clientId ?? '');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t('view_client')}
          icon={<User size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[760px] max-w-[94vw]"
    >
      <SectionCard title={t('client_information')} className="mb-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('client_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {client?.name ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('phone_number')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {client?.countryCode} {client?.phoneNumber}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('address')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {client?.address ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('birthday')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(client?.birthday)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('created_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(client?.createdAt)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('updated_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(client?.updatedAt)}
            </p>
          </div>
        </div>
      </SectionCard>
    </Modal>
  );
}
