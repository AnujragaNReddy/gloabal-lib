import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Minimum width preset — `sm` 204px, `md` 280px, `lg` 336px. @default 'md' */
  size?: InputSize;
  /** Visible label rendered above the field. */
  label?: ReactNode;
  /** Error state — `true`, or a message shown below the field. */
  error?: boolean | string;
  /** Helper text shown below the field (replaced by the error message). */
  hint?: ReactNode;
  /** Content rendered inside the field, before the input. */
  startAdornment?: ReactNode;
  /** Content rendered inside the field, after the input. */
  endAdornment?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** Class for the outer wrapper. `className` targets the `<input>` itself. */
  containerClassName?: string;
}

/**
 * Single-line text field with label, hint / error text and optional
 * start / end adornments. States (empty · filled · focus · disabled · error)
 * are driven by `--engen-input-*` tokens.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    label,
    error,
    hint,
    startAdornment,
    endAdornment,
    fullWidth = false,
    disabled,
    required,
    id,
    className,
    containerClassName,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `${reactId}-input`;
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
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? (
            <span aria-hidden="true" className={styles.required}>
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}

      <div className={styles.field}>
        {startAdornment ? <span className={styles.adornment}>{startAdornment}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(styles.input, className)}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {endAdornment ? <span className={styles.adornment}>{endAdornment}</span> : null}
      </div>

      {message ? (
        <p id={messageId} className={styles.message} role={hasError ? 'alert' : undefined}>
          {message}
        </p>
      ) : null}
    </div>
  );
});
