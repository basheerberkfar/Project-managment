import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Item } from './types';
import SidebarChildItem from './sidebar-child-item';
import clsx from 'clsx';
import SidebarPopover from './sidebar-popover';

interface SidebarItemProps extends Item {
  isCollapsed: boolean;
  depth?: number;
  onNavigate?: () => void;
}

const SidebarItem = ({
  label,
  link,
  icon,
  hasChild,
  children,
  isCollapsed,
  depth = 0,
  onNavigate,
}: SidebarItemProps) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isNestedItem = depth > 0;

  const isRouteMatch = (target?: string) => {
    if (!target) return false;

    // Normalize paths for comparison
    const currentPath = location.pathname.replace(/\/+$/, '');
    const targetPath = target.replace(/\/+$/, '');

    // Exact match for list pages
    const listPages = ['/products'];
    if (listPages.includes(targetPath)) {
      return currentPath === targetPath;
    }

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
  };

  const hasActiveChild = Boolean(
    children?.some(
      (child) =>
        isRouteMatch(child.link) ||
        child.children?.some((nestedChild) => isRouteMatch(nestedChild.link))
    )
  );

  const isDirectlyActive = isRouteMatch(link);
  const isExpanded = open || hasActiveChild;

  const ItemContent = (
    <SidebarChildItem
      label={label}
      hasChild={hasChild}
      icon={icon}
      open={isExpanded}
      isCollapsed={isCollapsed}
      isActive={isDirectlyActive}
      isChildActive={hasActiveChild}
      depth={depth}
    />
  );

  const buttonClasses = clsx(
    'flex w-full min-w-0 items-center group transition-all duration-300',
    isNestedItem ? 'min-h-9 px-3 py-2 rounded-md' : 'p-2 rounded-md',
    isNestedItem
      ? isDirectlyActive
        ? 'bg-[#3F6D6A]'
        : hasActiveChild
          ? 'bg-[#4FA3A014]'
          : 'hover:bg-[#4FA3A014]'
      : isDirectlyActive
        ? 'bg-[#163432]'
        : hasActiveChild
          ? 'bg-[#214543]'
          : 'hover:bg-[#4FA3A033]',
    isCollapsed ? 'justify-center' : 'justify-between'
  );

  if (isCollapsed) {
    return (
      <SidebarPopover item={{ label, icon, children, link }}>
        {link ? (
          <Link to={link} className={buttonClasses} onClick={onNavigate}>
            {ItemContent}
          </Link>
        ) : (
          <button type="button" className={buttonClasses}>
            {ItemContent}
          </button>
        )}
      </SidebarPopover>
    );
  }

  if (hasChild) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={buttonClasses}
        >
          {ItemContent}
        </button>
        {isExpanded && (
          <div className="mt-1 w-full space-y-1 border-s border-[#1E3B39] ps-2 md:ps-3 ">
            {children?.map((child) => (
              <SidebarItem
                key={child.label}
                {...child}
                isCollapsed={isCollapsed}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={link!} className={buttonClasses} onClick={onNavigate}>
      {ItemContent}
    </Link>
  );
};

export default SidebarItem;
