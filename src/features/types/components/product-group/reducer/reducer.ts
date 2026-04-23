import type { ProductTypeDto } from '@/features/types/service';
import { productGroupsSectionActionNames } from './action-names';
import type {
  ProductGroupsSectionSort,
  ProductGroupsSectionState,
} from './initial-state';

export type ProductGroupsSectionAction =
  | {
      type: typeof productGroupsSectionActionNames.setSearch;
      payload: string;
    }
  | {
      type: typeof productGroupsSectionActionNames.setPageIndex;
      payload: number;
    }
  | {
      type: typeof productGroupsSectionActionNames.setPageSize;
      payload: number;
    }
  | {
      type: typeof productGroupsSectionActionNames.setSort;
      payload?: ProductGroupsSectionSort;
    }
  | {
      type: typeof productGroupsSectionActionNames.setSelectedProductGroup;
      payload: ProductTypeDto | null;
    }
  | {
      type: typeof productGroupsSectionActionNames.setEditingProductGroup;
      payload: ProductTypeDto | null;
    }
  | {
      type: typeof productGroupsSectionActionNames.setDeleteProductGroup;
      payload: ProductTypeDto | null;
    }
  | {
      type: typeof productGroupsSectionActionNames.setStatusProductGroup;
      payload: ProductTypeDto | null;
    }
  | {
      type: typeof productGroupsSectionActionNames.setIsFormModalOpen;
      payload: boolean;
    }
  | {
      type: typeof productGroupsSectionActionNames.setIsViewModalOpen;
      payload: boolean;
    };

export function productGroupsSectionReducer(
  state: ProductGroupsSectionState,
  action: ProductGroupsSectionAction
): ProductGroupsSectionState {
  switch (action.type) {
    case productGroupsSectionActionNames.setSearch:
      return {
        ...state,
        search: action.payload,
        pageIndex: 1,
      };
    case productGroupsSectionActionNames.setPageIndex:
      return { ...state, pageIndex: action.payload };
    case productGroupsSectionActionNames.setPageSize:
      return {
        ...state,
        pageSize: action.payload,
        pageIndex: 1,
      };
    case productGroupsSectionActionNames.setSort:
      return { ...state, sort: action.payload };
    case productGroupsSectionActionNames.setSelectedProductGroup:
      return { ...state, selectedProductGroup: action.payload };
    case productGroupsSectionActionNames.setEditingProductGroup:
      return { ...state, editingProductGroup: action.payload };
    case productGroupsSectionActionNames.setDeleteProductGroup:
      return { ...state, deleteProductGroup: action.payload };
    case productGroupsSectionActionNames.setStatusProductGroup:
      return { ...state, statusProductGroup: action.payload };
    case productGroupsSectionActionNames.setIsFormModalOpen:
      return { ...state, isFormModalOpen: action.payload };
    case productGroupsSectionActionNames.setIsViewModalOpen:
      return { ...state, isViewModalOpen: action.payload };
    default:
      return state;
  }
}
