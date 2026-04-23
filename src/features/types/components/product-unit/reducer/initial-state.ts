import type { SortState } from '@/components/common/table';
import type { ProductUnitDto } from '@/features/types/service';

export type ProductUnitsSectionSort = SortState;

export type ProductUnitsSectionState = {
  pageIndex: number;
  pageSize: number;
  sort?: ProductUnitsSectionSort;
  search: string;
  selectedProductUnit: ProductUnitDto | null;
  editingProductUnit: ProductUnitDto | null;
  productUnitToDelete: ProductUnitDto | null;
  statusProductUnit: ProductUnitDto | null;
  isFormModalOpen: boolean;
  isViewModalOpen: boolean;
};

export const productUnitsSectionInitialState: ProductUnitsSectionState = {
  pageIndex: 1,
  pageSize: 20,
  sort: undefined,
  search: '',
  selectedProductUnit: null,
  editingProductUnit: null,
  productUnitToDelete: null,
  statusProductUnit: null,
  isFormModalOpen: false,
  isViewModalOpen: false,
};
