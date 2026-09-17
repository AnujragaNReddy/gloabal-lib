import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Freezes `document.body` scrolling while `locked` is true and compensates for
 * the removed scrollbar width so layout doesn't jump (used by `Modal`).
 */
export function useLockBodyScroll(locked: boolean): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    const { body } = document;
    const html = document.documentElement;
    const scrollBarWidth = window.innerWidth - html.clientWidth;

    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      const current = parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
      body.style.paddingRight = `${current + scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}
