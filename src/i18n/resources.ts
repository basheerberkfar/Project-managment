// english folders
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';
import enAuth from './locales/en/auth.json';
import enProducts from './locales/en/products.json';
// arabic folders
import arCommon from './locales/ar/common.json';
import arSidebar from './locales/ar/sidebar.json';
import arAuth from './locales/ar/auth.json';
import arProducts from './locales/ar/products.json';

export const resources = {
  en: {
    common: enCommon,
    sidebar: enSidebar,
    auth: enAuth,
    products: enProducts,
  },
  ar: {
    common: arCommon,
    sidebar: arSidebar,
    auth: arAuth,
    products: arProducts,
  },
} as const;
