import type { LocalizedText } from '@/types/localization-text';

export type ContractProductTypeDto = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  category?: number;
  status?: number;
  products_count?: number;
  icon?: string | null;
};

export type ContractTypeDto = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  type?: number;
  type_label?: string | LocalizedText | null;
  product_types?: ContractProductTypeDto[];
  contracts_count?: number;
};

export type ContractTypePayload = {
  id: number | string;
  title: LocalizedText;
  description: LocalizedText;
};

export type UpdateContractTypeDto = Partial<ContractTypePayload>;

export type ContractTypeFormValues = {
  titleEnglish: string;
  titleArabic: string;
  descriptionEnglish: string;
  descriptionArabic: string;
};
