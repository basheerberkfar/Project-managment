import { Plus } from '@phosphor-icons/react';
import { SecondaryButton, PrimaryButton } from '../../ui/button/index';

type PagesHeaderType = {
  secondaryText?: string | React.ReactNode;
  onSecondaryClick?: () => void;
  btnText?: string | React.ReactNode;
  btnIcon?: React.ReactNode;
  btnLoading?: boolean;
  primaryDisabled?: boolean;
  onClick?: (e?: React.FormEvent) => void;
  primaryButtonType?: 'button' | 'submit';
};

const PagesHeader = ({
  secondaryText,
  onSecondaryClick,
  btnText,
  btnIcon,
  btnLoading,
  primaryDisabled = false,
  onClick,
  primaryButtonType = 'button',
}: PagesHeaderType) => {
  return (
    <div className="flex items-center w-full justify-between">
      <div className="flex gap-2 flex-row-reverse">
        {secondaryText != null && (
          <SecondaryButton
            type="button"
            className={btnIcon ? 'w-[40px]' : 'w-fit'}
            onClick={onSecondaryClick}
          >
            {secondaryText}
          </SecondaryButton>
        )}
        {(btnText || btnIcon) && (
          <PrimaryButton
            type={primaryButtonType}
            className={btnIcon ? 'w-[40px] pe-6' : 'w-fit'}
            icon={btnIcon || <Plus size={14} />}
            isSubmitting={btnLoading}
            disabled={primaryDisabled}
            IconSize={14}
            onClick={onClick}
          >
            {btnText}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

export default PagesHeader;
