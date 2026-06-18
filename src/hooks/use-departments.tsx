import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import type { SelectOption } from '@/components/ui/select';
import {
  departmentsQueryOptions,
  useDepartmentQuery,
  type DepartmentDto,
} from '@/services/departments';

type SelectResponse = {
  data: SelectOption[];
  hasMore: boolean;
};

export const useDepartments = () => {
  const { t } = useTranslation('usersRoles');
  const queryClient = useQueryClient();

  const fetchDepartments = useCallback(
    async ({
      page,
      search,
      limit = 10,
    }: {
      page: number;
      search: string;
      limit?: number;
    }): Promise<SelectResponse> => {
      const response = await queryClient.fetchQuery({
        ...departmentsQueryOptions({
          page,
          pageSize: limit,
          search,
        }),
        staleTime: 1000 * 60 * 5,
      });

      const payload = response.data as {
        items?: DepartmentDto[];
        totalPages?: number;
        page?: number;
      };
      const list = Array.isArray(payload.items) ? payload.items : [];

      return {
        data: list.map((item) => ({
          label: item.name,
          value: item.id,
        })),
        hasMore: (payload.page ?? page) < (payload.totalPages ?? page),
      };
    },
    [queryClient]
  );

  const useDepartmentOption = (id?: string | null) => {
    const { data, ...rest } = useDepartmentQuery(id ?? '');
    const option = useMemo(
      () =>
        data
          ? {
              label: data.name || t('department'),
              value: data.id,
            }
          : null,
      [data, t]
    );

    return {
      data: option,
      ...rest,
    };
  };

  return { fetchDepartments, useDepartmentOption };
};
