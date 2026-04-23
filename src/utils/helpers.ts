import type { LocalizedText } from '@/types/localization-text';
import type { AuthUser } from '@/services/auth/auth.types';
import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'graduation';
const AUTH_USER_STORAGE_KEY = 'luxury-branch-user';
const LEGACY_AUTH_STORAGE_KEY = 'auth';

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: 'strict',
  });
};

export const getAuthToken = () => Cookies.get(AUTH_TOKEN_KEY);

export const clearAuthToken = () => Cookies.remove(AUTH_TOKEN_KEY);

export const setAuthUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const clearAuthSession = () => {
  clearAuthToken();
  clearAuthUser();
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
};

export function addEveryThreeDigits(
  value: number | null | undefined,
  separator: string = ','
) {
  if (value == null || Number.isNaN(Number(value))) return '0';
  const str = Number(value).toString();
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function resolveText(
  text: string | LocalizedText | unknown[] | null | undefined,
  lang: 'en' | 'ar'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (Array.isArray(text)) return '';
  return text[lang] || text[lang === 'en' ? 'ar' : 'en'] || '';
}

export const formatDateForApi = (value: Date | null) => {
  if (!value) return undefined;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatDate = (value?: string | null) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toBase64 = (value: string) => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(value);
  }

  return value;
};

const fromBase64 = (value: string) => {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(value);
  }

  return value;
};

export const encodeRouteId = (value: string | number) => {
  const normalized = String(value).trim();
  if (!normalized) return '';

  return toBase64(normalized)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

export const decodeRouteId = (value?: string | null) => {
  if (!value) return '';

  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = normalized + (padding ? '='.repeat(4 - padding) : '');

  try {
    return fromBase64(padded);
  } catch {
    return value;
  }
};

export const getApiSuccessMessage = (
  response: unknown,
  fallbackMessage: string
) => {
  const message = (
    response as {
      data?: {
        message?: unknown;
      };
    }
  )?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallbackMessage;
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  const responseData = (
    error as {
      response?: {
        data?: {
          message?: unknown;
          error?: unknown;
          detail?: unknown;
          errors?: Record<string, unknown>;
        };
      };
    }
  )?.response?.data;

  const message =
    responseData?.message ?? responseData?.error ?? responseData?.detail;

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  const errors = responseData?.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    for (const value of Object.values(errors)) {
      if (
        Array.isArray(value) &&
        typeof value[0] === 'string' &&
        value[0].trim()
      ) {
        return value[0].trim();
      }

      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};
