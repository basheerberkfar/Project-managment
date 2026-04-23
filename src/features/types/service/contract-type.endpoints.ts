import api from '@/libs/axios';
import type { ApiDetailResponse, ApiListResponse } from '@/types/apis';
import { CONTRACT_TYPE_ROUTES } from './contract-type.routes';
import type {
  ContractTypeDto,
  ContractTypePayload,
  UpdateContractTypeDto,
} from './contract-type.types';

export const contractTypeService = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    api.get<ApiListResponse<ContractTypeDto>>(CONTRACT_TYPE_ROUTES.LIST, {
      params,
    }),

  getOne: (id: number | string) =>
    api.get<ApiDetailResponse<ContractTypeDto>>(
      CONTRACT_TYPE_ROUTES.GET_ONE(id)
    ),

  create: (data: ContractTypePayload) =>
    api.post(CONTRACT_TYPE_ROUTES.CREATE, data),

  update: (id: number | string, data: UpdateContractTypeDto) =>
    api.put(CONTRACT_TYPE_ROUTES.UPDATE(id), data),
};
