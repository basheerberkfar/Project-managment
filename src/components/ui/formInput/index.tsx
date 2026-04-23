import { Controller } from 'react-hook-form';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import Input from '../input';
import type { InputProps } from '../input';
interface FormInputProps<T extends FieldValues> extends Omit<
  InputProps<T>,
  'value' | 'onChange' | 'onBlur'
> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  showErrorOnTouchedOnly?: boolean;
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  showErrorOnTouchedOnly = true,
  required,
  ...inputProps
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...inputProps}
          required={required}
          error={
            showErrorOnTouchedOnly
              ? fieldState.isTouched && fieldState.error?.message
                ? fieldState.error?.message
                : undefined
              : fieldState.error?.message
          }
        />
      )}
    />
  );
};

export default FormInput;
