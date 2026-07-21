import api from '@/libs/axios';
import { ROUTE } from './auth.routes';
import type {
  AuthUser,
  CheckEmailRequest,
  LoginApiResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshRequest,
  RefreshResponse,
} from './auth.types';

type LoginEnvelope = {
  data: LoginApiResponse;
  message?: string;
};

type RefreshEnvelope = {
  data: LoginApiResponse | RefreshResponse;
  message?: string;
};

const hasTokenPayload = (
  value: unknown
): value is LoginApiResponse | RefreshResponse =>
  typeof value === 'object' &&
  value !== null &&
  'accessToken' in value &&
  'refreshToken' in value &&
  'expiresAtUtc' in value;

const normalizeAuthUser = (user: LoginApiResponse['user'] | AuthUser): AuthUser => {
  const permissions = Array.isArray(user.permissions)
    ? user.permissions.filter((permission): permission is string =>
        typeof permission === 'string'
      )
    : Array.isArray((user as AuthUser).permission)
      ? (user as AuthUser).permission.filter(
          (permission): permission is string => typeof permission === 'string'
        )
      : [];

  return {
    id: user.id,
    full_name:
      'full_name' in user && typeof user.full_name === 'string'
        ? user.full_name
        : user.name ?? '',
    name: 'name' in user && typeof user.name === 'string' ? user.name : undefined,
    email: user.email,
    status: 'status' in user ? (user.status ?? undefined) : undefined,
    is_default: 'is_default' in user ? (user.is_default ?? undefined) : undefined,
    is_admin:
      'is_admin' in user
        ? Number(user.is_admin ?? 0)
        : user.isAdmin
          ? 1
          : 0,
    isAdmin:
      'isAdmin' in user
        ? Boolean(user.isAdmin)
        : 'is_admin' in user
          ? Boolean(user.is_admin)
          : false,
    contract_start_date:
      'contract_start_date' in user ? (user.contract_start_date ?? null) : null,
    contract_end_date:
      'contract_end_date' in user ? (user.contract_end_date ?? null) : null,
    residency_type:
      'residency_type' in user ? (user.residency_type ?? null) : null,
    residency_end_date:
      'residency_end_date' in user ? (user.residency_end_date ?? null) : null,
    role: 'role' in user ? (user.role ?? null) : null,
    roles: 'roles' in user && Array.isArray(user.roles) ? user.roles : [],
    branch: 'branch' in user ? (user.branch ?? null) : null,
    created_at:
      'created_at' in user && typeof user.created_at === 'string'
        ? user.created_at
        : '',
    permissions,
    permission: permissions,
    image: 'image' in user ? (user.image ?? null) : null,
  };
};

const normalizeLoginResponse = (
  response: LoginApiResponse | LoginEnvelope
): LoginResponse => {
  const payload = hasTokenPayload(response)
    ? response
    : hasTokenPayload(response.data)
      ? response.data
      : null;
  const message = 'message' in response ? response.message : undefined;

  if (!payload) {
    throw new Error('Invalid login response');
  }

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    expiresAtUtc: payload.expiresAtUtc,
    user: normalizeAuthUser(payload.user),
    message,
  };
};

const normalizeRefreshResponse = (
  response:
    | LoginApiResponse
    | RefreshResponse
    | RefreshEnvelope
): RefreshResponse => {
  const payload = hasTokenPayload(response)
    ? response
    : hasTokenPayload(response.data)
      ? response.data
      : null;

  if (!payload) {
    throw new Error('Invalid refresh response');
  }

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    expiresAtUtc: payload.expiresAtUtc,
    user: payload.user ? normalizeAuthUser(payload.user) : undefined,
    message:
      'message' in response
        ? response.message
        : 'message' in payload
          ? payload.message
          : undefined,
  };
};

const normalizeMeResponse = (response: MeResponse): AuthUser => {
  if ('user' in response && response.user) {
    return normalizeAuthUser(response.user);
  }

  if ('data' in response && response.data) {
    return normalizeAuthUser(response.data);
  }

  if ('result' in response && response.result) {
    return normalizeAuthUser(response.result);
  }

  if ('id' in response && 'email' in response) {
    return normalizeAuthUser(response);
  }

  throw new Error('Invalid me response');
};

export const authApi = {
  checkEmail: async (data: CheckEmailRequest) => {
    const response = await api.post(`${ROUTE.BASE}/check-email`, data);
    return response.data;
  },
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginApiResponse | LoginEnvelope>(
      ROUTE.LOGIN,
      data
    );
    return normalizeLoginResponse(response.data);
  },
  refresh: async (data: RefreshRequest) => {
    const response = await api.post<
      LoginApiResponse | RefreshResponse | RefreshEnvelope
    >(ROUTE.REFRESH, data, {
      headers: {
        Authorization: undefined,
      },
    });
    return normalizeRefreshResponse(response.data);
  },
  me: async () => {
    const response = await api.get<MeResponse>(ROUTE.ME);
    return normalizeMeResponse(response.data);
  },
  logout: async () => {
    const response = await api.post(ROUTE.LOGOUT);
    return response.data;
  },
};
