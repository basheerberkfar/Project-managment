import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  extractApiItem,
  extractApiList,
  extractPaginationMeta,
} from '@/types/apis';
import { billsKeys } from './bills.keys';
import { billsService } from './bills.endpoints';
import type {
  BillDto,
  UpdateBillDto,
} from './bills.types';

export const useBillsQuery = (params?: {
  billTypeId?: string;
  projectId?: string;
  clientId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
}) =>
  useQuery({
    queryKey: billsKeys.list(params),
    queryFn: () => billsService.list(params),
    select: (res) => ({
      items: extractApiList<BillDto>(res.data),
      pagination: extractPaginationMeta(res.data, params?.pageSize ?? 20),
      raw: res.data,
    }),
  });

export const useBillQuery = (id: number | string) =>
  useQuery({
    queryKey: billsKeys.detail(id),
    queryFn: () => billsService.getOne(id),
    enabled: !!id,
    select: (res) => extractApiItem<BillDto>(res.data),
  });

export const useCreateBillMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billsKeys.lists(),
      });
    },
  });
};

export const useUpdateBillMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateBillDto }) =>
      billsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: billsKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: billsKeys.lists(),
      });
    },
  });
};

export const useDeleteBillMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billsKeys.lists(),
      });
    },
  });
};
