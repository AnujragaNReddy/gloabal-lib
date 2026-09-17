import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'outlined';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'solid' */
  variant?: ButtonVariant;
  /**
   * Minimum width preset from the design system — `sm` 160px, `md` 240px,
   * `lg` 320px. The button still grows to fit a longer label. @default 'md'
   */
  size?: ButtonSize;
  /** Show a spinner and block interaction. */
  isLoading?: boolean;
  /**
   * Text shown next to the spinner while `isLoading` (e.g. "Saving…").
   * When omitted, only the spinner is shown and the label is hidden.
   */
  loadingText?: ReactNode;
  /** Stretch to the full width of the container (overrides `size`). */
  fullWidth?: boolean;
  /** Element rendered before the label (hidden while loading). */
  leftIcon?: ReactNode;
  /** Element rendered after the label (hidden while loading). */
  rightIcon?: ReactNode;
}

/**
 * The primary call-to-action element. Two variants — `solid` and `outlined` —
 * each with default / hover / active / disabled states. Renders a native
 * `<button>` and forwards every standard button prop plus its ref.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    size = 'md',
    isLoading = false,
    loadingText,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const showLoadingText = isLoading && loadingText != null;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isLoading && styles.loading,
        showLoadingText && styles.loadingWithText,
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {showLoadingText ? (
        <span className={styles.label}>{loadingText}</span>
      ) : (
        <>
          {!isLoading && leftIcon ? (
            <span className={styles.icon} aria-hidden="true">
              {leftIcon}
            </span>
          ) : null}
          <span className={styles.label}>{children}</span>
          {!isLoading && rightIcon ? (
            <span className={styles.icon} aria-hidden="true">
              {rightIcon}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
});
