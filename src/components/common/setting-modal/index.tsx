import React from 'react';
import Modal from '@/components/ui/dialog';
import ModalTitle from '../modal-title';
import { SecondaryButton } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from '@phosphor-icons/react';
import PrimaryButton from '@/components/ui/button/primary-button';
type SettingModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  handelReset: () => void;
  handelApply: () => void;
};

export default function SettingModal({
  open,
  setOpen,
  children,
  handelReset,
  handelApply,
}: SettingModalProps) {
  const { t } = useTranslation('common');
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          iconBackground="bg-primary-dark-800"
          title={t('columns-display')}
          icon={<SlidersHorizontal size={24} className="text-white" />}
        />
      }
      footer={
        <>
          <SecondaryButton variant="outline" onClick={handelReset}>
            {t('reset-default')}
          </SecondaryButton>

          <PrimaryButton onClick={handelApply}>{t('apply')}</PrimaryButton>
        </>
      }
    >
      {children}
    </Modal>
  );
}
