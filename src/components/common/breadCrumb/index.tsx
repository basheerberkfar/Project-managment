import { House } from '@phosphor-icons/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface BreadCrumbItem {
  label: string;
  link?: string;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
  actions?: React.ReactNode;
  /** When true, breadcrumb stays fixed at top when scrolling */
  sticky?: boolean;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({
  items,
  actions,
  sticky = false,
}) => {
  return (
    <div
      className={`flex min-w-0 flex-wrap items-center justify-between gap-3 overflow-hidden pb-2 transition-all duration-300 dark:border-dark-card-border border-white ${
        sticky
          ? 'sticky -top-8 z-30 pt-6 mb-2 bg-gray-light-100 dark:bg-dark-sidebar shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] isolate'
          : 'border-b'
      }`}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
        <Link
          to="/"
          className="hover:text-primary-light-500 dark:hover:text-focus-primary text-gray-light-700 dark:text-gray-dark-500 transition-colors"
        >
          <House size={20} />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex min-w-0 items-center gap-2">
              <span className="text-gray-light-700 dark:text-gray-dark-500">
                /
              </span>
              {isLast ? (
                <span className="truncate dark:text-focus-primary text-primary-light-500 font-medium">
                  {item.label}
                </span>
              ) : item.link ? (
                <Link
                  to={item.link}
                  className="truncate hover:text-primary-light-500 dark:hover:text-focus-primary text-gray-light-700 dark:text-gray-dark-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-light-700 dark:text-gray-dark-500">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {actions && <div>{actions}</div>}
    </div>
  );
};

export default BreadCrumb;
