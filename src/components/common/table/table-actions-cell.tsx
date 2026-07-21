import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { DotsThreeVertical } from '@phosphor-icons/react';
import clsx from 'clsx';
import i18n from '@/i18n';

/** Variant for action icon hover color */
export type TableActionVariant = 'primary' | 'danger' | 'warning' | 'default';

export interface TableActionItem<T = unknown> {
  id: string;
  icon: ReactNode;
  label: string;
  onClick: (row: T) => void;
  /** Optional row-based visibility check */
  isVisible?: (row: T) => boolean;
  /** Permission key to check; if no checker provided or checker returns true, action is shown */
  permission?: string;
  /** Hover color variant for the icon (primary=teal, danger=red, warning=amber) */
  variant?: TableActionVariant;
}

export interface TableActionsCellProps<T> {
  row: T;
  actions: TableActionItem<T>[];
  /** Returns true if user is allowed for the given permission key */
  checkPermission?: (permission: string) => boolean;
  /** Max number of actions to show as icons; above this, use dropdown */
  maxIcons?: number;
}

const MENU_OFFSET = 4;
const MENU_MIN_HEIGHT = 120;

const variantHoverClasses: Record<
  NonNullable<TableActionItem['variant']>,
  string
> = {
  default: 'hover:text-primary-dark-500',
  primary: 'hover:text-primary-dark-500 dark:hover:text-primary-dark-400',
  danger: 'hover:text-danger-500 dark:hover:text-danger-400',
  warning: 'hover:text-warning-500 dark:hover:text-warning-400',
};

export function TableActionsCell<T>({
  row,
  actions,
  checkPermission,
  maxIcons = 3,
}: TableActionsCellProps<T>) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const allowed = actions.filter(
    (a) =>
      (a.isVisible ? a.isVisible(row) : true) &&
      (!a.permission || (checkPermission && checkPermission(a.permission)))
  );

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openAbove = spaceBelow < MENU_MIN_HEIGHT && spaceAbove > spaceBelow;
      const MENU_WIDTH = 180; // أو نفس min-w
      const isRTL = i18n.language === 'ar';
      const top = openAbove
        ? rect.top - MENU_MIN_HEIGHT - MENU_OFFSET
        : rect.bottom + MENU_OFFSET;
      const left = isRTL
        ? rect.left // RTL (مثل الآن)
        : rect.right - MENU_WIDTH;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuPosition({ top, left });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open]);

  if (allowed.length === 0) return null;

  const showAsIcons = allowed.length <= maxIcons;
  const portalRoot = document.getElementById('portal-root');

  const getVariantHover = (variant?: TableActionVariant) =>
    variantHoverClasses[variant ?? 'default'];

  const renderActionButton = (action: TableActionItem<T>) => (
    <button
      key={action.id}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        action.onClick(row);
        setOpen(false);
      }}
      className={clsx(
        'flex items-center gap-2 w-full px-3 py-2 text-start text-sm text-gray-light-800 dark:text-dark-primary hover:bg-gray-light-200 dark:hover:bg-dark-card-surface transition-colors rounded cursor-pointer',
        getVariantHover(action.variant)
      )}
      title={action.label}
    >
      <span className="flex-shrink-0 [&>svg]:size-[1.1em] [&>svg]:shrink-0">
        {action.icon}
      </span>
      <span>{action.label}</span>
    </button>
  );

  return (
    <div
      className="flex  items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {showAsIcons ? (
        <div className="flex items-center gap-2">
          {allowed.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              className={clsx(
                'text-gray-light-700 dark:text-dark-secondary transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-light-200 dark:hover:bg-dark-card-surface',
                getVariantHover(action.variant)
              )}
              title={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className={clsx(
              'p-1 rounded-md cursor-pointer transition-colors text-gray-light-700 dark:text-dark-secondary hover:text-primary-dark-500 hover:bg-gray-light-200 dark:hover:bg-dark-card-surface',
              open &&
                'text-primary-dark-500 bg-gray-light-200 dark:bg-dark-card-surface'
            )}
            title="Actions"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <DotsThreeVertical size={18} weight="bold" />
          </button>

          {open &&
            portalRoot &&
            createPortal(
              <div
                ref={menuRef}
                className="fixed z-[9999] min-w-[180px] py-1.5 bg-white dark:bg-dark-card-background border border-gray-light-500 dark:border-dark-card-border rounded-lg shadow-xl"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
              >
                {allowed.map(renderActionButton)}
              </div>,
              portalRoot
            )}
        </>
      )}
    </div>
  );
}
