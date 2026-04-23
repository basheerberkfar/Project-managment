import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  productUnitsQueryOptions,
  type ProductUnitDto,
} from '@/features/types/service';
import { resolveText } from '@/utils/helpers';

type ListResponseBody = {
  data?: ProductUnitDto[];
  result?: ProductUnitDto[];
  meta?: { current_page?: number; last_page?: number };
};

export const useProductUnits = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as 'ar' | 'en') || 'ar';
  const queryClient = useQueryClient();

  const fetchProductUnits = async ({
    page,
    search,
    limit = 10,
  }: {
    page: number;
    search: string;
    limit?: number;
  }) => {
    const response = await queryClient.fetchQuery({
      ...productUnitsQueryOptions({ page, search, limit }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const body = (response?.data ?? response) as ListResponseBody | undefined;
    const list = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.result)
        ? body.result
        : [];
    const meta = body?.meta ?? { current_page: 0, last_page: 0 };

    return {
      data: list.map((unit) => ({
        label: resolveText(unit.title, currentLang),
        value: unit.id.toString(),
      })),
      hasMore: (meta.current_page ?? 0) < (meta.last_page ?? 0),
    };
  };

  return { fetchProductUnits };
};
