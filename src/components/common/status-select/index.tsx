import SelectInput, { type SelectInputProps } from '@/components/ui/select';
import { useStatusOptions } from '@/hooks/use-status-options';

type StatusSelectProps = Omit<SelectInputProps, 'options'> & {
  namespace?: 'products' | 'types' | 'clients' | 'delegates' | 'cars';
};

export default function StatusSelect({
  namespace = 'types',
  ...props
}: StatusSelectProps) {
  const options = useStatusOptions(namespace);

  return <SelectInput {...props} options={options} />;
}
