/* eslint-disable react-hooks/refs */
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';

export const DEFAULT_TOAST_DURATION_MS = 4000;
const DEFAULT_DURATION_MS = DEFAULT_TOAST_DURATION_MS;

export type ToastVariant =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export type ToastAction = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

export type ToastItem = {
  id: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
};

type ToastContextValue = {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantAccent: Record<
  ToastVariant,
  { borderLeft: string; icon: string; bg: string; border: string }
> = {
  default: {
    borderLeft: 'border-s-4 border-s-gray-light-500',
    icon: 'text-gray-light-600 dark:text-gray-dark-400',
    bg: 'bg-gray-light-100 dark:bg-dark-card-surface',
    border: 'border border-gray-light-400 dark:border-dark-card-border',
  },
  success: {
    borderLeft: 'border-s-4 border-s-[var(--color-toast-success)]',
    icon: 'text-[var(--color-toast-success)]',
    bg: 'bg-[var(--color-toast-success)]/5 dark:bg-[var(--color-toast-success)]/10',
    border: 'border border-[var(--color-toast-success)]/50',
  },
  info: {
    borderLeft: 'border-s-4 border-s-primary-light-500',
    icon: 'text-primary-light-500',
    bg: 'bg-primary-light-500/5 dark:bg-primary-light-500/10',
    border: 'border border-primary-light-500/50',
  },
  warning: {
    borderLeft: 'border-s-4 border-s-warning-500',
    icon: 'text-warning-500',
    bg: 'bg-warning-500/5 dark:bg-warning-500/10',
    border: 'border border-warning-500/50',
  },
  danger: {
    borderLeft: 'border-s-4 border-s-danger-500',
    icon: 'text-danger-500',
    bg: 'bg-danger-500/5 dark:bg-danger-500/10',
    border: 'border border-danger-500/50',
  },
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: <Info size={20} weight="fill" />,
  success: <CheckCircle size={20} weight="fill" />,
  info: <Info size={20} weight="fill" />,
  warning: <WarningCircle size={20} weight="fill" />,
  danger: <XCircle size={20} weight="fill" />,
};

const Toast = ({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) => {
  const variant = toast.variant ?? 'default';
  const styles = variantAccent[variant];
  const durationMs = toast.duration ?? DEFAULT_DURATION_MS;
  const hasCountdown = durationMs > 0;
  const countdownClass =
    variant === 'danger'
      ? 'text-danger-700 dark:text-danger-300'
      : variant === 'warning'
        ? 'text-warning-700 dark:text-warning-300'
        : variant === 'info'
          ? 'text-primary-light-700 dark:text-primary-light-300'
          : 'text-gray-light-700 dark:text-gray-dark-300';
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    hasCountdown ? Math.ceil(durationMs / 1000) : 0
  );
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!hasCountdown || isPaused || remainingSeconds <= 0) return;
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onCloseRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasCountdown, isPaused, remainingSeconds]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => hasCountdown && setIsPaused(true)}
      onMouseLeave={() => hasCountdown && setIsPaused(false)}
      className={clsx(
        'flex items-start gap-3 rounded-lg px-4 py-3 shadow-xl min-w-[320px] max-w-[460px]',
        'bg-white dark:bg-dark-card-surface',
        styles.border,
        styles.borderLeft,
        styles.bg
      )}
    >
      <div className={clsx('shrink-0 pt-0.5', styles.icon)}>
        {variantIcons[variant]}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        {toast.title ? (
          <>
            <p className="text-sm font-semibold text-gray-light-900 dark:text-white">
              {toast.title}
            </p>
            <p className="text-[0.8125rem] text-gray-light-700 dark:text-gray-dark-400 mt-0.5">
              {toast.description}
            </p>
          </>
        ) : (
          <p className="text-[0.8125rem] text-gray-light-900 dark:text-gray-dark-200">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={clsx(
              'mt-2 text-xs font-semibold underline transition-colors',
              toast.action.variant === 'danger'
                ? 'text-danger-500'
                : 'text-primary-light-500'
            )}
          >
            {toast.action.label}
          </button>
        )}
        {hasCountdown && variant !== 'success' && (
          <p className="mt-2 text-[0.6875rem] font-semibold tabular-nums">
            {isPaused ? (
              <span className={countdownClass}>
                {remainingSeconds}s (متوقف)
              </span>
            ) : (
              <span className={countdownClass}>{remainingSeconds}s</span>
            )}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 p-1 cursor-pointer rounded text-gray-light-600 hover:text-gray-light-900 dark:text-gray-dark-400 dark:hover:text-white transition-colors mt-0.5"
        aria-label="Close"
      >
        <X size={18} weight="bold" />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? DEFAULT_DURATION_MS;
    setToasts((prev) => [...prev, { ...toast, id, duration }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center pointer-events-none [&>*]:pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
