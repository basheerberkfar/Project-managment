export type PagedFilters = {
  Page?: number;
  PageSize?: number;
  Search?: string;
  SortBy?: string;
  SortDescending?: boolean;
};

export type PagedResponse<T> = {
  items: T[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type BillDto = {
  id: string;
  no: string | null;
  relatedToProject: boolean;
  barcode: string | null;
  billTypeId: string;
  billTypeName: string | null;
  projectId: string | null;
  projectName: string | null;
  clientId: string | null;
  clientName: string | null;
  total: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type BillPayload = {
  no: string | null;
  relatedToProject: boolean;
  barcode: string | null;
  billTypeId: string;
  projectId: string | null;
  clientId: string | null;
  total: number;
  paidAmount: number;
};

export type BillFilters = PagedFilters & {
  BillTypeId?: string;
  ProjectId?: string;
  ClientId?: string;
};

export type BondDto = {
  id: string;
  no: string | null;
  date: string;
  barcode: string | null;
  relatedToBill: boolean;
  billId: string | null;
  billNo: string | null;
  bondTypeId: string;
  bondTypeName: string | null;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type BondPayload = {
  no: string | null;
  date: string;
  barcode: string | null;
  relatedToBill: boolean;
  billId: string | null;
  bondTypeId: string;
  total: number;
  notes: string | null;
};

export type BondFilters = PagedFilters & {
  BondTypeId?: string;
  BillId?: string;
};

export type BillTypeDto = {
  id: string;
  name: string | null;
  type: string | null;
  cashierId: string;
  cashierName: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type BillTypePayload = {
  name: string | null;
  type: string | null;
  cashierId: string;
};

export type BondTypeDto = {
  id: string;
  name: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type BondTypePayload = {
  name: string | null;
  type: string | null;
};
