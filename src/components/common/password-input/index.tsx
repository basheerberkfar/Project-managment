import FormInput from '@/components/ui/formInput';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Eye, EyeSlashIcon, Lock } from '@phosphor-icons/react';

type PasswordInput<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showErrorOnTouchedOnly?: boolean;
  autoComplete?: string;
};

const PasswordInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  showErrorOnTouchedOnly,
  autoComplete,
}: PasswordInput<T>) => {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <FormInput
      name={name}
      control={control}
      label={label}
      required={required}
      placeholder={placeholder ?? t('right-side.password')}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      leftIcon={<Lock size={16} />}
      rightIcon={!showPassword ? <EyeSlashIcon size={16} /> : <Eye size={16} />}
      onRightIconClick={togglePassword}
      showErrorOnTouchedOnly={showErrorOnTouchedOnly}
    />
  );
};

export default PasswordInput;
