import type { BillFilters, BondFilters, PagedFilters } from './finance.types';

export const financeKeys = {
  bills: ['finance', 'bills'] as const,
  billsList: (filters?: BillFilters) => [...financeKeys.bills, 'list', filters] as const,
  bill: (id: string) => [...financeKeys.bills, 'detail', id] as const,
  bonds: ['finance', 'bonds'] as const,
  bondsList: (filters?: BondFilters) => [...financeKeys.bonds, 'list', filters] as const,
  bond: (id: string) => [...financeKeys.bonds, 'detail', id] as const,
  billTypes: ['finance', 'bill-types'] as const,
  billTypesList: (filters?: PagedFilters) => [...financeKeys.billTypes, 'list', filters] as const,
  bondTypes: ['finance', 'bond-types'] as const,
  bondTypesList: (filters?: PagedFilters) => [...financeKeys.bondTypes, 'list', filters] as const,
};
