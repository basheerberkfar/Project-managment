export type Item = {
  label: string;
  link?: string;
  icon?: React.ReactNode;
  hasChild?: boolean;
  children?: Item[];
};

export type SidebarChildItemProps = {
  hasChild?: boolean;
  icon?: React.ReactNode;
  label: string;
  open?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
  isChildActive?: boolean;
  depth?: number;
};

export type NavbarItemContainerProps = {
  icon?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};
