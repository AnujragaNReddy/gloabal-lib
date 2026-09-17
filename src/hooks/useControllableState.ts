import { useCallback, useRef, useState } from 'react';

export interface UseControllableStateParams<T> {
  /** Controlled value. When not `undefined`, the component is controlled. */
  value?: T;
  /** Initial value for the uncontrolled case. */
  defaultValue: T;
  /** Called whenever the value should change (both modes). */
  onChange?: (value: T) => void;
}

type SetState<T> = (next: T | ((prev: T) => T)) => void;

/**
 * Bridges controlled and uncontrolled usage behind one `[value, setValue]` API
 * (the pattern Radix UI popularised). `setValue` accepts a value or an updater.
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, SetState<T>] {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);

  const value = isControlled ? (controlledValue as T) : uncontrolledValue;

  // Keep the latest onChange without recreating `setValue` every render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback<SetState<T>>(
    (next) => {
      const resolve = (prev: T): T =>
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next;

      if (isControlled) {
        onChangeRef.current?.(resolve(controlledValue as T));
      } else {
        setUncontrolledValue((prev) => {
          const resolved = resolve(prev);
          onChangeRef.current?.(resolved);
          return resolved;
        });
      }
    },
    [isControlled, controlledValue],
  );

  return [value, setValue];
}
