import { Toggle } from '@/components/ui/toggle';

interface StatusToggleProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const StatusToggle = ({
  value,
  onChange,
  loading,
  disabled,
}: StatusToggleProps) => {
  return (
    <Toggle
      checked={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
    />
  );
};
