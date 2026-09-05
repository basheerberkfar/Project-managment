import type { SelectOption } from '@/components/ui/select';

export type UserGender = 'Male' | 'Female';

export type UserReference = {
  id: string;
  name: string;
};

export type UserRoleReference = {
  id?: string | number;
  name?: string | null;
};

export type UserDto = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  gender?: UserGender;
  departmentName?: string | null;
  jobTitleName?: string | null;
  isAdmin?: boolean;
  isActive: boolean;
  isDefault?: boolean;
  departmentId?: string;
  jobTitleId?: string;
  department?: UserReference | null;
  jobTitle?: UserReference | null;
  roleId?: string | null;
  roleName?: string | null;
  role?: UserRoleReference | null;
  roles?: UserRoleReference[];
  type?: string | null;
  createdAt?: string;
  updatedAt?: string;
  faceDescriptor?: number[] | null;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  gender: UserGender;
  departmentId: string;
  jobTitleId: string;
  isActive: boolean;
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>> & {
  faceDescriptor?: number[] | null;
};

export type ChangePasswordDto = {
  password: string;
  NewPassword: string;
};

export type UserFilters = {
  Search?: string;
  IsActive?: boolean | null;
  JobTitleId?: string;
  DepartmentId?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  countryCode: string;
  gender: SelectOption | null;
  department: SelectOption | null;
  jobTitle: SelectOption | null;
  isActive: boolean;
};

export type ChangePasswordFormValues = {
  password: string;
  confirmPassword: string;
};
