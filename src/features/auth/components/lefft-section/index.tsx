import { useTranslation } from 'react-i18next';
import Logo from '@/assets/svgs/auth/auth-primary-logo.svg';

const LoginLeftSection = () => {
  const { t } = useTranslation('auth');
  return (
    <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-screen bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark-card-surface opacity-90" />

      {/* Optional Content */}
      <div className="relative flex flex-col z-10 h-screen items-center justify-center text-white p-8">
        <div className="flex items-center gap-2.5">
          <img src={Logo} alt="logo" />
          <p className="!font-Playfair tracking-widest uppercase leading-[100%] font-bold text-[.875rem]">
            Secnt World
          </p>
        </div>
        <h2 className="text-[2.125rem] font-semibold text-center">
          {t('left-side.title')}
        </h2>
      </div>
    </div>
  );
};

export default LoginLeftSection;
