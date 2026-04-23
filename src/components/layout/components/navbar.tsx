import React, { useMemo } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import SidebarCollapsedIcon from '@/assets/svgs/sidebar/sidebar-collapsed-icon.svg';
import LogoDark from '@/assets/svgs/sidebar/sidebar-logo.svg';
import LogoLight from '@/assets/svgs/sidebar/white-sidebar-logo.svg';
import ReactHead from '@theprojectsx/react-head';
import { BellRinging, Gear, Sun, Moon, List } from '@phosphor-icons/react';
import NavbarItemContainer from './navbar-item-container';
import { useUIStore } from '@/store/ui.store';
import LanguageMenu from '@/components/common/language-menu';
import UserMenu from '@/components/common/user-menu';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isCollapsed,
  isMobile,
  toggleSidebar,
}) => {
  const pageTitle = usePageTitle();
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const ICON_SIZE = 17;
  const ICON_CLASSNAME = 'text-gray-500 dark:text-primary-dark-500';

  const navbarGroups = useMemo(
    () => [
      [
        {
          icon: <BellRinging size={ICON_SIZE} className={ICON_CLASSNAME} />,
          onClick: () => console.log('Notification clicked'),
        },
      ],
      [
        {
          icon:
            theme === 'dark' ? (
              <Sun size={ICON_SIZE} className={ICON_CLASSNAME} />
            ) : (
              <Moon size={ICON_SIZE} className={ICON_CLASSNAME} />
            ),
          onClick: toggleTheme,
        },
        {
          icon: <LanguageMenu />,
        },
      ],
      [
        {
          icon: <Gear size={ICON_SIZE} className={ICON_CLASSNAME} />,
          onClick: () => navigate('/settings'),
        },
        {
          icon: <UserMenu />,
        },
      ],
    ],
    [theme, toggleTheme, navigate]
  );
  return (
    <>
      <ReactHead>
        <title>{pageTitle} | Secnt World</title>
        <meta name="description" content={`Manage ${pageTitle} section`} />
      </ReactHead>
      <header className="sticky flex w-full top-0 z-30 bg-white dark:bg-dark-navbar shrink-0">
        <div
          className={clsx(
            'px-4 relative py-2 flex items-center transition-all duration-300 shrink-0',
            isMobile
              ? 'w-auto min-w-0 md:w-64 bg-white dark:bg-dark-sidebar border-0'
              : clsx(
                  'bg-light-sidebar dark:bg-dark-sidebar border border-dark-card-border',
                  isCollapsed
                    ? 'w-20 justify-center'
                    : 'w-[15%] min-w-[200px] px-8'
                )
          )}
        >
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="mr-3 text-primary-light-700 dark:text-white"
            >
              <List size={24} />
            </button>
          )}

          <img
            src={LogoLight}
            alt="logo light"
            className={clsx(
              'block dark:hidden',
              isCollapsed && !isMobile ? 'w-8' : 'w-8 md:w-auto'
            )}
          />

          <img
            src={LogoDark}
            alt="logo dark"
            className={clsx(
              'hidden dark:block',
              isCollapsed && !isMobile ? 'w-8' : 'w-8 md:w-auto'
            )}
          />

          {(!isCollapsed || isMobile) && (
            <h1
              className={clsx(
                'text-[0.875rem] font-bold uppercase ml-2 hidden sm:block',
                isMobile
                  ? 'text-primary-light-800 dark:text-white'
                  : 'text-white'
              )}
            >
              <span className="block !font-Playfair text-[10px] md:text-xs">
                Secnt
              </span>
              <span className="block !font-Playfair text-[10px] md:text-xs">
                World
              </span>
            </h1>
          )}

          {!isMobile && (
            <img
              src={SidebarCollapsedIcon}
              alt="collapsed"
              title="collapsed"
              className={clsx(
                'absolute top-[35%] cursor-pointer transition-transform duration-300',
                isCollapsed ? '-end-3' : '-end-[6%]'
              )}
              onClick={toggleSidebar}
            />
          )}
        </div>

        <h3 className="flex-1 min-w-0 font-medium dark:text-dark-primary text-primary-light-500 px-4 md:px-8 flex items-center justify-between gap-2 text-base md:text-lg border dark:border-dark-card-border border-gray-light-500 overflow-hidden">
          {!isMobile && <span className="truncate">{pageTitle}</span>}
          <div
            className={clsx(
              'flex items-center gap-1 md:gap-2 shrink-0',
              isMobile && 'ms-auto'
            )}
          >
            {navbarGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.map((item, itemIndex) =>
                  item.onClick ? (
                    <NavbarItemContainer
                      key={itemIndex}
                      icon={item.icon}
                      onClick={item.onClick}
                    />
                  ) : (
                    <React.Fragment key={itemIndex}>{item.icon}</React.Fragment>
                  )
                )}
                {groupIndex < navbarGroups.length - 1 && (
                  <div
                    key={`divider-${groupIndex}`}
                    className="h-4 w-px dark:bg-dark-card-border bg-light-card-border mx-0.5 md:mx-1"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </h3>
      </header>
    </>
  );
};

export default Navbar;
