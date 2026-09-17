import { forwardRef, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { AlertTriangleIcon, CheckCircleIcon, CloseIcon, DownloadIcon } from '../internal/icons';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'progress';

export interface ToastProps {
  /** @default 'success' */
  variant?: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  /** Auto-dismiss delay in ms; also the length of the countdown bar. `0` disables it. @default 4000 */
  duration?: number;
  onClose?: () => void;
  /** Override the leading icon. */
  icon?: ReactNode;
  /** Show the × button. @default true */
  showClose?: boolean;
  className?: string;
}

const variantIcon: Record<ToastVariant, ReactNode> = {
  success: <CheckCircleIcon />,
  error: <AlertTriangleIcon />,
  progress: <DownloadIcon />,
};

/**
 * A single flash message. Usually created via `useToast()`, but can be rendered
 * directly. Auto-dismisses after `duration`, with a matching countdown bar.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = 'success', title, description, duration = 4000, onClose, icon, showClose = true, className },
  ref,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = setTimeout(() => onCloseRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(styles.toast, styles[variant], className)}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? variantIcon[variant]}
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {showClose ? (
        <button type="button" className={styles.close} aria-label="Dismiss" onClick={onClose}>
          <CloseIcon />
        </button>
      ) : null}
      {duration > 0 ? (
        <span className={styles.bar} style={{ animationDuration: `${duration}ms` }} />
      ) : null}
    </div>
  );
});
