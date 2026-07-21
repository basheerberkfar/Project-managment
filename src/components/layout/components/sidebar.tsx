import type React from 'react';
import SidebarList from './sidbar-list';
import clsx from 'clsx';

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobile,
  onItemClick,
}) => {
  return (
    <aside
      className={clsx(
        'h-full overflow-y-auto bg-light-sidebar dark:bg-dark-sidebar border-e border-dark-card-border transition-all duration-300',
        isMobile
          ? isCollapsed
            ? // LTR: slide off to left. RTL: slide off to right (from start side)
              '-translate-x-full rtl:translate-x-full w-0 fixed z-50'
            : // Mobile open: above navbar (z-[60] > nav z-30)
              'translate-x-0 w-64 fixed inset-0 start-0 top-0 shadow-2xl z-[60]'
          : clsx(isCollapsed ? 'w-20' : 'w-[15%] min-w-[200px]', 'z-50')
      )}
    >
      <SidebarList
        isCollapsed={isMobile ? false : isCollapsed}
        onItemClick={onItemClick}
      />
    </aside>
  );
};

export default Sidebar;
