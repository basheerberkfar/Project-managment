import type { StatusEnum } from '@/constants/enums';
import type { SelectOption } from '@/components/ui/select';
import type { LocalizedText } from '@/types/localization-text';

export type ProductTypeRelationDto = {
  id: number;
  title: LocalizedText;
};

export type ProductTypeDto = {
  id: number;

  title: LocalizedText;
  description: LocalizedText;
  category?: number;
  contract_type?: ProductTypeRelationDto | null;
  contract_types?: ProductTypeRelationDto[];
  bill_type?: ProductTypeRelationDto | null;
  bill_types?: ProductTypeRelationDto[];

  icon: string | null;

  productsCount: number;
  products_count?: number;

  status: StatusEnum;
};

export type CreateProductTypeDto = {
  title: LocalizedText;
  description: LocalizedText;
  category: number;
  status: StatusEnum;
  contract_types: number[];
  bill_types: number[];
  icon?: string | null;
};

export type UpdateProductTypeDto = Partial<CreateProductTypeDto>;

export type ProductTypeFormValues = {
  titleEnglish: string;
  titleArabic: string;
  descriptionEnglish: string;
  descriptionArabic: string;
  contractTypes: SelectOption[];
  billTypes: SelectOption[];
  status: SelectOption | null;
  category: SelectOption | null;
};
