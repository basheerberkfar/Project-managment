import type { BillDto } from '../../service';
import { billsListActionNames } from './action-names';
import type { BillsListSort, BillsListState } from './initial-state';

export type BillsListAction =
  | {
      type: typeof billsListActionNames.setSearch;
      payload: string;
    }
  | {
      type: typeof billsListActionNames.setPageIndex;
      payload: number;
    }
  | {
      type: typeof billsListActionNames.setPageSize;
      payload: number;
    }
  | {
      type: typeof billsListActionNames.setSort;
      payload?: BillsListSort;
    }
  | {
      type: typeof billsListActionNames.setSelectedBill;
      payload: BillDto | null;
    };

export function billsListReducer(
  state: BillsListState,
  action: BillsListAction
): BillsListState {
  switch (action.type) {
    case billsListActionNames.setSearch:
      return {
        ...state,
        search: action.payload,
        pageIndex: 1,
      };

    case billsListActionNames.setPageIndex:
      return {
        ...state,
        pageIndex: action.payload,
      };

    case billsListActionNames.setPageSize:
      return {
        ...state,
        pageSize: action.payload,
        pageIndex: 1,
      };

    case billsListActionNames.setSort:
      return {
        ...state,
        sort: action.payload,
      };

    case billsListActionNames.setSelectedBill:
      return {
        ...state,
        selectedBill: action.payload,
      };

    default:
      return state;
  }
}
