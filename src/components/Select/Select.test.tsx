import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select, type SelectOption } from './Select';

const options: SelectOption[] = [
  { value: '10', label: '10 Rows/page' },
  { value: '20', label: '20 Rows/page' },
  { value: '50', label: '50 Rows/page' },
];

describe('Select', () => {
  it('shows the placeholder until a value is chosen', () => {
    render(<Select options={options} placeholder="Select" />);
    expect(screen.getByRole('button', { name: 'Select' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens a listbox and selects an option', async () => {
    const onChange = vi.fn();
    render(<Select options={options} placeholder="Select" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);

    await userEvent.click(screen.getByRole('option', { name: /20 Rows\/page/ }));

    expect(onChange).toHaveBeenCalledWith('20');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /20 Rows\/page/ })).toBeInTheDocument();
  });

  it('navigates with the keyboard and commits on Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} defaultValue="10" onChange={onChange} />);

    await user.tab();
    await user.keyboard('{Enter}'); // open, active = current (10)
    await user.keyboard('{ArrowDown}{ArrowDown}'); // -> 50
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('50');
  });

  it('filters options when searchable', async () => {
    render(<Select options={options} searchable placeholder="Select" />);
    await userEvent.click(screen.getByRole('button', { name: 'Select' }));

    await userEvent.type(screen.getByRole('combobox'), '50');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('50 Rows/page');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    render(<Select options={options} placeholder="Select" />);
    const trigger = screen.getByRole('button', { name: 'Select' });

    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders a hidden input when `name` is set', () => {
    const { container } = render(
      <Select options={options} name="pageSize" defaultValue="20" />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'pageSize');
    expect(hidden).toHaveValue('20');
  });
});
