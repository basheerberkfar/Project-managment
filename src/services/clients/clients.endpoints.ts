import api from '@/libs/axios';
import type {
  ClientFilters,
  CreateClientDto,
  UpdateClientDto,
} from './clients.types';
import { ROUTE } from './clients.routes';

export const clientsService = {
  list: (params?: ClientFilters) => api.get(ROUTE.LIST, { params }),

  getOne: (id: string) => api.get(ROUTE.GET_ONE(id)),

  create: (data: CreateClientDto) => api.post(ROUTE.POST, data),

  update: (id: string, data: UpdateClientDto) =>
    api.put(ROUTE.UPDATE(id), data),

  remove: (id: string) => api.delete(ROUTE.DELETE(id)),
};
