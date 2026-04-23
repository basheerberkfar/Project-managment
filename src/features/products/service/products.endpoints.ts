import api from '@/libs/axios';
import type {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
} from './products.types';
import { ROUTE } from './products.routes';
import type { ApiListResponse, ApiDetailResponse } from '@/types/apis';

export const productsService = {
  list: (params?: {
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    'filter[product_type_ids][]'?: Array<number | string>;
  }) => api.get<ApiListResponse<ProductDto>>(ROUTE.LIST, { params }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<ProductDto>>(ROUTE.GET_ONE(id)),

  create: (data: CreateProductDto) => api.post(ROUTE.POST, data),

  update: (id: number | string, data: UpdateProductDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: number | string) => api.delete(ROUTE.DELETE(id)),

  toggle: (id: number | string) => api.patch(ROUTE.TOGGLE(id)),

  active: (ids: (number | string)[]) => api.post(ROUTE.ACTIVE, { ids }),

  inactive: (ids: (number | string)[]) => api.post(ROUTE.IN_ACTIVE, { ids }),
};
