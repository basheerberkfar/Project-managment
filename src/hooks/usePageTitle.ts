import { useTranslation } from 'react-i18next';

const usePageTitle = () => {
  const { t } = useTranslation(['sidebar', 'types', 'settings']);

  const key = 'dashboard';
  return t(key);
};

export default usePageTitle;
