import api from '@/libs/axios';
import type {
  PagedResourceResponse,
  ResourceFilters,
  ResourcePayload,
  ResourceRecord,
} from './management.types';

export const managementService = {
  list: (endpoint: string, params?: ResourceFilters) =>
    api.get<PagedResourceResponse>(endpoint, { params }),
  item: (endpoint: string, id: string) =>
    api.get<ResourceRecord>(`${endpoint}/${id}`),
  create: (endpoint: string, data: ResourcePayload) =>
    api.post<string>(endpoint, data),
  update: (endpoint: string, id: string, data: ResourcePayload) =>
    api.put(`${endpoint}/${id}`, data),
  remove: (endpoint: string, id: string) => api.delete(`${endpoint}/${id}`),
};
