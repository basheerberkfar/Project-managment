import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeService } from './finance.endpoints';
import { financeKeys } from './finance.keys';
import type { BillFilters, BillPayload, BillTypePayload, BondFilters, BondPayload, BondTypePayload, PagedFilters } from './finance.types';

export const useBillsQuery = (filters?: BillFilters) => useQuery({ queryKey: financeKeys.billsList(filters), queryFn: () => financeService.bills(filters), select: ({ data }) => ({ ...data, items: data.items ?? [] }) });
export const useBillQuery = (id: string) => useQuery({ queryKey: financeKeys.bill(id), queryFn: () => financeService.bill(id), select: ({ data }) => data, enabled: Boolean(id) });
export const useBondsQuery = (filters?: BondFilters) => useQuery({ queryKey: financeKeys.bondsList(filters), queryFn: () => financeService.bonds(filters), select: ({ data }) => ({ ...data, items: data.items ?? [] }) });
export const useBondQuery = (id: string) => useQuery({ queryKey: financeKeys.bond(id), queryFn: () => financeService.bond(id), select: ({ data }) => data, enabled: Boolean(id) });
export const useBillTypesQuery = (filters?: PagedFilters) => useQuery({ queryKey: financeKeys.billTypesList(filters), queryFn: () => financeService.billTypes(filters), select: ({ data }) => ({ ...data, items: data.items ?? [] }) });
export const useBondTypesQuery = (filters?: PagedFilters) => useQuery({ queryKey: financeKeys.bondTypesList(filters), queryFn: () => financeService.bondTypes(filters), select: ({ data }) => ({ ...data, items: data.items ?? [] }) });

const useFinanceMutation = <T>(mutationFn: (variables: T) => Promise<unknown>, keys: readonly (readonly unknown[])[]) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })) });
};

export const useCreateBillMutation = () => useFinanceMutation<BillPayload>(financeService.createBill, [financeKeys.bills]);
export const useUpdateBillMutation = () => useFinanceMutation<{ id: string; data: BillPayload }>(({ id, data }) => financeService.updateBill(id, data), [financeKeys.bills]);
export const useDeleteBillMutation = () => useFinanceMutation<string>(financeService.deleteBill, [financeKeys.bills, financeKeys.bonds]);
export const useCreateBondMutation = () => useFinanceMutation<BondPayload>(financeService.createBond, [financeKeys.bonds, financeKeys.bills]);
export const useUpdateBondMutation = () => useFinanceMutation<{ id: string; data: BondPayload }>(({ id, data }) => financeService.updateBond(id, data), [financeKeys.bonds, financeKeys.bills]);
export const useDeleteBondMutation = () => useFinanceMutation<string>(financeService.deleteBond, [financeKeys.bonds, financeKeys.bills]);
export const useCreateBillTypeMutation = () => useFinanceMutation<BillTypePayload>(financeService.createBillType, [financeKeys.billTypes]);
export const useUpdateBillTypeMutation = () => useFinanceMutation<{ id: string; data: BillTypePayload }>(({ id, data }) => financeService.updateBillType(id, data), [financeKeys.billTypes]);
export const useDeleteBillTypeMutation = () => useFinanceMutation<string>(financeService.deleteBillType, [financeKeys.billTypes]);
export const useCreateBondTypeMutation = () => useFinanceMutation<BondTypePayload>(financeService.createBondType, [financeKeys.bondTypes]);
export const useUpdateBondTypeMutation = () => useFinanceMutation<{ id: string; data: BondTypePayload }>(({ id, data }) => financeService.updateBondType(id, data), [financeKeys.bondTypes]);
export const useDeleteBondTypeMutation = () => useFinanceMutation<string>(financeService.deleteBondType, [financeKeys.bondTypes]);
