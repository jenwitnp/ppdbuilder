export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  color: string;
  path?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  icon: string;
  color: string;
  path?: string;
}
