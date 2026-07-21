import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';

type ErrorFormProps = {
  message?: string | null;
  className?: string;
};

export default function ErrorForm({ message, className }: ErrorFormProps) {
  if (!message) return null;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-xl border border-danger-500/30 bg-danger-500/8 px-4 py-3 text-danger-500',
        className
      )}
      role="alert"
    >
      <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
      <p className="text-sm font-medium leading-6">{message}</p>
    </div>
  );
}
