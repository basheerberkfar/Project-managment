import { useTranslation } from 'react-i18next';
import SidebarItem from './sidebar-item';
import type { Item } from './types';
import { Shield, SquaresFour, Users } from '@phosphor-icons/react';

interface SidebarListProps {
  isCollapsed: boolean;
}

const SidebarList = ({ isCollapsed }: SidebarListProps) => {
  const { t } = useTranslation('sidebar');
  const ICON_SIZE = 17;
  const ICONS_CLASSNAME =
    'text-gray-dark-500 group-hover:text-white transition-all duration-500';

  const sidebarItems: Item[] = [
    {
      label: t('dashboard'),
      link: '/dashboard',
      icon: <SquaresFour size={ICON_SIZE} className={ICONS_CLASSNAME} />,
    },
    {
      label: t('management'),
      hasChild: true,
      icon: <Shield size={ICON_SIZE} className={ICONS_CLASSNAME} />,
      children: [
        {
          label: t('users'),
          link: '/users',
          icon: <Users size={16} className={ICONS_CLASSNAME} />,
        },
        {
          label: t('roles'),
          link: '/roles',
          icon: <Shield size={16} className={ICONS_CLASSNAME} />,
        },
      ],
    },
  ];

  return (
    <ul className="px-6 py-4.5 space-y-1">
      {sidebarItems.map((item) => (
        <SidebarItem key={item.label} {...item} isCollapsed={isCollapsed} />
      ))}
    </ul>
  );
};

export default SidebarList;
