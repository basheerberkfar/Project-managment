import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

export type SectionNavigationItem = {
  key: string;
  translationKey: string;
  icon?: ReactNode;
};

type SectionNavigationProps = {
  title: string;
  items: SectionNavigationItem[];
  basePath: string;
  namespace: string;
};

export default function SectionNavigation({
  title,
  items,
  basePath,
  namespace,
}: SectionNavigationProps) {
  const { t } = useTranslation(namespace);

  return (
    <div className="rounded-[14px] border border-gray-light-500 bg-white p-3 md:p-4 dark:border-dark-card-border dark:bg-dark-card-background">
      <h2 className="mb-3 text-lg font-medium text-gray-light-900 dark:text-white">
        {title}
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-x-visible">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={`${basePath}/${item.key}`}
            className={({ isActive }) =>
              clsx(
                'flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors xl:min-w-0',
                isActive
                  ? 'bg-primary-light-500 text-white'
                  : 'text-gray-light-700 hover:bg-gray-light-100 dark:text-gray-dark-400 dark:hover:bg-dark-card-surface'
              )
            }
          >
            {item.icon ? <span>{item.icon}</span> : null}
            <span>{t(item.translationKey)}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
