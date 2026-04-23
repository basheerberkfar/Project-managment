import type { Control, FieldValues, Path } from 'react-hook-form';
import PasswordInput from '.';

type PasswordConfirmationFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  passwordName: Path<T>;
  confirmPasswordName: Path<T>;
  passwordLabel: string;
  confirmPasswordLabel: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  required?: boolean;
  showErrorOnTouchedOnly?: boolean;
  className?: string;
};

const PasswordConfirmationFields = <T extends FieldValues>({
  control,
  passwordName,
  confirmPasswordName,
  passwordLabel,
  confirmPasswordLabel,
  passwordPlaceholder,
  confirmPasswordPlaceholder,
  required,
  showErrorOnTouchedOnly,
  className,
}: PasswordConfirmationFieldsProps<T>) => {
  return (
    <div className={className ?? 'grid grid-cols-1 gap-4 md:grid-cols-2'}>
      <PasswordInput
        name={passwordName}
        control={control}
        label={passwordLabel}
        placeholder={passwordPlaceholder}
        required={required}
        showErrorOnTouchedOnly={showErrorOnTouchedOnly}
      />
      <PasswordInput
        name={confirmPasswordName}
        control={control}
        label={confirmPasswordLabel}
        placeholder={confirmPasswordPlaceholder}
        required={required}
        showErrorOnTouchedOnly={showErrorOnTouchedOnly}
      />
    </div>
  );
};

export default PasswordConfirmationFields;
