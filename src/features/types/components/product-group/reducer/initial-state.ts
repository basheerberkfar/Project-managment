import type { SortState } from '@/components/common/table';
import type { ProductTypeDto } from '@/features/types/service';

export type ProductGroupsSectionSort = SortState;

export type ProductGroupsSectionState = {
  pageIndex: number;
  pageSize: number;
  sort?: ProductGroupsSectionSort;
  search: string;
  selectedProductGroup: ProductTypeDto | null;
  editingProductGroup: ProductTypeDto | null;
  deleteProductGroup: ProductTypeDto | null;
  statusProductGroup: ProductTypeDto | null;
  isFormModalOpen: boolean;
  isViewModalOpen: boolean;
};

export const productGroupsSectionInitialState: ProductGroupsSectionState = {
  pageIndex: 1,
  pageSize: 20,
  sort: undefined,
  search: '',
  selectedProductGroup: null,
  editingProductGroup: null,
  deleteProductGroup: null,
  statusProductGroup: null,
  isFormModalOpen: false,
  isViewModalOpen: false,
};
