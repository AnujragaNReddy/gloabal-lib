import { forwardRef, useId } from 'react';
import type { ReactNode, TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum width preset — `sm` 204px, `md` 280px, `lg` 336px. @default 'md' */
  size?: TextareaSize;
  /** Visible label rendered above the field. */
  label?: ReactNode;
  /** Error state — `true`, or a message shown below the field. */
  error?: boolean | string;
  /** Helper text shown below the field (replaced by the error message). */
  hint?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** CSS resize behaviour. @default 'vertical' */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Class for the outer wrapper. `className` targets the `<textarea>` itself. */
  containerClassName?: string;
}

/**
 * Multi-line text field. Same label / hint / error / state model as `Input`,
 * with a configurable `resize` handle.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    label,
    error,
    hint,
    fullWidth = false,
    resize = 'vertical',
    rows = 3,
    disabled,
    required,
    id,
    className,
    containerClassName,
    style,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const fieldId = id ?? `${reactId}-textarea`;
  const messageId = `${reactId}-message`;

  const hasError = Boolean(error);
  const message = typeof error === 'string' ? error : hasError ? undefined : hint;
  const describedBy = cn(message ? messageId : undefined, ariaDescribedby) || undefined;

  return (
    <div
      className={cn(
        styles.root,
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        hasError && styles.hasError,
        containerClassName,
      )}
    >
      {label ? (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required ? (
            <span aria-hidden="true" className={styles.required}>
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={cn(styles.textarea, className)}
        style={{ resize, ...style }}
        disabled={disabled}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        {...rest}
      />

      {message ? (
        <p id={messageId} className={styles.message} role={hasError ? 'alert' : undefined}>
          {message}
        </p>
      ) : null}
    </div>
  );
});
