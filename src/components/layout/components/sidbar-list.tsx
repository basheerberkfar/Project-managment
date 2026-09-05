import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SidebarItem from './sidebar-item';
import type { Item } from './types';
import {
  FolderOpen,
  Bell,
  Bank,
  Briefcase,
  ChatCircleDots,
  CalendarDots,
  AddressBook,
  CurrencyDollar,
  FileText,
  Wrench,
  GearSix,
  HandCoins,
  Kanban,
  Note,
  Quotes,
  Receipt,
  Shield,
  SquaresFour,
  Tag,
  UserList,
  UsersThree,
  Wallet,
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
      'users-list': <UserList size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'roles-list': <Shield size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'departments-list': <Bank size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'job-titles-list': <Briefcase size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'cv-analysis': <FileText size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      projects: <FolderOpen size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'projects-list': <Kanban size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      clients: <AddressBook size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'clients-list': <UsersThree size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      financial: <Wallet size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      bills: <Receipt size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      bonds: <HandCoins size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      renewals: <CalendarDots size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      cashiers: <Bank size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      communications: <Bell size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      alerts: <Bell size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      notifications: <Bell size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      chats: <ChatCircleDots size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      messages: <ChatCircleDots size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      notes: <Note size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      occasions: <CalendarDots size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'customer-relations': (
        <AddressBook size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      customers: <AddressBook size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      quotations: <Quotes size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      'task-operations': (
        <Wrench size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      'task-disbursements': (
        <CurrencyDollar size={ICON_SIZE} className={ICONS_CLASSNAME} />
      ),
      tags: <Tag size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      settings: <GearSix size={ICON_SIZE} className={ICONS_CLASSNAME} />,
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
