import { forwardRef, useMemo, useRef } from 'react';

import { mergeRefs } from '../../utils/mergeRefs';
import { Input, type InputProps } from '../Input';
import { CalendarIcon } from '../internal/icons';
import styles from './DateInput.module.css';

export type DateInputProps = Omit<InputProps, 'type' | 'endAdornment' | 'startAdornment'>;

/**
 * Native date field built on `Input`. The browser's own picker indicator is
 * hidden in favour of a calendar button that calls `showPicker()`; on `error`
 * the calendar turns red, matching the design.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { className, ...rest },
  forwardedRef,
) {
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useMemo(() => mergeRefs(forwardedRef, localRef), [forwardedRef]);

  return (
    <Input
      ref={ref}
      type="date"
      className={[styles.dateInput, className].filter(Boolean).join(' ')}
      endAdornment={
        <button
          type="button"
          tabIndex={-1}
          className={styles.calendarButton}
          aria-label="Open calendar"
          onClick={() => localRef.current?.showPicker?.()}
        >
          <CalendarIcon />
        </button>
      }
      {...rest}
    />
  );
});
