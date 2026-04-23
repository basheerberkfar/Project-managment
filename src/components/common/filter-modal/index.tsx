import React from 'react';
import Modal from '@/components/ui/dialog';
import ModalTitle from '../modal-title';
import { useTranslation } from 'react-i18next';
import { SecondaryButton } from '@/components/ui/button';
import PrimaryButton from '@/components/ui/button/primary-button';
import { Funnel } from '@phosphor-icons/react';

type FilterModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  handelReset: () => void;
  handelFilter: () => void;
};

const FilterModal = ({
  open,
  setOpen,
  children,
  handelReset,
  handelFilter,
}: FilterModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      preventAutoFocus
      title={
        <ModalTitle
          iconBackground="bg-primary-dark-800"
          title={t('search-filters')}
          icon={<Funnel size={24} className="text-white" />}
        />
      }
      footer={
        <>
          <SecondaryButton onClick={handelReset}>{t('reset')}</SecondaryButton>

          <PrimaryButton onClick={handelFilter}>
            {t('apply-filter')}
          </PrimaryButton>
        </>
      }
    >
      {children}
    </Modal>
  );
};

export default FilterModal;
