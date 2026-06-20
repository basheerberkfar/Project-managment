// english folders
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';
import enAuth from './locales/en/auth.json';
import enClients from './locales/en/clients.json';
import enProducts from './locales/en/products.json';
import enUsersRoles from './locales/en/usersRoles.json';
// arabic folders
import arCommon from './locales/ar/common.json';
import arSidebar from './locales/ar/sidebar.json';
import arAuth from './locales/ar/auth.json';
import arClients from './locales/ar/clients.json';
import arProducts from './locales/ar/products.json';
import arUsersRoles from './locales/ar/usersRoles.json';

export const resources = {
  en: {
    common: enCommon,
    sidebar: enSidebar,
    auth: enAuth,
    clients: enClients,
    products: enProducts,
    usersRoles: enUsersRoles,
  },
  ar: {
    common: arCommon,
    sidebar: arSidebar,
    auth: arAuth,
    clients: arClients,
    products: arProducts,
    usersRoles: arUsersRoles,
  },
} as const;
