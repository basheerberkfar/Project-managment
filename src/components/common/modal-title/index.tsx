import type React from 'react';
import clsx from 'clsx';
type ModalTitleType = {
  title: string | React.ReactNode;
  icon: React.ReactNode;
  iconBackground?: string;
};

const ModalTitle: React.FC<ModalTitleType> = ({
  icon,
  title,
  iconBackground,
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div
        className={clsx(
          'w-[44px] grid place-items-center h-[44px]  rounded-full p-2.5',
          iconBackground
        )}
      >
        {icon}
      </div>
      <h4 className="font-medium text-black dark:text-white text-[1.25rem] leading-[28px]">
        {title}
      </h4>
    </div>
  );
};

export default ModalTitle;
