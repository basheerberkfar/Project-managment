import { useTranslation } from 'react-i18next';

type TypesComingSoonProps = {
  translationKey: string;
};

export default function TypesComingSoon({
  translationKey,
}: TypesComingSoonProps) {
  const { t } = useTranslation('types');

  return (
    <div className="grid h-full min-h-[320px] place-items-center rounded-xl border border-dashed border-gray-light-500 bg-gray-light-100/30 p-8 text-center dark:border-dark-card-border dark:bg-dark-card-surface/20">
      <div className="max-w-md">
        <p className="mb-2 text-lg font-semibold text-gray-light-900 dark:text-white">
          {t(translationKey)}
        </p>
        <p className="text-sm text-gray-light-700 dark:text-gray-dark-500">
          {t('coming_soon')}
        </p>
      </div>
    </div>
  );
}
