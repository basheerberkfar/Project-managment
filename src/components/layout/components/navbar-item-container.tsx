import clsx from 'clsx';
import type { NavbarItemContainerProps } from './types';
const NavbarItemContainer = ({
  icon,
  onClick,
  isActive,
}: NavbarItemContainerProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'border cursor-pointer duration-300 transition-all hover:dark:bg-primary-dark-900 hover:bg-gray-light-100 rounded-sm dark:bg-dark-card-background dark:border-dark-card-background border-light-card-border px-[10px] py-2',
        isActive && 'bg-primary-light-500 text-white dark:bg-primary-dark-900'
      )}
    >
      {icon}
    </div>
  );
};

export default NavbarItemContainer;
