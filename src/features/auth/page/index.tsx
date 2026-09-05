/* eslint-disable react-hooks/use-memo */
import React from 'react';
import LoginBg from '@/assets/images/auth/login-background.jpg';
import { useTranslation } from 'react-i18next';
import FormInput from '@/components/ui/formInput';
import { useForm, type Resolver } from 'react-hook-form';
import PrimaryButton from '@/components/ui/button/primary-button';
import clsx from 'clsx';
import AnonymsNavbar from '../components/anonyms-navbar';
import FaceAuthModal from '../components/face-auth-modal';
import LoginLeftSection from '../components/lefft-section';
import PasswordInput from '@/components/common/password-input';
import { useToast } from '@/components/ui/toast';
import { getFirstAccessibleSidebarLink } from '@/components/layout/components/sidebar-schema';
import { Envelope, Fingerprint } from '@phosphor-icons/react';
import { useFaceLoginMutation, useLoginMutation } from '@/services/auth/auth.mutation';
import { createLoginSchema } from '../utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setAuthUser, setRefreshToken } from '@/utils/helpers';
import { handleFormErrors } from '@/utils/form-errors';
import type { LoginResponse } from '@/services/auth/auth.types';

type FormValues = {
  email: string;
  password: string;
};

const SplitLayout: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [faceModalOpen, setFaceModalOpen] = React.useState(false);

  const showToastMessage = React.useCallback(
    (message: string, variant: 'danger' | 'info' | 'success' = 'danger') => {
      showToast({
        variant,
        description: message,
      });
    },
    [showToast]
  );

  const dynamicResolver = React.useCallback(
    ((values, context, options) => {
      const schema = createLoginSchema({
        t: (key) => t(key),
      });

      return yupResolver(schema)(
        values as never,
        context,
        options as never
      ) as ReturnType<Resolver<FormValues>>;
    }) as Resolver<FormValues>,
    [t]
  );

  const { control, handleSubmit, setError } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: dynamicResolver,
    mode: 'onChange',
  });

  const { mutate: login, isPending: isLoggingIn } = useLoginMutation();
  const { mutate: faceLogin, isPending: isFaceLoggingIn } =
    useFaceLoginMutation();

  const handleLoginSuccess = (
    response: LoginResponse,
    successMessage?: string
  ) => {
    setAuthToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setAuthUser(response.user);
    const message = successMessage ?? response.message;
    if (message?.trim()) {
      showToastMessage(message, 'success');
    }
    navigate(getFirstAccessibleSidebarLink());
  };

  const handleLogin = (data: FormValues) => {
    login(
      {
        email: data.email.trim(),
        password: data.password,
      },
      {
        onSuccess: (response) => handleLoginSuccess(response),
        onError: (error) => {
          handleFormErrors<FormValues>({
            error,
            setError,
            fieldMap: {
              email: 'email',
              password: 'password',
            },
            fallbackMessage: t('right-side.login_failed'),
            toast: (message) => showToastMessage(message, 'danger'),
          });
        },
      }
    );
  };

  const handleFaceLogin = (faceDescriptor: number[]) => {
    faceLogin(
      { faceDescriptor },
      {
        onSuccess: (response) => {
          setFaceModalOpen(false);
          handleLoginSuccess(
            response,
            t('right-side.face_login_success', {
              name:
                response.user.full_name || response.user.name || response.user.email,
            })
          );
        },
        onError: () => showToastMessage(t('right-side.face_login_failed')),
      }
    );
  };

  const isSubmitting = isLoggingIn || isFaceLoggingIn;

  return (
    <div
      className="min-h-screen flex flex-col bg-fixed md:flex-row auth-container"
      style={{
        backgroundImage: `url(${LoginBg})`,
      }}
    >
      <LoginLeftSection />

      <div className="w-full md:w-1/2 h-screen dark:bg-dark-navbar bg-white flex flex-col">
        <AnonymsNavbar />
        <div className="w-full h-screen flex items-center justify-center">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="w-[400px] flex flex-col items-center justify-center gap-6"
          >
            <h3 className="dark:text-[var(--color-dark-primary)] text-[var(--color-light-text-primary)] text-[1.5rem] font-medium">
              {t('right-side.title')}
            </h3>
            <FormInput
              name="email"
              placeholder={t('right-side.email')}
              control={control}
              leftIcon={<Envelope size={16} />}
              disabled={isSubmitting}
              showErrorOnTouchedOnly={false}
            />
            <PasswordInput
              name="password"
              control={control}
              required
              placeholder={t('right-side.password')}
              showErrorOnTouchedOnly={false}
            />
            <PrimaryButton
              className={clsx('p-[12px] w-full h-[44px]')}
              variant="solid"
              type="submit"
              IconSize={16}
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
            >
              {t('right-side.title')}
            </PrimaryButton>
            <PrimaryButton
              className={clsx('p-[12px] w-full h-[44px]')}
              variant="outline"
              type="button"
              icon={<Fingerprint size={16} />}
              isSubmitting={isFaceLoggingIn}
              disabled={isSubmitting}
              onClick={() => setFaceModalOpen(true)}
            >
              {t('right-side.face_login')}
            </PrimaryButton>
          </form>
        </div>
      </div>
      <FaceAuthModal
        open={faceModalOpen}
        title={t('right-side.face_login')}
        description={t('right-side.camera_help')}
        captureText={t('right-side.face_login')}
        cancelText={t('right-side.cancel')}
        isSubmitting={isFaceLoggingIn}
        onClose={() => setFaceModalOpen(false)}
        onCapture={handleFaceLogin}
      />
    </div>
  );
};

export default SplitLayout;
