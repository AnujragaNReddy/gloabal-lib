import { Fragment, forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { cn } from '../../utils/cn';
import { mergeRefs } from '../../utils/mergeRefs';
import styles from './Dropdown.module.css';

export type DropdownAlign = 'start' | 'end';

export interface DropdownItem {
  /** Stable, unique key. */
  id: string;
  label: ReactNode;
  /** Fired on click / Enter / Space. */
  onSelect?: () => void;
  /** Render the item as a link; `onSelect` still fires before navigation. */
  href?: string;
  disabled?: boolean;
  /** Leading decorative icon. */
  icon?: ReactNode;
  /** Draw a divider above this item. */
  separatorBefore?: boolean;
  /** Style as a destructive action (e.g. delete). */
  destructive?: boolean;
}

export interface DropdownProps {
  /** Content of the trigger button (text, icon, …). */
  trigger: ReactNode;
  items: DropdownItem[];
  /** Menu edge aligned to the trigger. @default 'start' */
  align?: DropdownAlign;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  /** Accessible name for the menu when the trigger text isn't descriptive. */
  'aria-label'?: string;
}

/**
 * An accessible menu-button dropdown (WAI-ARIA menu button pattern):
 * `ArrowDown` / `Enter` / `Space` open it, arrows + `Home` / `End` move a
 * roving focus, and `Esc` / `Tab` / outside-click close it and restore focus
 * to the trigger.
 *
 * Positioning is plain CSS with no collision detection — compose with a
 * library such as Floating UI if you need auto-flip/shift.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  {
    trigger,
    items,
    align = 'start',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    menuClassName,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const menuId = `${baseId}-menu`;

  const enabledIndexes = useMemo(
    () => items.reduce<number[]>((acc, item, i) => (item.disabled ? acc : [...acc, i]), []),
    [items],
  );

  const composedRef = useMemo(() => mergeRefs(ref, rootRef), [ref]);
  const outsideRefs = useMemo(() => [rootRef], []);

  useOnClickOutside(
    outsideRefs,
    () => {
      setOpen(false);
      setActiveIndex(-1);
    },
    open,
  );

  // Move DOM focus once the menu (and the target item) has rendered.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const openMenu = (edge: 'first' | 'last') => {
    if (disabled || items.length === 0) return;
    const target =
      edge === 'first' ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
    setActiveIndex(target ?? -1);
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  };

  const moveActive = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(activeIndex);
    const nextPos =
      pos === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (pos + direction + enabledIndexes.length) % enabledIndexes.length;
    const next = enabledIndexes[nextPos];
    if (next !== undefined) setActiveIndex(next);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu('last');
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(enabledIndexes[0] ?? -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    closeMenu(!item.href);
  };

  const setItemRef = (index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  };

  return (
    <div ref={composedRef} className={cn(styles.root, className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onClick={() => (open ? closeMenu(false) : openMenu('first'))}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.triggerLabel}>{trigger}</span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          tabIndex={-1}
          aria-labelledby={triggerId}
          aria-label={ariaLabel}
          aria-orientation="vertical"
          className={cn(styles.menu, align === 'end' && styles.alignEnd, menuClassName)}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => {
            const asLink = Boolean(item.href) && !item.disabled;
            const commonProps = {
              role: 'menuitem' as const,
              className: cn(styles.item, item.destructive && styles.destructive),
              tabIndex: index === activeIndex ? 0 : -1,
              'aria-disabled': item.disabled || undefined,
              onClick: () => handleSelect(item),
            };
            const content = (
              <>
                {item.icon ? (
                  <span className={styles.itemIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                <span className={styles.itemLabel}>{item.label}</span>
              </>
            );

            return (
              <Fragment key={item.id}>
                {item.separatorBefore && index > 0 ? (
                  <div role="separator" className={styles.separator} />
                ) : null}
                {asLink ? (
                  <a {...commonProps} ref={setItemRef(index)} href={item.href}>
                    {content}
                  </a>
                ) : (
                  <button
                    {...commonProps}
                    ref={setItemRef(index)}
                    type="button"
                    disabled={item.disabled}
                  >
                    {content}
                  </button>
                )}
              </Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});
