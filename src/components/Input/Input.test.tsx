import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" placeholder="Enter Data" />);
    expect(screen.getByLabelText('Email')).toBe(screen.getByPlaceholderText('Enter Data'));
  });

  it('types into the field', async () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'abc');
    expect(screen.getByLabelText('Name')).toHaveValue('abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('exposes an accessible error message', () => {
    render(<Input label="Field" error="Field cannot be blank" />);
    const input = screen.getByLabelText('Field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Field cannot be blank');
    expect(screen.getByRole('alert')).toHaveTextContent('Field cannot be blank');
  });

  it('shows hint text when there is no error', () => {
    render(<Input label="Field" hint="Helper text" />);
    expect(screen.getByLabelText('Field')).toHaveAccessibleDescription('Helper text');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders adornments and forwards the ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input label="Amount" startAdornment="$" ref={ref} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Input label="Field" disabled defaultValue="x" />);
    expect(screen.getByLabelText('Field')).toBeDisabled();
  });
});
