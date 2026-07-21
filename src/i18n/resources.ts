// english folders
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';
import enAuth from './locales/en/auth.json';
import enClients from './locales/en/clients.json';
import enProjects from './locales/en/projects.json';
import enProducts from './locales/en/products.json';
import enUsersRoles from './locales/en/usersRoles.json';
import enBills from './locales/en/bills.json';
// arabic folders
import arCommon from './locales/ar/common.json';
import arSidebar from './locales/ar/sidebar.json';
import arAuth from './locales/ar/auth.json';
import arClients from './locales/ar/clients.json';
import arProjects from './locales/ar/projects.json';
import arProducts from './locales/ar/products.json';
import arUsersRoles from './locales/ar/usersRoles.json';
import arBills from './locales/ar/bills.json';

export const resources = {
  en: {
    common: enCommon,
    sidebar: enSidebar,
    auth: enAuth,
    clients: enClients,
    projects: enProjects,
    products: enProducts,
    usersRoles: enUsersRoles,
    bills: enBills,
  },
  ar: {
    common: arCommon,
    sidebar: arSidebar,
    auth: arAuth,
    clients: arClients,
    projects: arProjects,
    products: arProducts,
    usersRoles: arUsersRoles,
    bills: arBills,
  },
} as const;
