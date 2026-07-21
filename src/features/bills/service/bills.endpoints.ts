import api from '@/libs/axios';
import type { ApiDetailResponse, ApiListResponse } from '@/types/apis';
import { BILLS_ROUTE } from './bills.routes';
import type {
  CreateBillDto,
  BillDto,
  UpdateBillDto,
} from './bills.types';

export const billsService = {
  list: (params?: {
    billTypeId?: string;
    projectId?: string;
    clientId?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDescending?: boolean;
  }) => api.get<ApiListResponse<BillDto>>(BILLS_ROUTE.LIST, { params }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<BillDto>>(BILLS_ROUTE.GET_ONE(id)),

  create: (data: CreateBillDto) =>
    api.post(BILLS_ROUTE.POST, { command: data }),

  update: (id: number | string, data: UpdateBillDto) =>
    api.put(BILLS_ROUTE.UPDATE(id), { command: data }),

  remove: (id: number | string) =>
    api.delete(BILLS_ROUTE.DELETE(id)),
};
