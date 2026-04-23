import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SignOut, User } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import NavbarItemContainer from '@/components/layout/components/navbar-item-container';
import { useLogoutMutation } from '@/services/auth/auth.mutation';
import { clearAuthSession, getAuthUser } from '@/utils/helpers';

const UserMenu: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = getAuthUser();
  const portalRoot = document.getElementById('portal-root');

  const closeMenu = () => setIsOpen(false);

  const logout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const { mutate: logoutMutation, isPending } = useLogoutMutation({
    onSuccess: logout,
    onError: logout,
  });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isRTL = document.dir === 'rtl' || i18n.language === 'ar';

      setMenuPosition({
        top: rect.bottom + 20,
        left: isRTL ? rect.left : rect.right - 240,
      });
      setIsPositionCalculated(true);
    } else {
      setIsPositionCalculated(false);
    }
  }, [i18n.language, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef}>
        <NavbarItemContainer
          icon={
            <User
              size={17}
              className={clsx(
                'text-gray-500 dark:text-primary-dark-500',
                isOpen && 'text-white'
              )}
            />
          }
          onClick={() => setIsOpen((prev) => !prev)}
          isActive={isOpen}
        />
      </div>

      {isOpen &&
        isPositionCalculated &&
        portalRoot &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed min-w-[240px] bg-white dark:bg-dark-card-background border dark:border-dark-card-border border-light-card-border rounded-[8px] overflow-visible z-9999"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              boxShadow: '0px 2px 4px 0px #00000008',
            }}
          >
            <div
              className="absolute -top-2 w-4 h-4 bg-white dark:bg-dark-card-background border-t dark:border-dark-card-border border-light-card-border border-l transform rotate-45 shadow-sm"
              style={{
                right: i18n.language === 'ar' ? 'auto' : '16px',
                left: i18n.language === 'ar' ? '16px' : 'auto',
              }}
            />

            <div className="px-4 py-3 border-b rounded-t-2xl dark:border-dark-card-border border-light-card-border relative z-10 bg-white dark:bg-dark-card-background">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {user?.full_name ?? t('account')}
              </h3>
              <p className="mt-1 text-xs text-gray-light-800 dark:text-gray-dark-200">
                {user?.email ?? ''}
              </p>
            </div>

            <div className="relative rounded-b-[8px] overflow-hidden z-10 bg-white dark:bg-dark-card-background">
              <button
                type="button"
                onClick={() => logoutMutation()}
                disabled={isPending}
                className="w-full px-3 py-3 flex items-center gap-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-dark-card-surface disabled:opacity-60"
              >
                <SignOut size={16} className="text-danger-500" />
                <span className="text-[.812rem] text-gray-700 dark:text-gray-300">
                  {t('logout')}
                </span>
              </button>
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
};

export default UserMenu;
