import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from './Radio';

const options = [
  { value: 'auto', label: 'Auto' },
  { value: 'fixed', label: 'Fixed' },
];

describe('RadioGroup', () => {
  it('renders a labelled radiogroup with options', () => {
    render(<RadioGroup label="Size" options={options} />);
    const group = screen.getByRole('radiogroup', { name: 'Size' });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('selects an option and reports the value', async () => {
    const onChange = vi.fn();
    render(<RadioGroup label="Size" options={options} onChange={onChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Fixed' }));

    expect(onChange).toHaveBeenCalledWith('fixed');
    expect(screen.getByRole('radio', { name: 'Fixed' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Auto' })).not.toBeChecked();
  });

  it('honours the controlled value', () => {
    render(<RadioGroup label="Size" options={options} value="auto" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Auto' })).toBeChecked();
  });

  it('disables every option when the group is disabled', () => {
    render(<RadioGroup label="Size" options={options} disabled />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
  });

  it('exposes the error message', () => {
    render(<RadioGroup label="Size" options={options} error="Pick one" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Pick one');
  });

  it('works with Radio children instead of options', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Colour" onChange={onChange}>
        <Radio value="r" label="Red" />
        <Radio value="g" label="Green" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Green' }));
    expect(onChange).toHaveBeenCalledWith('g');
  });
});
