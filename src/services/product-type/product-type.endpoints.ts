import api from '@/libs/axios';
import { PRODUCT_TYPE_ROUTES } from './product-type.routes';
import type {
  ProductTypeDto,
  CreateProductTypeDto,
  UpdateProductTypeDto,
} from './products.types';
import type { ApiListResponse, ApiDetailResponse } from '@/types/apis';

export const productTypeApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    api.get<ApiListResponse<ProductTypeDto>>(PRODUCT_TYPE_ROUTES.LIST, {
      params,
    }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<ProductTypeDto>>(PRODUCT_TYPE_ROUTES.GET_ONE(id)),

  create: (data: CreateProductTypeDto) =>
    api.post<ProductTypeDto>(PRODUCT_TYPE_ROUTES.CREATE, data),

  update: (id: number | string, data: UpdateProductTypeDto) =>
    api.put<ProductTypeDto>(PRODUCT_TYPE_ROUTES.UPDATE(id), data),

  remove: (id: number | string) => api.delete(PRODUCT_TYPE_ROUTES.DELETE(id)),

  toggle: (id: number | string) => api.patch(PRODUCT_TYPE_ROUTES.TOGGLE(id)),

  active: (ids: (number | string)[]) =>
    api.post(PRODUCT_TYPE_ROUTES.ACTIVE, { ids }),

  inactive: (ids: (number | string)[]) =>
    api.post(PRODUCT_TYPE_ROUTES.IN_ACTIVE, { ids }),
};
