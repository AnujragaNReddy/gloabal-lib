import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { cn } from '../../utils/cn';
import { mergeRefs } from '../../utils/mergeRefs';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../internal/icons';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Right-aligned secondary text, e.g. an ID code. */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  /** Controlled selected value (`''` = nothing selected). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Text shown when nothing is selected. @default 'Select' */
  placeholder?: string;
  /** Show a filter input inside the panel. */
  searchable?: boolean;
  disabled?: boolean;
  /** Stretch the control to the container width. */
  fullWidth?: boolean;
  /** Minimum width preset — `sm` 160px, `md` 240px, `lg` 320px. @default 'md' */
  size?: SelectSize;
  /** Submit the value with a form (renders a hidden input). */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const textOf = (option: SelectOption): string =>
  typeof option.label === 'string' ? option.label : option.value;

const firstEnabled = (list: SelectOption[]): number => list.findIndex((o) => !o.disabled);

/**
 * Single-value select following the ARIA listbox pattern. The trigger turns
 * solid blue once a value is chosen. Optional in-panel search filters options.
 * Keyboard: ↑/↓/Home/End move, Enter/Space choose, Esc closes.
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Select',
    searchable = false,
    disabled = false,
    fullWidth = false,
    size = 'md',
    name,
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  },
  ref,
) {
  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange,
  });
  const [open, setOpen] = useControllableState<boolean>({ defaultValue: false });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const optionId = (index: number) => `${reactId}-opt-${index}`;

  const composedRef = useMemo(() => mergeRefs(ref, rootRef), [ref]);
  const outsideRefs = useMemo(() => [rootRef], []);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => textOf(o).toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );
  const filled = Boolean(selectedOption);

  function closePanel(returnFocus = false) {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }

  function openPanel() {
    if (disabled) return;
    setOpen(true);
    const selected = filtered.findIndex((o) => o.value === value);
    setActiveIndex(selected >= 0 ? selected : firstEnabled(filtered));
  }

  useOnClickOutside(outsideRefs, () => closePanel(), open);

  useEffect(() => {
    if (!open) return;
    (searchable ? searchRef.current : listRef.current)?.focus();
  }, [open, searchable]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const nodes = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    nodes?.[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);

  function commit(option?: SelectOption) {
    const target = option ?? filtered[activeIndex];
    if (!target || target.disabled) return;
    setValue(target.value);
    closePanel(true);
  }

  function move(delta: 1 | -1) {
    if (filtered.length === 0) return;
    let index = activeIndex;
    for (let step = 0; step < filtered.length; step += 1) {
      index = (index + delta + filtered.length) % filtered.length;
      if (!filtered[index]?.disabled) {
        setActiveIndex(index);
        return;
      }
    }
  }

  function onPanelKeyDown(event: ReactKeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(firstEnabled(filtered));
        break;
      case 'End': {
        event.preventDefault();
        for (let i = filtered.length - 1; i >= 0; i -= 1) {
          if (!filtered[i]?.disabled) {
            setActiveIndex(i);
            break;
          }
        }
        break;
      }
      case 'Enter':
        event.preventDefault();
        commit();
        break;
      case ' ':
        if (!searchable) {
          event.preventDefault();
          commit();
        }
        break;
      case 'Escape':
        event.preventDefault();
        closePanel(true);
        break;
      case 'Tab':
        closePanel();
        break;
      default:
        break;
    }
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPanel();
    }
  }

  return (
    <div
      ref={composedRef}
      className={cn(styles.root, styles[size], fullWidth && styles.fullWidth, className)}
    >
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={styles.trigger}
        data-filled={filled || undefined}
        data-open={open || undefined}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={cn(styles.triggerLabel, !filled && styles.placeholder)}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className={styles.chevron} />
      </button>

      {open ? (
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.panelHeader}
            aria-label={`Collapse ${placeholder}`}
            onClick={() => closePanel(true)}
          >
            <span>{placeholder}</span>
            <ChevronDownIcon className={styles.chevronUp} />
          </button>

          {searchable ? (
            <div className={styles.search}>
              <SearchIcon className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="text"
                className={styles.searchInput}
                placeholder="Search"
                aria-label="Search"
                value={query}
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onPanelKeyDown}
              />
            </div>
          ) : null}

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-label={ariaLabel ?? placeholder}
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            className={styles.list}
            onKeyDown={searchable ? undefined : onPanelKeyDown}
          >
            {filtered.length === 0 ? (
              <div className={styles.empty}>No results</div>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- listbox option; keyboard is handled on the listbox container
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-active={index === activeIndex || undefined}
                    className={styles.option}
                    onMouseMove={() => {
                      if (!option.disabled && index !== activeIndex) setActiveIndex(index);
                    }}
                    onClick={() => commit(option)}
                  >
                    <span className={styles.optionCheck}>{isSelected ? <CheckIcon /> : null}</span>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {option.meta ? <span className={styles.optionMeta}>{option.meta}</span> : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
});
