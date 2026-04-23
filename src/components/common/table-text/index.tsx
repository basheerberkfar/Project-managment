import type { LocalizedText } from '@/types/localization-text';
import { resolveText } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

interface TableTextProps {
  text: string | LocalizedText;
}

const TableText = ({ text }: TableTextProps) => {
  const {
    i18n: { language: lang },
  } = useTranslation();
  const resolvedText = resolveText(text, lang as 'en' | 'ar');

  return (
    <span className="text-[0.81rem] select-none truncate wrap-break-word dark:text-dark-primary text-neutral-900 font-normal leading-[20px]">
      {resolvedText}
    </span>
  );
};

export default TableText;
