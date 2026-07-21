import type { BillDto } from '../../service';

export type BillsListSort = {
  columnId: string;
  direction: 'asc' | 'desc';
};

export type BillsListState = {
  search: string;
  pageIndex: number;
  pageSize: number;
  sort?: BillsListSort;
  selectedBill: BillDto | null;
};

export const billsListInitialState: BillsListState = {
  search: '',
  pageIndex: 1,
  pageSize: 20,
  sort: undefined,
  selectedBill: null,
};
