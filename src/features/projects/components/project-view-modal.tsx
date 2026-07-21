import { Briefcase } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ModalTitle from '@/components/common/modal-title';
import Modal from '@/components/ui/dialog';
import SectionCard from '@/components/ui/section-card';
import { useProjectQuery } from '@/services/projects';
import { formatDate } from '@/utils/helpers';

type ProjectViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId?: string | null;
};

export default function ProjectViewModal({
  open,
  setOpen,
  projectId,
}: ProjectViewModalProps) {
  const { t } = useTranslation('projects');
  const { data: project } = useProjectQuery(projectId ?? '');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t('view_project')}
          icon={<Briefcase size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[760px] max-w-[94vw]"
    >
      <SectionCard title={t('project_information')} className="mb-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('project_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.name ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('client_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.clientName ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('status')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.status ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('priority')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.priority ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('receipt_date')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(project?.receiptDate)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('delivery_date')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(project?.deliveryDate)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('start_date')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(project?.startDate)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('total_amount')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.totalAmount ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('paid_amount')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.paidAmount ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('remaining_amount')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.remainingAmount ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('created_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(project?.createdAt)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('updated_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(project?.updatedAt)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('description')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {project?.description ?? '-'}
            </p>
          </div>
        </div>
      </SectionCard>
    </Modal>
  );
}
