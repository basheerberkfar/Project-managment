import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

// Get saved language from localStorage or use default
const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',

  ns: ['common', 'sidebar', 'auth'],
  defaultNS: 'common',

  interpolation: {
    escapeValue: false,
  },
});

// Save language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);

  // Update document direction based on language
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
const isRTL = savedLanguage === 'ar';
document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;
