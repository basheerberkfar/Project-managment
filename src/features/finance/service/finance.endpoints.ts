import api from '@/libs/axios';
import { FINANCE_ROUTES } from './finance.routes';
import type {
  BillDto,
  BillFilters,
  BillPayload,
  BillTypeDto,
  BillTypePayload,
  BondDto,
  BondFilters,
  BondPayload,
  BondTypeDto,
  BondTypePayload,
  PagedFilters,
  PagedResponse,
} from './finance.types';

export const financeService = {
  bills: (params?: BillFilters) => api.get<PagedResponse<BillDto>>(FINANCE_ROUTES.BILLS, { params }),
  bill: (id: string) => api.get<BillDto>(FINANCE_ROUTES.BILL(id)),
  createBill: (data: BillPayload) => api.post<string>(FINANCE_ROUTES.BILLS, data),
  updateBill: (id: string, data: BillPayload) => api.put(FINANCE_ROUTES.BILL(id), data),
  deleteBill: (id: string) => api.delete(FINANCE_ROUTES.BILL(id)),
  billTypes: (params?: PagedFilters & { CashierId?: string }) => api.get<PagedResponse<BillTypeDto>>(FINANCE_ROUTES.BILL_TYPES, { params }),
  createBillType: (data: BillTypePayload) => api.post<string>(FINANCE_ROUTES.BILL_TYPES, data),
  updateBillType: (id: string, data: BillTypePayload) => api.put(FINANCE_ROUTES.BILL_TYPE(id), data),
  deleteBillType: (id: string) => api.delete(FINANCE_ROUTES.BILL_TYPE(id)),
  bonds: (params?: BondFilters) => api.get<PagedResponse<BondDto>>(FINANCE_ROUTES.BONDS, { params }),
  bond: (id: string) => api.get<BondDto>(FINANCE_ROUTES.BOND(id)),
  createBond: (data: BondPayload) => api.post<string>(FINANCE_ROUTES.BONDS, data),
  updateBond: (id: string, data: BondPayload) => api.put(FINANCE_ROUTES.BOND(id), data),
  deleteBond: (id: string) => api.delete(FINANCE_ROUTES.BOND(id)),
  bondTypes: (params?: PagedFilters) => api.get<PagedResponse<BondTypeDto>>(FINANCE_ROUTES.BOND_TYPES, { params }),
  createBondType: (data: BondTypePayload) => api.post<string>(FINANCE_ROUTES.BOND_TYPES, data),
  updateBondType: (id: string, data: BondTypePayload) => api.put(FINANCE_ROUTES.BOND_TYPE(id), data),
  deleteBondType: (id: string) => api.delete(FINANCE_ROUTES.BOND_TYPE(id)),
};
