import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SelectOption } from '@/components/ui/select';
import { LANGUAGES, type LanguageEnum } from '@/constants/enums';

type LanguageLike = LanguageEnum | string | number | null | undefined;

const normalizeLanguageValue = (value: LanguageLike): LanguageEnum | null => {
  if (value == null) return null;

  if (value === LANGUAGES.ARABIC || value === 1 || value === '1') {
    return LANGUAGES.ARABIC;
  }

  if (value === LANGUAGES.ENGLISH || value === 2 || value === '2') {
    return LANGUAGES.ENGLISH;
  }

  const normalized = Number(value);

  if (normalized === LANGUAGES.ARABIC) {
    return LANGUAGES.ARABIC;
  }

  if (normalized === LANGUAGES.ENGLISH) {
    return LANGUAGES.ENGLISH;
  }

  return null;
};

export const useLanguageOptions = () => {
  const { t } = useTranslation('common');

  const options = useMemo<SelectOption[]>(
    () => [
      { label: t('arabic'), value: String(LANGUAGES.ARABIC) },
      { label: t('english'), value: String(LANGUAGES.ENGLISH) },
    ],
    [t]
  );

  const getLanguageOption = (value: LanguageLike) => {
    const normalizedValue = normalizeLanguageValue(value);

    return (
      options.find((option) => option.value === String(normalizedValue)) ?? null
    );
  };

  const getLanguageLabel = (value: LanguageLike) =>
    getLanguageOption(value)?.label ?? '-';

  return {
    options,
    getLanguageOption,
    getLanguageLabel,
    normalizeLanguageValue,
  };
};

export { normalizeLanguageValue };
