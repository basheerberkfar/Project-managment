import api from '@/libs/axios';
import { PRODUCT_UNIT_ROUTES } from './product-unit.routes';
import type {
  ProductUnitDto,
  CreateProductUnitDto,
  UpdateProductUnitDto,
} from './product-unit.types';
import type { ApiListResponse, ApiDetailResponse } from '@/types/apis';

export const productUnitApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) =>
    api.get<ApiListResponse<ProductUnitDto>>(PRODUCT_UNIT_ROUTES.LIST, {
      params,
    }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<ProductUnitDto>>(PRODUCT_UNIT_ROUTES.GET_ONE(id)),

  create: (data: CreateProductUnitDto) =>
    api.post<ProductUnitDto>(PRODUCT_UNIT_ROUTES.CREATE, data),

  update: (id: number | string, data: UpdateProductUnitDto) =>
    api.put<ProductUnitDto>(PRODUCT_UNIT_ROUTES.UPDATE(id), data),

  remove: (id: number | string) => api.delete(PRODUCT_UNIT_ROUTES.DELETE(id)),

  toggle: (id: number | string) => api.patch(PRODUCT_UNIT_ROUTES.TOGGLE(id)),

  active: (ids: (number | string)[]) =>
    api.post(PRODUCT_UNIT_ROUTES.ACTIVE, { ids }),

  inactive: (ids: (number | string)[]) =>
    api.post(PRODUCT_UNIT_ROUTES.IN_ACTIVE, { ids }),
};
