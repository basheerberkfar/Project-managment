import { CaretDown } from '@phosphor-icons/react';
import type { SidebarChildItemProps } from './types';

const SidebarChildItem = ({
  hasChild,
  icon,
  label,
  open,
  isCollapsed,
  isActive,
  isChildActive,
  depth = 0,
}: SidebarChildItemProps) => {
  const isNestedItem = depth > 0;
  const isHighlighted = Boolean(isActive || isChildActive);
  const labelClassName = isNestedItem
    ? isHighlighted
      ? 'text-white'
      : 'text-gray-light-500 group-hover:text-white'
    : isHighlighted
      ? 'text-white'
      : 'text-gray-light-500 group-hover:text-white';

  const iconClassName = isNestedItem
    ? isHighlighted
      ? 'text-white'
      : 'text-gray-dark-500 group-hover:text-white'
    : isHighlighted
      ? 'text-white'
      : 'text-gray-dark-500 group-hover:text-white';

  const renderedIcon = icon && <span className={iconClassName}>{icon}</span>;

  return (
    <>
      <div className="flex items-center gap-2">
        {renderedIcon}
        {!isCollapsed && (
          <span
            className={`text-[0.81rem] whitespace-nowrap transition-colors duration-300 ${labelClassName}`}
          >
            {label}
          </span>
        )}
      </div>

      {hasChild && !isCollapsed && (
        <CaretDown
          size={12}
          className={`transition-transform duration-300 ${
            isHighlighted ? 'text-white' : 'text-gray-light-500'
          } ${open ? 'rotate-180' : ''}`}
        />
      )}
    </>
  );
};

export default SidebarChildItem;
