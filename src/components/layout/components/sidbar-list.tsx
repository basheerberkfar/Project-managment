import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarItem from './sidebar-item';
import type { Item } from './types';
import {
  Briefcase,
  IdentificationCard,
  Receipt,
  Shield,
  SquaresFour,
  UsersThree,
} from '@phosphor-icons/react';
import {
  filterSidebarSchema,
  getSidebarPermissionContext,
  SIDEBAR_SCHEMA,
  type SidebarSchemaItem,
} from './sidebar-schema';

interface SidebarListProps {
  isCollapsed: boolean;
  onItemClick?: () => void;
}

const SidebarList = ({ isCollapsed, onItemClick }: SidebarListProps) => {
  const { t } = useTranslation('sidebar');
  const ICON_SIZE = 17;
  const ICONS_CLASSNAME = 'transition-all duration-500';

  const iconByKey = useMemo<Record<string, React.ReactNode>>(
    () => ({
      dashboard: <SquaresFour size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'users-roles': <Shield size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'users-list': <UsersThree size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'roles-list': <Shield size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'departments-list': (
        <IdentificationCard size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      'job-titles-list': (
        <IdentificationCard size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      'projects-list': (
        <Briefcase size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      'bills-list': (
        <Receipt size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
    }),
    [ICONS_CLASSNAME, ICON_SIZE]
  );

  const sidebarItems = useMemo<Item[]>(() => {
    const { permissionNames, isAdmin } = getSidebarPermissionContext();
    const visibleSchema = filterSidebarSchema(
      SIDEBAR_SCHEMA,
      permissionNames,
      isAdmin
    );

    const mapSchemaToItems = (items: SidebarSchemaItem[]): Item[] =>
      items.map((item) => {
        const children = item.children?.length
          ? mapSchemaToItems(item.children)
          : undefined;

        return {
          label: t(item.labelKey),
          link: item.link,
          icon: iconByKey[item.key],
          hasChild: Boolean(children?.length),
          children,
        };
      });

    return mapSchemaToItems(visibleSchema);
  }, [iconByKey, t]);

  return (
    <ul className="px-6 py-4.5 space-y-1">
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.label}
          {...item}
          isCollapsed={isCollapsed}
          depth={0}
          onNavigate={onItemClick}
        />
      ))}
    </ul>
  );
};

export default SidebarList;
