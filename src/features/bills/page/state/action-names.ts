export const billsListActionNames = {
  setSearch: 'SET_SEARCH',
  setPageIndex: 'SET_PAGE_INDEX',
  setPageSize: 'SET_PAGE_SIZE',
  setSort: 'SET_SORT',
  setSelectedBill: 'SET_SELECTED_BILL',
} as const;

export type BillsListActionName =
  (typeof billsListActionNames)[keyof typeof billsListActionNames];
