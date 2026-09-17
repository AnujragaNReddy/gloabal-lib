import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../utils/cn';
import { mergeRefs } from '../../utils/mergeRefs';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface ModalProps {
  /** Whether the modal is rendered. */
  open: boolean;
  /** Requested close — from the backdrop, the ✕ button or the Escape key. */
  onClose: () => void;
  /** Heading text. Provides the dialog's accessible name. */
  title?: ReactNode;
  /** Supporting text under the title. Wired to `aria-describedby`. */
  description?: ReactNode;
  children?: ReactNode;
  /** Footer content, typically action buttons. */
  footer?: ReactNode;
  /** Max width preset. @default 'md' */
  size?: ModalSize;
  /** Close when the backdrop is clicked. @default true */
  closeOnOverlayClick?: boolean;
  /** Close when Escape is pressed. @default true */
  closeOnEsc?: boolean;
  /** Render the ✕ button in the header. @default true */
  showCloseButton?: boolean;
  /** Accessible label for the ✕ button. @default 'Close' */
  closeButtonLabel?: string;
  /** Portal target. @default document.body */
  container?: Element | null;
  /** Element focused on open. Defaults to the first focusable node, else the dialog. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
  overlayClassName?: string;
  /** Accessible name when no `title` is supplied. */
  'aria-label'?: string;
}

/**
 * A modal dialog rendered in a portal with a focus trap, focus restoration,
 * body-scroll lock, Escape-to-close and backdrop-to-close. Provide a `title`
 * or an `aria-label` so the dialog has an accessible name.
 *
 * Entry is animated; the modal unmounts immediately on close.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
    closeButtonLabel = 'Close',
    container,
    initialFocusRef,
    className,
    overlayClassName,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const baseId = useId();
  const titleId = title ? `${baseId}-title` : undefined;
  const descriptionId = description ? `${baseId}-description` : undefined;

  useLockBodyScroll(open);

  // Remember the trigger, move focus in, restore it on close/unmount.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    const target =
      initialFocusRef?.current ??
      dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
      dialog;
    target?.focus({ preventScroll: true });

    return () => {
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open, initialFocusRef]);

  // Escape to close + Tab focus trap.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, closeOnEsc, onClose]);

  const handleOverlayMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- backdrop dismissal is a pointer convenience; keyboard users have Escape and the close button
    <div className={cn(styles.overlay, overlayClassName)} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={mergeRefs(ref, dialogRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={cn(styles.dialog, styles[size], className)}
      >
        {title || showCloseButton ? (
          <header className={styles.header}>
            {title ? (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton ? (
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label={closeButtonLabel}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
          </header>
        ) : null}

        {description ? (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        ) : null}

        <div className={styles.body}>{children}</div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    container ?? document.body,
  );
});
