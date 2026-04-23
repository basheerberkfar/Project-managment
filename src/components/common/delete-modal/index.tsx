import React, { type ReactNode } from 'react';
import { Trash } from '@phosphor-icons/react';
import Modal from '@/components/ui/dialog';
import ModalTitle from '../modal-title';
import { useTranslation } from 'react-i18next';
import { DangerButton, SecondaryButton } from '@/components/ui/button';
import ErrorForm from '../error-form';

type DeleteModalType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string | React.ReactNode;
  deleteMessage: string | ReactNode;
  handelDelete: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const DeleteModal: React.FC<DeleteModalType> = ({
  setOpen,
  open,
  title,
  deleteMessage,
  handelDelete,
  isLoading,
  errorMessage,
}) => {
  const { t } = useTranslation('common');
  const handelClose = () => {
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
          iconBackground="bg-danger-500"
          icon={<Trash className="text-white" size={24} />}
        />
      }
      children={
        <div className="flex flex-col gap-3">
          <ErrorForm message={errorMessage} />
          <p className="dark:text-white text-black leading-[24px]">
            {deleteMessage}
          </p>
        </div>
      }
      footer={
        <>
          <SecondaryButton disabled={isLoading} onClick={handelClose}>
            {t('cancel')}
          </SecondaryButton>
          <DangerButton
            onClick={handelDelete}
            isLoading={isLoading}
            icon={<Trash className="text-white" size={16} />}
          >
            {t('accept-delete')}
          </DangerButton>
        </>
      }
    />
  );
};

export default DeleteModal;
