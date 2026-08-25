// english folders
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';
import enAuth from './locales/en/auth.json';
import enClients from './locales/en/clients.json';
import enProducts from './locales/en/products.json';
import enUsersRoles from './locales/en/usersRoles.json';
import enProjects from './locales/en/projects.json';
import enFinance from './locales/en/finance.json';
import enManagement from './locales/en/management.json';
import enChats from './locales/en/chats.json';
import enSettings from './locales/en/settings.json';
import enDashboard from './locales/en/dashboard.json';
// arabic folders
import arCommon from './locales/ar/common.json';
import arSidebar from './locales/ar/sidebar.json';
import arAuth from './locales/ar/auth.json';
import arClients from './locales/ar/clients.json';
import arProducts from './locales/ar/products.json';
import arUsersRoles from './locales/ar/usersRoles.json';
import arProjects from './locales/ar/projects.json';
import arFinance from './locales/ar/finance.json';
import arManagement from './locales/ar/management.json';
import arChats from './locales/ar/chats.json';
import arSettings from './locales/ar/settings.json';
import arDashboard from './locales/ar/dashboard.json';

export const resources = {
  en: {
    common: enCommon,
    sidebar: enSidebar,
    auth: enAuth,
    clients: enClients,
    products: enProducts,
    usersRoles: enUsersRoles,
    projects: enProjects,
    finance: enFinance,
    management: enManagement,
    chats: enChats,
    settings: enSettings,
    dashboard: enDashboard,
  },
  ar: {
    common: arCommon,
    sidebar: arSidebar,
    auth: arAuth,
    clients: arClients,
    products: arProducts,
    usersRoles: arUsersRoles,
    projects: arProjects,
    finance: arFinance,
    management: arManagement,
    chats: arChats,
    settings: arSettings,
    dashboard: arDashboard,
  },
} as const;
