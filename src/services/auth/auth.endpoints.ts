import api from '@/libs/axios';
import type { CheckEmailRequest, LoginRequest } from './auth.types';

const ROUTE = '';

export const authApi = {
  checkEmail: async (data: CheckEmailRequest) => {
    const response = await api.post(`${ROUTE}/check-email`, data);
    return response.data;
  },
  login: async (data: LoginRequest) => {
    const response = await api.post(`${ROUTE}/login`, data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post(`${ROUTE}/logout`);
    return response.data;
  },
};
