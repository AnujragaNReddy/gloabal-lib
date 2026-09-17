import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { CloseIcon } from '../internal/icons';
import styles from './Tag.module.css';

export type TagVariant = 'subtle' | 'solid';
export type TagSize = 'sm' | 'md';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'subtle' */
  variant?: TagVariant;
  /** @default 'md' */
  size?: TagSize;
  /** Leading element (icon, dot, …). */
  icon?: ReactNode;
  /** Show a remove button; called when it is activated. */
  onRemove?: () => void;
  /** Accessible label for the remove button. @default 'Remove' */
  removeLabel?: string;
}

/**
 * A compact label / chip. Two variants — `subtle` (grey) and `solid` (blue) —
 * with an optional remove button.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { variant = 'subtle', size = 'md', icon, onRemove, removeLabel = 'Remove', className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.tag, styles[variant], styles[size], className)}
      {...rest}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {onRemove ? (
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <CloseIcon />
        </button>
      ) : null}
    </span>
  );
});
