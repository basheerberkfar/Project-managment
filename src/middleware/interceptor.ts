import api from '@/libs/axios';
import { authApi } from '@/services/auth/auth.endpoints';
import { ROUTE } from '@/services/auth/auth.routes';
import {
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setAuthUser,
  setRefreshToken,
} from '@/utils/helpers';

type RetryableRequestConfig = {
  url?: string;
  headers?: {
    Authorization?: string;
  };
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const storedRefreshToken = getRefreshToken();

  if (!storedRefreshToken) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = authApi
      .refresh({
        refreshToken: storedRefreshToken,
      })
      .then((response) => {
        setAuthToken(response.accessToken);
        setRefreshToken(response.refreshToken);

        if (response.user) {
          setAuthUser(response.user);
        }

        return response.accessToken;
      })
      .catch((error) => {
        clearAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

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
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    switch (status) {
      case 401:
        if (
          originalRequest?.url?.includes(ROUTE.REFRESH) ||
          !originalRequest ||
          originalRequest._retry
        ) {
          clearAuthSession();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        }

        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const accessToken = await refreshAccessToken();

            if (accessToken) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${accessToken}`,
              };

              return api(originalRequest);
            }
          } catch {
            // Fall through to redirect after refresh failure.
          }
        }

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
