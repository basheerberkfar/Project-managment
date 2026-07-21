import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import { XCircle } from '@phosphor-icons/react';
import type React from 'react';

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  bodyClassName?: string;
  preventAutoFocus?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  open,
  setOpen,
  title,
  children,
  footer,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle,
  bodyClassName,
  preventAutoFocus = false,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className={clsx(
                    'fixed inset-0 bg-black/50 z-50',
                    overlayClassName
                  )}
                  style={overlayStyle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content
                asChild
                onOpenAutoFocus={
                  preventAutoFocus
                    ? (event) => {
                        event.preventDefault();
                      }
                    : undefined
                }
              >
                <motion.div
                  className={clsx(
                    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark-card-background rounded-[8px] w-[94vw] sm:w-[500px] max-w-[94vw] max-h-[calc(100vh-1rem)] overflow-visible flex flex-col shadow-lg z-50',
                    contentClassName
                  )}
                  style={contentStyle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between border border-light-card-border px-4 py-3 sm:px-6 sm:py-4 dark:border-dark-card-border">
                    <Dialog.Title asChild>
                      <div className="text-lg font-semibold">{title}</div>
                    </Dialog.Title>
                    <XCircle
                      size={22}
                      className="text-gray-500 cursor-pointer hover:text-gray-700"
                      onClick={() => setOpen(false)}
                    />
                  </div>

                  <div
                    className={clsx(
                      'relative z-0 flex-1 overflow-y-auto p-4 sm:p-6',
                      bodyClassName
                    )}
                  >
                    {children}
                  </div>

                  {footer && (
                    <div className="relative z-10 flex flex-col-reverse gap-2 border-t border-light-card-border px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4 dark:border-dark-card-border">
                      {footer}
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
