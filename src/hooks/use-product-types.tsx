import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  productTypesQueryOptions,
  useProductTypeQuery,
} from '@/features/types/service';
import type { ProductTypeDto } from '@/features/types/service';
import type { Meta } from '@/types/apis';
import { resolveText } from '@/utils/helpers';

type ListResponseBody = {
  data?: ProductTypeDto[];
  result?: ProductTypeDto[];
  meta?: Meta;
};

export const useProductTypes = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as 'ar' | 'en') || 'ar';
  const queryClient = useQueryClient();

  const fetchProductTypes = async ({
    page,
    search,
    limit = 10,
  }: {
    page: number;
    search: string;
    limit?: number;
  }) => {
    const response = await queryClient.fetchQuery({
      ...productTypesQueryOptions({ page, search, limit }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const body = (response?.data ?? response) as ListResponseBody | undefined;
    const list: ProductTypeDto[] = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.result)
        ? body.result
        : [];
    const meta: Meta = body?.meta ?? { current_page: 0, last_page: 0 };

    return {
      data: list.map((type: ProductTypeDto) => ({
        label: resolveText(type.title, currentLang),
        value: String(type.id),
      })),
      hasMore: meta.current_page < meta.last_page,
    };
  };

  const useProductType = (id: string | number) => {
    const { data, ...rest } = useProductTypeQuery(id);

    return {
      data: data
        ? {
            label: resolveText(data.title, currentLang),
            value: data.id.toString(),
          }
        : null,
      ...rest,
    };
  };

  return { fetchProductTypes, useProductType };
};
