import type { MutableRefObject, Ref, RefCallback } from 'react';

/**
 * Combine several refs (object or callback) into one callback ref so a component
 * can both expose a forwarded ref and keep its own internal ref.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object') {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}
