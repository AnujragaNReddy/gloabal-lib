import { forwardRef, useEffect, useState } from 'react';
import type { ChangeEvent, FocusEvent, ReactNode } from 'react';

import { Input, type InputProps } from '../Input';

export interface NumberInputProps
  extends Omit<
    InputProps,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'startAdornment' | 'prefix'
  > {
  /** Controlled numeric value (`null` = empty). */
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Left prefix, e.g. a currency symbol. */
  prefix?: ReactNode;
}

const format = (n: number | null | undefined): string =>
  n === null || n === undefined || Number.isNaN(n) ? '' : String(n);

const parse = (text: string): number | null => {
  const trimmed = text.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

const clamp = (n: number, min?: number, max?: number): number => {
  let out = n;
  if (typeof min === 'number') out = Math.max(out, min);
  if (typeof max === 'number') out = Math.min(out, max);
  return out;
};

/**
 * Numeric text field built on `Input`. Emits `number | null`, clamps to
 * `min` / `max` on blur, and accepts an optional `prefix` (e.g. a currency).
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue, onChange, min, max, prefix, inputMode = 'decimal', onBlur, ...rest },
  ref,
) {
  const isControlled = value !== undefined;
  const [text, setText] = useState<string>(() => format(value ?? defaultValue));

  useEffect(() => {
    if (isControlled && parse(text) !== value) setText(format(value));
    // Re-sync only when the controlled value prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isControlled]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) return;
    setText(raw);
    onChange?.(parse(raw));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const parsed = parse(text);
    if (parsed !== null) {
      const next = clamp(parsed, min, max);
      setText(format(next));
      if (next !== parsed) onChange?.(next);
    }
    onBlur?.(event);
  };

  return (
    <Input
      ref={ref}
      type="text"
      inputMode={inputMode}
      startAdornment={prefix}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  );
});
