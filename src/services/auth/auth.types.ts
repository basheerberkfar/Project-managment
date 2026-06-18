import type {
  PermissionAction,
  PermissionGroup,
} from '@/constants/permissions';
import type { ApiDetailResponse } from '@/types/apis';

export type CheckEmailRequest = {
  email: string;
};

export type EmailCheckBranch = {
  id: number;
  name?: string | null;
  full_name?: string | null;
  status: number | string | null;
};

export type CheckEmailResponse = {
  success: boolean;
  message: string;
  data: {
    has_multiple_branches: boolean;
    branches: EmailCheckBranch[];
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserRolePermissions = Partial<
  Record<
    PermissionGroup,
    Record<string, Partial<Record<PermissionAction, number>>>
  >
>;

export type AuthRole = {
  id: number;
  name: string;
  is_default: number;
  users_count: number;
  permissions: UserRolePermissions;
};

export type AuthBranch = {
  id: number;
  full_name: string | null;
  description: string | null;
  phone_number: string | null;
  mobile_number: string | null;
  address: string | null;
  email: string | null;
  location_lat: string | null;
  location_lng: string | null;
  print_margin_top: string | null;
  print_margin_bottom: string | null;
  logo_image: string | null;
  print_template_ar: string | null;
  print_template_en: string | null;
};

export type AuthUser = {
  id: number | string;
  full_name: string;
  name?: string;
  email: string;
  status?: number;
  is_default?: number;
  is_admin: number;
  isAdmin?: boolean;
  contract_start_date: string | null;
  contract_end_date: string | null;
  residency_type: string | null;
  residency_end_date: string | null;
  role?: AuthRole | null;
  roles: AuthRole[];
  branch: AuthBranch | null;
  created_at: string;
  permissions?: string[];
  permission: string[];
  image: string | null;
};

export type LoginApiResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  user: {
    id: number | string;
    name: string;
    email: string;
    isAdmin: boolean;
    permissions: string[];
  };
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
};

export type LoginResponse = AuthTokens & {
  user: AuthUser;
  message?: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type RefreshResponse = AuthTokens & {
  user?: AuthUser;
  message?: string;
};

export type MeResponse = ApiDetailResponse<AuthUser> | { user: AuthUser } | AuthUser;
