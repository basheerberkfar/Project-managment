import type { ProductUnitDto } from '@/features/types/service';
import { productUnitsSectionActionNames } from './action-names';
import type {
  ProductUnitsSectionSort,
  ProductUnitsSectionState,
} from './initial-state';

export type ProductUnitsSectionAction =
  | {
      type: typeof productUnitsSectionActionNames.setSearch;
      payload: string;
    }
  | {
      type: typeof productUnitsSectionActionNames.setPageIndex;
      payload: number;
    }
  | {
      type: typeof productUnitsSectionActionNames.setPageSize;
      payload: number;
    }
  | {
      type: typeof productUnitsSectionActionNames.setSort;
      payload?: ProductUnitsSectionSort;
    }
  | {
      type: typeof productUnitsSectionActionNames.setSelectedProductUnit;
      payload: ProductUnitDto | null;
    }
  | {
      type: typeof productUnitsSectionActionNames.setEditingProductUnit;
      payload: ProductUnitDto | null;
    }
  | {
      type: typeof productUnitsSectionActionNames.setProductUnitToDelete;
      payload: ProductUnitDto | null;
    }
  | {
      type: typeof productUnitsSectionActionNames.setStatusProductUnit;
      payload: ProductUnitDto | null;
    }
  | {
      type: typeof productUnitsSectionActionNames.setIsFormModalOpen;
      payload: boolean;
    }
  | {
      type: typeof productUnitsSectionActionNames.setIsViewModalOpen;
      payload: boolean;
    };

export function productUnitsSectionReducer(
  state: ProductUnitsSectionState,
  action: ProductUnitsSectionAction
): ProductUnitsSectionState {
  switch (action.type) {
    case productUnitsSectionActionNames.setSearch:
      return {
        ...state,
        search: action.payload,
        pageIndex: 1,
      };

    case productUnitsSectionActionNames.setPageIndex:
      return {
        ...state,
        pageIndex: action.payload,
      };

    case productUnitsSectionActionNames.setPageSize:
      return {
        ...state,
        pageSize: action.payload,
        pageIndex: 1,
      };

    case productUnitsSectionActionNames.setSort:
      return {
        ...state,
        sort: action.payload,
      };

    case productUnitsSectionActionNames.setSelectedProductUnit:
      return {
        ...state,
        selectedProductUnit: action.payload,
      };

    case productUnitsSectionActionNames.setEditingProductUnit:
      return {
        ...state,
        editingProductUnit: action.payload,
      };

    case productUnitsSectionActionNames.setProductUnitToDelete:
      return {
        ...state,
        productUnitToDelete: action.payload,
      };

    case productUnitsSectionActionNames.setStatusProductUnit:
      return {
        ...state,
        statusProductUnit: action.payload,
      };

    case productUnitsSectionActionNames.setIsFormModalOpen:
      return {
        ...state,
        isFormModalOpen: action.payload,
      };

    case productUnitsSectionActionNames.setIsViewModalOpen:
      return {
        ...state,
        isViewModalOpen: action.payload,
      };

    default:
      return state;
  }
}
