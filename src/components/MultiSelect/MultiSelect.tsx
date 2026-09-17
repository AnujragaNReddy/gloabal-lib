import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { cn } from '../../utils/cn';
import { mergeRefs } from '../../utils/mergeRefs';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../internal/icons';
import styles from './MultiSelect.module.css';

export type MultiSelectSize = 'sm' | 'md' | 'lg';

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
  /** Right-aligned secondary text, e.g. an ID code. */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** Controlled list of selected values. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Text shown when nothing is selected. @default 'Select' */
  placeholder?: string;
  /** Show a filter input inside the panel. */
  searchable?: boolean;
  /** Show the "Select All" / "Deselect All" toggle. @default true */
  showSelectAll?: boolean;
  /** Trigger label once items are selected. @default `${n} Selected` */
  formatTriggerLabel?: (count: number) => ReactNode;
  /** Render only the list — no trigger, always open (for filter sidebars). */
  inline?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Minimum width preset — `sm` 160px, `md` 240px, `lg` 320px. @default 'md' */
  size?: MultiSelectSize;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const textOf = (option: MultiSelectOption): string =>
  typeof option.label === 'string' ? option.label : option.value;

const firstEnabled = (list: MultiSelectOption[]): number => list.findIndex((o) => !o.disabled);

const defaultFormat = (count: number) => `${count} Selected`;

/**
 * Multi-value picker with checkbox rows following the ARIA multi-select listbox
 * pattern. Optional in-panel search and a "Select All" / "Deselect All"
 * toggle. The trigger turns solid blue and shows a count once items are chosen.
 * Set `inline` to drop the trigger and render the list directly.
 * Keyboard: ↑/↓/Home/End move, Space/Enter toggle, Esc closes.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Select',
    searchable = false,
    showSelectAll = true,
    formatTriggerLabel = defaultFormat,
    inline = false,
    disabled = false,
    fullWidth = false,
    size = 'md',
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  },
  ref,
) {
  const [value, setValue] = useControllableState<string[]>({
    value: valueProp,
    defaultValue: defaultValue ?? [],
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

  const panelOpen = inline || open;

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => textOf(o).toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selectedSet = useMemo(() => new Set(value), [value]);
  const enabledFilteredValues = useMemo(
    () => filtered.filter((o) => !o.disabled).map((o) => o.value),
    [filtered],
  );
  const allFilteredSelected =
    enabledFilteredValues.length > 0 && enabledFilteredValues.every((v) => selectedSet.has(v));

  function closePanel(returnFocus = false) {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }

  function openPanel() {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(firstEnabled(filtered));
  }

  useOnClickOutside(outsideRefs, () => closePanel(), open && !inline);

  useEffect(() => {
    if (!open || inline) return;
    (searchable ? searchRef.current : listRef.current)?.focus();
  }, [open, inline, searchable]);

  useEffect(() => {
    if (!panelOpen || activeIndex < 0) return;
    const nodes = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    nodes?.[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [panelOpen, activeIndex]);

  function toggleValue(optionValue: string) {
    setValue((prev) =>
      prev.includes(optionValue) ? prev.filter((v) => v !== optionValue) : [...prev, optionValue],
    );
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      const remove = new Set(enabledFilteredValues);
      setValue((prev) => prev.filter((v) => !remove.has(v)));
    } else {
      setValue((prev) => Array.from(new Set([...prev, ...enabledFilteredValues])));
    }
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
      case ' ': {
        if (event.key === ' ' && searchable && event.target === searchRef.current) return;
        event.preventDefault();
        const option = filtered[activeIndex];
        if (option && !option.disabled) toggleValue(option.value);
        break;
      }
      case 'Escape':
        if (inline) break;
        event.preventDefault();
        closePanel(true);
        break;
      case 'Tab':
        if (!inline) closePanel();
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

  const count = value.length;
  const filled = count > 0;

  const body = (
    <>
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

      {showSelectAll ? (
        <button type="button" className={styles.selectAll} onClick={toggleSelectAll}>
          {allFilteredSelected ? 'Deselect All' : 'Select All'}
        </button>
      ) : null}

      <div
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable="true"
        tabIndex={searchable && !inline ? -1 : 0}
        aria-label={ariaLabel ?? placeholder}
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        className={styles.list}
        onKeyDown={onPanelKeyDown}
      >
        {filtered.length === 0 ? (
          <div className={styles.empty}>No results</div>
        ) : (
          filtered.map((option, index) => {
            const isSelected = selectedSet.has(option.value);
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
                onClick={() => !option.disabled && toggleValue(option.value)}
              >
                <span className={styles.box} data-checked={isSelected || undefined}>
                  {isSelected ? <CheckIcon /> : null}
                </span>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.meta ? <span className={styles.optionMeta}>{option.meta}</span> : null}
              </div>
            );
          })
        )}
      </div>
    </>
  );

  if (inline) {
    return (
      <div
        ref={composedRef}
        className={cn(styles.root, styles[size], fullWidth && styles.fullWidth, className)}
      >
        <div className={styles.inlinePanel}>{body}</div>
      </div>
    );
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
          {filled ? formatTriggerLabel(count) : placeholder}
        </span>
        {searchable ? <SearchIcon className={styles.triggerSearchIcon} /> : null}
        <ChevronDownIcon className={styles.chevron} />
      </button>

      {open ? <div className={styles.panel}>{body}</div> : null}
    </div>
  );
});
