import { useMutation } from '@tanstack/react-query';
import { authApi } from './auth.endpoints';
import type { mutationOptions } from '@/types/mutation-wrapper.types';
import type { CheckEmailResponse, LoginResponse } from './auth.types';

export const useCheckEmailMutation = (
  options?: mutationOptions<CheckEmailResponse>
) => {
  return useMutation({
    mutationFn: authApi.checkEmail,

    onSuccess: (data: CheckEmailResponse) => {
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error('Check email failed', error);

      options?.onError?.(error);
    },
  });
};

export const useLoginMutation = (options?: mutationOptions<LoginResponse>) => {
  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (data: LoginResponse) => {
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error('Create user failed', error);

      options?.onError?.(error);
    },
  });
};

export const useLogoutMutation = (options?: mutationOptions) => {
  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      console.error('Create user failed', error);

      options?.onError?.(error);
    },
  });
};
