import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NumberInput } from './NumberInput';

const field = () => screen.getByLabelText('Amount') as HTMLInputElement;

describe('NumberInput', () => {
  it('emits numbers and null for empty', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Amount" onChange={onChange} />);

    fireEvent.change(field(), { target: { value: '12.5' } });
    expect(field()).toHaveValue('12.5');
    expect(onChange).toHaveBeenLastCalledWith(12.5);

    fireEvent.change(field(), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('rejects non-numeric input', () => {
    render(<NumberInput label="Amount" />);
    fireEvent.change(field(), { target: { value: '12.5' } });
    fireEvent.change(field(), { target: { value: '12.5abc' } });
    expect(field()).toHaveValue('12.5');
  });

  it('clamps to min/max on blur', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Amount" min={0} max={100} onChange={onChange} />);

    fireEvent.change(field(), { target: { value: '250' } });
    fireEvent.blur(field());

    expect(field()).toHaveValue('100');
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it('renders the prefix adornment', () => {
    render(<NumberInput label="Amount" prefix="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('syncs when the controlled value changes', () => {
    const { rerender } = render(<NumberInput label="Amount" value={5} onChange={() => {}} />);
    expect(field()).toHaveValue('5');
    rerender(<NumberInput label="Amount" value={42} onChange={() => {}} />);
    expect(field()).toHaveValue('42');
  });
});
