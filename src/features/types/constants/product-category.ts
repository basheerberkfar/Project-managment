export const PRODUCT_CATEGORY_ENUM = {
  OILS: 1,
  DEVICES: 2,
  OTHER: 3,
} as const;

export const PRODUCT_CATEGORY_TRANSLATION_KEYS: Record<number, string> = {
  [PRODUCT_CATEGORY_ENUM.OILS]: 'product_category_enum.oils',
  [PRODUCT_CATEGORY_ENUM.DEVICES]: 'product_category_enum.devices',
  [PRODUCT_CATEGORY_ENUM.OTHER]: 'product_category_enum.other',
};
