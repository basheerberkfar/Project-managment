import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import type { Item } from './types';
import i18n from '@/i18n';
import clsx from 'clsx';

interface SidebarPopoverProps {
  item: Item;
  children: React.ReactNode;
}

const SidebarPopover: React.FC<SidebarPopoverProps> = ({ item, children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
        right: 60,
      });
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative flex items-center w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isOpen &&
        createPortal(
          <div
            className="fixed z-9999 flex items-center pointer-events-auto group/popover"
            style={{
              top: coords.top,
              left: i18n.language === 'ar' ? 'auto' : coords.left,
              right: i18n.language === 'ar' ? coords.right : 'auto',
              transform: 'translate(0, -50%)',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Arrow */}
            <div
              className={clsx(
                'w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white dark:border-r-dark-card-background drop-shadow-[-2px_0_2px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-left-2 duration-200',
                i18n.language === 'ar'
                  ? 'border-l-white dark:border-l-dark-card-background rotate-180'
                  : 'border-r-white dark:border-r-dark-card-background'
              )}
            />

            {/* Content Container */}
            <div className="bg-white dark:bg-dark-card-background border border-gray-100 dark:border-dark-card-border rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] min-w-[220px] overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div className="text-primary-light-500 dark:text-primary-dark-500 flex items-center justify-center">
                  {React.isValidElement(item.icon)
                    ? React.cloneElement(
                        item.icon as React.ReactElement<{ size?: number }>,
                        {
                          size: 15,
                        }
                      )
                    : item.icon}
                </div>
                <span className="text-sm text-gray-800 dark:text-[#E6EAEA]">
                  {item.label}
                </span>
              </div>

              {/* Divider and Links List */}
              {item.children && item.children.length > 0 && (
                <>
                  <div className="h-px bg-gray-100 dark:bg-dark-card-border" />
                  <div className="py-1">
                    {item.children.map((child) => {
                      const childIsActive =
                        child.link &&
                        (location.pathname === child.link ||
                          location.pathname.startsWith(`${child.link}/`));
                      return (
                        <Link
                          key={child.label}
                          to={childIsActive ? '#' : child.link || '#'}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-primary-dark-500/10 group transition-all duration-200',
                            childIsActive && 'pointer-events-none opacity-50'
                          )}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-light-500 dark:group-hover:bg-primary-dark-500 transition-all duration-200" />
                          <span className="text-sm text-gray-500 dark:text-dark-secondary group-hover:text-primary-light-500 dark:group-hover:text-primary-dark-500">
                            {child.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SidebarPopover;
