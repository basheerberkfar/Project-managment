import { IdentificationCard } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/dialog';
import ModalTitle from '@/components/common/modal-title';
import SectionCard from '@/components/ui/section-card';
import { useJobTitleQuery } from '@/services/job-titles';
import { formatDate } from '@/utils/helpers';

type JobTitleViewModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobTitleId?: string | null;
};

export default function JobTitleViewModal({
  open,
  setOpen,
  jobTitleId,
}: JobTitleViewModalProps) {
  const { t } = useTranslation('usersRoles');
  const { data: jobTitle } = useJobTitleQuery(jobTitleId ?? '');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={t('view_job_title')}
          icon={<IdentificationCard size={22} className="text-white" />}
          iconBackground="bg-primary-light-500"
        />
      }
      contentClassName="w-[94vw] sm:w-[720px] max-w-[94vw]"
    >
      <SectionCard title={t('job_title_name')} className="mb-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('job_title_name')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {jobTitle?.name ?? '-'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-light-700 dark:text-gray-dark-500">
              {t('created_at')}
            </p>
            <p className="font-medium text-gray-light-900 dark:text-dark-primary">
              {formatDate(jobTitle?.createdAt)}
            </p>
          </div>
        </div>
      </SectionCard>
    </Modal>
  );
}
