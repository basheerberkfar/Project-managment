import React, { type ReactNode } from 'react';
import { Warning } from '@phosphor-icons/react';
import Modal from '@/components/ui/dialog';
import ModalTitle from '../modal-title';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';

type ConfirmModalType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string | React.ReactNode;
  message: string | ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ConfirmModal: React.FC<ConfirmModalType> = ({
  setOpen,
  open,
  title,
  message,
  onConfirm,
  isLoading,
}) => {
  const { t } = useTranslation('common');
  const handleClose = () => {
    if (isLoading) return;
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <ModalTitle
          title={title}
          iconBackground="bg-warning-500"
          icon={<Warning className="text-white" size={24} weight="fill" />}
        />
      }
      children={
        <p className="dark:text-white text-black leading-[24px]">{message}</p>
      }
      footer={
        <>
          <SecondaryButton disabled={isLoading} onClick={handleClose}>
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            isSubmitting={isLoading}
            IconSize={18}
          >
            {t('confirm')}
          </PrimaryButton>
        </>
      }
    />
  );
};

export default ConfirmModal;
