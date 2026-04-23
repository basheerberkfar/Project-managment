import { useUIStore } from '@/store/ui.store';
import { Moon, Sun } from '@phosphor-icons/react';
import { useMemo } from 'react';
import Logo from '@/assets/svgs/auth/auth-primary-logo.svg';
import NavbarItemContainer from '@/components/layout/components/navbar-item-container';
import LanguageMenu from '@/components/common/language-menu';

const AnonymsNavbar = () => {
  const ICON_SIZE = 17;
  const ICON_CLASSNAME = 'text-gray-500 dark:text-primary-dark-500';
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const navbarGroups = useMemo(
    () => [
      {
        icon:
          theme === 'dark' ? (
            <Sun size={ICON_SIZE} className={ICON_CLASSNAME} />
          ) : (
            <Moon size={ICON_SIZE} className={ICON_CLASSNAME} />
          ),
        onClick: toggleTheme,
      },
    ],
    [theme, toggleTheme]
  );
  return (
    <div className="flex items-center border dark:border-dark-card-border border-light-card-border justify-between w-full h-fit py-3.5 px-8">
      <img src={Logo} alt="logo" />
      <div className="flex items-center gap-2">
        {navbarGroups.map((group, groupIndex) => (
          <NavbarItemContainer
            key={groupIndex}
            icon={group.icon}
            onClick={group.onClick}
          />
        ))}
        <LanguageMenu />
      </div>
    </div>
  );
};

export default AnonymsNavbar;
