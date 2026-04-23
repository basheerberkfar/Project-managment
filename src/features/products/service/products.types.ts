import type { SelectOption } from '@/components/ui/select';
import type { StatusEnum } from '@/constants/enums';
import type { ProductTypeDto } from '@/services/product-type/products.types';
import type { ProductUnitDto } from '@/services/product-unit/product-unit.types';

export type CreateProductDto = {
  name: string;
  product_type_id: number;
  product_unit_id: number;
  quant: number;
  opening_quant?: number;
  maintaince_quant?: number;
  notification_minimum_quantity?: number;
  price: number;
  status: number;
  description?: string;
  icon_id?: string;
  image_ids?: string[];
};

export type UpdateProductDto = Partial<CreateProductDto> & {
  delete_icon_id?: string;
  delete_image_ids?: string[];
};

export type ProductImageDto = {
  id: number;
  name: string;
  mime_type?: string;
  size: number;
  url: string;
  created_at?: string;
};

export type ProductDto = {
  id: number;
  name: string;
  price: number;
  quant: number;
  opening_quant: number;
  maintaince_quant: number;
  notification_minimum_quantity: number;
  description: string;
  status: StatusEnum;
  product_type: ProductTypeDto;
  product_unit: ProductUnitDto;
  image_ids: string[];
  icon?: {
    id: string | number;
    url: string;
  };
  images?: ProductImageDto[];
};

export type ProductFormImage = {
  id: number | string;
  url: string;
  name?: string;
  size?: number;
  isMain?: boolean;
};

export type ProductFormValues = {
  name: string;
  price: number;
  quant: number;
  status: SelectOption | null;
  product_type: SelectOption | null;
  product_unit: SelectOption | null;
  description: string | null;
  opening_quant: number | null;
  maintenance_quant: number | null;
  notification_minimum_quantity: number | null;
  icon_id: string | null;
  image_ids: string[] | null;
  delete_icon_id: string | null;
  delete_image_ids: string[] | null;
};
