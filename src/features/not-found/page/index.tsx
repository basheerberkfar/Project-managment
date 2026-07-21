import ErrorLight from '@/assets/images/error/error-light.png';
import ErrorDark from '@/assets/images/error/error-dark.png';
import PrimaryButton from '@/components/ui/button/primary-button';
import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-dark-navbar bg-gray-light-100">
      <div className="bg-white dark:bg-dark-card-background border border-light-card-border dark:border-dark-card-border top-0 right-0 rounded-[12px] flex flex-col justify-center items-center gap-6 w-[664px] h-[520px]">
        <div className="mb-6">
          <img
            src={ErrorLight}
            alt="error"
            className="w-[138px] h-[116px] block dark:hidden"
          />

          <img
            src={ErrorDark}
            alt="error"
            className="w-[138px] h-[116px] hidden dark:block"
          />
        </div>
        <h1 className="dark:text-dark-primary text-light-text-primary text-[2.125rem] font-semibold">
          Oops! Page Not Found
        </h1>
        <p className="text-light-text-secondary dark:text-dark-secondary text-[1rem] w-[500px] text-center">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <PrimaryButton
          type="button"
          children={
            <div className="flex items-center gap-1">
              <span className="">
                <ArrowLeft />
              </span>
              Back To Home
            </div>
          }
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default NotFound;
