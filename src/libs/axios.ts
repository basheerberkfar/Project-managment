import axios from 'axios';
import i18n from '@/i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  config.headers.set('lang', lang);
  return config;
});

export default api;
