import type { StatusEnum } from '@/constants/enums';
import type { LocalizedText } from '@/types/localization-text';

export type ProductUnitDto = {
  id: number;
  title: LocalizedText;
  description: LocalizedText | unknown[];
  status: StatusEnum;
  products_count?: number;
};

export type CreateProductUnitDto = {
  title: LocalizedText;
  description: LocalizedText;
  status?: StatusEnum;
};

export type UpdateProductUnitDto = Partial<CreateProductUnitDto>;

export type ProductUnitFormValues = {
  titleEnglish: string;
  titleArabic: string;
  descriptionEnglish: string;
  descriptionArabic: string;
};
