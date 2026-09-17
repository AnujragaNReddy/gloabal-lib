import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils/cn';
import { Toast, type ToastVariant } from './Toast';
import styles from './Toast.module.css';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  description?: ReactNode;
  duration?: number;
  showClose?: boolean;
  icon?: ReactNode;
}

interface ToastRecord extends ToastOptions {
  id: string;
  variant: ToastVariant;
  title: ReactNode;
}

export interface ToastApi {
  show: (variant: ToastVariant, title: ReactNode, options?: ToastOptions) => string;
  success: (title: ReactNode, options?: ToastOptions) => string;
  error: (title: ReactNode, options?: ToastOptions) => string;
  progress: (title: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const genId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export interface ToastProviderProps {
  children: ReactNode;
  /** @default 'top-right' */
  position?: ToastPosition;
  /** Maximum toasts shown at once; the oldest is dropped. @default 4 */
  max?: number;
  /** Auto-dismiss delay used when a toast doesn't set its own (ms). @default 4000 */
  defaultDuration?: number;
  /** Portal target. @default document.body */
  container?: Element | null;
}

/** Provides the `useToast()` API and renders the toast stack in a portal. */
export function ToastProvider({
  children,
  position = 'top-right',
  max = 4,
  defaultDuration = 4000,
  container,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const show = useCallback(
    (variant: ToastVariant, title: ReactNode, options?: ToastOptions) => {
      const id = genId();
      setToasts((prev) => [...prev, { id, variant, title, ...options }].slice(-max));
      return id;
    },
    [max],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, options) => show('success', title, options),
      error: (title, options) => show('error', title, options),
      progress: (title, options) => show('progress', title, options),
      dismiss,
      dismissAll,
    }),
    [show, dismiss, dismissAll],
  );

  const target = container ?? (typeof document !== 'undefined' ? document.body : null);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {target
        ? createPortal(
            <div
              className={cn(styles.viewport, styles[position])}
              role="region"
              aria-label="Notifications"
            >
              {toasts.map(({ id, variant, title, duration, ...opts }) => (
                <Toast
                  key={id}
                  variant={variant}
                  title={title}
                  duration={duration ?? defaultDuration}
                  onClose={() => dismiss(id)}
                  {...opts}
                />
              ))}
            </div>,
            target,
          )
        : null}
    </ToastContext.Provider>
  );
}

/** Access the toast API. Must be called under a `<ToastProvider>`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used inside a <ToastProvider>.');
  }
  return ctx;
}
