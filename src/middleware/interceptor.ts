import api from '@/libs/axios';
import { clearAuthSession, getAuthToken } from '@/utils/helpers';

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        clearAuthSession();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;

      case 403:
        console.error('Access denied - 403');
        break;

      case 500:
        console.error('Server error - 500');
        break;

      default:
        console.error('An error occurred:', error);
    }

    return Promise.reject(error);
  }
);
