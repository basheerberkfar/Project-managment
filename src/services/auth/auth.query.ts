import { useQuery } from '@tanstack/react-query';
import { authApi } from './auth.endpoints';
import { authKeys } from './auth.keys';
import { getAuthToken } from '@/utils/helpers';

export const useAuthMeQuery = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: !!getAuthToken(),
    retry: false,
  });
