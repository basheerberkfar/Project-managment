import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import EnFlag from '@/assets/svgs/navbar/United Kingdom (GB).svg';
import ArFlag from '@/assets/svgs/navbar/United Arab Emirates (AE).svg';
import NavbarItemContainer from '@/components/layout/components/navbar-item-container';
import { Translate } from '@phosphor-icons/react';
import clsx from 'clsx';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: EnFlag },
  { code: 'ar', name: 'Arabic', flag: ArFlag },
];

const LanguageMenu: React.FC = () => {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Update menu position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isRTL = document.dir === 'rtl' || i18n.language === 'ar';

      setMenuPosition({
        top: rect.bottom + 20, // 8px gap below trigger
        left: isRTL ? rect.left : rect.right - 240, // 240px is menu width
      });
      setIsPositionCalculated(true);
    } else {
      setIsPositionCalculated(false);
    }
  }, [isOpen, i18n.language]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const portalRoot = document.getElementById('portal-root');

  return (
    <>
      <div ref={triggerRef}>
        {/* Trigger Button */}
        <NavbarItemContainer
          icon={
            <Translate
              size={17}
              className={clsx(
                'text-gray-500 dark:text-primary-dark-500',
                isOpen && 'text-white'
              )}
            />
          }
          onClick={() => setIsOpen(!isOpen)}
          isActive={isOpen}
        />
      </div>

      {/* Dropdown Menu - Rendered as Portal */}
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
            {/* Arrow Pointer */}
            <div
              className="absolute -top-2 w-4 h-4 bg-white dark:bg-dark-card-background border-t dark:border-dark-card-border border-light-card-border border-l transform rotate-45 shadow-sm"
              style={{
                right: i18n.language === 'ar' ? 'auto' : '16px',
                left: i18n.language === 'ar' ? '16px' : 'auto',
              }}
            />

            {/* Menu Header */}
            <div className="px-4 py-3 border-b rounded-t-2xl dark:border-dark-card-border border-light-card-border relative z-10 bg-white dark:bg-dark-card-background">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('languages')}
              </h3>
            </div>

            {/* Language Options */}
            <div className="relative rounded-b-[8px] overflow-hidden z-10 bg-white dark:bg-dark-card-background">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-3 cursor-pointer py-3 flex items-center gap-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-dark-card-surface ${
                    currentLanguage.code === language.code
                      ? 'bg-gray-50 dark:bg-dark-card-surface'
                      : ''
                  }`}
                >
                  <img
                    src={language.flag}
                    className="border-e border-light-card-border dark:border-dark-card-border pe-2"
                    alt={language.name}
                  />
                  <span className="text-[.812rem] text-gray-700 dark:text-gray-300">
                    {language.name}
                  </span>
                </button>
              ))}
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
};

export default LanguageMenu;
