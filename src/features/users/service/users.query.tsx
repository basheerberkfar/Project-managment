import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { usersKeys } from './users.keys';
import { usersService } from './users.endpoints';
import type { UpdateUserDto, UserDto, UserFilters } from './users.types';

const normalizeUser = (user: UserDto): UserDto => ({
  ...user,
  department:
    user.department ??
    (user.departmentId || user.departmentName
      ? {
          id: user.departmentId ?? '',
          name: user.departmentName ?? '',
        }
      : null),
  jobTitle:
    user.jobTitle ??
    (user.jobTitleId || user.jobTitleName
      ? {
          id: user.jobTitleId ?? '',
          name: user.jobTitleName ?? '',
        }
      : null),
  role:
    user.role ??
    (user.roleId || user.roleName
      ? {
          id: user.roleId ?? '',
          name: user.roleName ?? '',
        }
      : null),
  roles: Array.isArray(user.roles) ? user.roles : [],
});

export const useUsersQuery = (params?: UserFilters) =>
  useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    select: (res) => {
      const rawItems = Array.isArray(res.data)
        ? res.data
        : extractApiList<UserDto>(res.data);
      const items = rawItems.map(normalizeUser);
      const pagination = Array.isArray(res.data)
        ? {
            page: 1,
            pageSize: items.length || (params?.pageSize ?? 10),
            totalCount: items.length,
            totalPages: items.length > 0 ? 1 : 0,
            hasPreviousPage: false,
            hasNextPage: false,
          }
        : extractPaginationMeta(res.data, params?.pageSize ?? 10);

      return {
        items,
        pagination,
        raw: res.data,
      };
    },
  });

export const useUserQuery = (id: string) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersService.getOne(id),
    enabled: Boolean(id),
    select: (res) => {
      const item = Array.isArray(res.data)
        ? ((res.data[0] ?? null) as UserDto | null)
        : (extractApiItem<UserDto>(res.data) ??
          ((typeof res.data === 'object' && res.data !== null
            ? (res.data as UserDto)
            : null) as UserDto | null));

      return item ? normalizeUser(item) : null;
    },
  });

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useUpdateUserFaceDescriptorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      faceDescriptor,
    }: {
      id: string;
      faceDescriptor: number[];
    }) => {
      const cachedUser = queryClient.getQueryData<UserDto>(
        usersKeys.detail(id)
      );
      const user =
        cachedUser ??
        normalizeUser(
          extractApiItem<UserDto>((await usersService.getOne(id)).data) ??
            ({} as UserDto)
        );

      if (!user.name || !user.email) {
        throw new Error('User name and email are required to update face data');
      }

      const payload: UpdateUserDto = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber ?? '',
        countryCode: user.countryCode ?? '',
        gender: user.gender,
        departmentId: user.departmentId ?? user.department?.id ?? '',
        jobTitleId: user.jobTitleId ?? user.jobTitle?.id ?? '',
        isActive: user.isActive,
        faceDescriptor,
      };

      return usersService.update(id, payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useChangeUserPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { password: string; NewPassword: string };
    }) => usersService.changePassword(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
  });
};
