import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

type PointerHandler = (event: MouseEvent | TouchEvent) => void;

/**
 * Calls `handler` when a pointer press starts outside every provided element.
 * Pass a single ref or an array (e.g. a trigger plus its popover).
 *
 * Memoise the array argument so the listener isn't re-attached each render.
 */
export function useOnClickOutside(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  handler: PointerHandler,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;

      const list = Array.isArray(refs) ? refs : [refs];
      const isInside = list.some((ref) => ref.current?.contains(target));
      if (!isInside) handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);
    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [refs, enabled]);
}
