import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';
import styles from './Radio.module.css';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onSelect: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Radio                                                                     */
/* -------------------------------------------------------------------------- */

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  value: string;
  label?: ReactNode;
  onChange?: (value: string) => void;
}

/**
 * A single radio control. Use inside `RadioGroup` (which wires `name`, the
 * selected value and `disabled` through context) or standalone with
 * `checked` + `onChange`.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, disabled, checked, onChange, name, className, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const isChecked = group ? group.value === value : checked;
  const isDisabled = (group ? group.disabled : false) || disabled;
  const resolvedName = group ? group.name : name;

  return (
    <label className={cn(styles.radio, isDisabled && styles.disabled, className)}>
      <input
        ref={ref}
        type="radio"
        className={styles.input}
        name={resolvedName}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => {
          if (!event.target.checked) return;
          group?.onSelect(value);
          onChange?.(value);
        }}
        {...rest}
      />
      <span className={styles.control} aria-hidden="true" />
      {label != null ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});

/* -------------------------------------------------------------------------- */
/* RadioGroup                                                                */
/* -------------------------------------------------------------------------- */

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Options to render. Omit to pass `<Radio>` children instead. */
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shared `name` for the inputs. Auto-generated when omitted. */
  name?: string;
  /** Number of columns in the option grid. @default 1 */
  columns?: number;
  disabled?: boolean;
  /** Group label (also the accessible name). */
  label?: ReactNode;
  /** Error state — `true`, or a message shown below the group. */
  error?: boolean | string;
  className?: string;
  children?: ReactNode;
}

/** Groups radios, manages the selected value and lays them out in `columns`. */
export function RadioGroup({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  name,
  columns = 1,
  disabled = false,
  label,
  error,
  className,
  children,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? `${reactId}-radio`;
  const labelId = `${reactId}-label`;
  const messageId = `${reactId}-message`;

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange,
  });

  const hasError = Boolean(error);
  const message = typeof error === 'string' ? error : undefined;

  const context = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      value: value || undefined,
      onSelect: (next: string) => setValue(next),
      disabled,
    }),
    [groupName, value, disabled, setValue],
  );

  return (
    <div className={cn(styles.group, className)}>
      {label != null ? (
        <span id={labelId} className={styles.groupLabel}>
          {label}
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label != null ? labelId : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={message ? messageId : undefined}
        className={styles.options}
        style={columns > 1 ? { gridTemplateColumns: `repeat(${columns}, max-content)` } : undefined}
      >
        <RadioGroupContext.Provider value={context}>
          {options
            ? options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))
            : children}
        </RadioGroupContext.Provider>
      </div>
      {message ? (
        <p id={messageId} className={styles.message} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
