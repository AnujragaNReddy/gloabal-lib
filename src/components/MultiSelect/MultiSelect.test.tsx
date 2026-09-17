import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MultiSelect, type MultiSelectOption } from './MultiSelect';

const options: MultiSelectOption[] = [
  { value: 'a', label: 'Alana Barnes', meta: 'LID32CD' },
  { value: 'b', label: 'Angelo Allen', meta: 'LID45JK' },
  { value: 'c', label: 'Ryder Floyd', meta: 'LID66GH' },
];

describe('MultiSelect', () => {
  it('toggles options without closing and reports the selection', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} placeholder="Select" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    await userEvent.click(screen.getByRole('option', { name: /Alana Barnes/ }));
    await userEvent.click(screen.getByRole('option', { name: /Ryder Floyd/ }));

    expect(onChange).toHaveBeenLastCalledWith(['a', 'c']);
    expect(screen.getByRole('listbox')).toBeInTheDocument(); // still open
    expect(screen.getByRole('button', { name: '2 Selected' })).toBeInTheDocument();
  });

  it('select all / deselect all toggles every option', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} placeholder="Select" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Select' }));

    await userEvent.click(screen.getByRole('button', { name: 'Select All' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);

    await userEvent.click(screen.getByRole('button', { name: 'Deselect All' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('filters and toggles with the keyboard when searchable', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} searchable placeholder="Select" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    await userEvent.type(screen.getByRole('combobox'), 'ryder');
    expect(screen.getAllByRole('option')).toHaveLength(1);

    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['c']);
  });

  it('renders the list without a trigger in inline mode', () => {
    render(<MultiSelect options={options} inline showSelectAll={false} defaultValue={['b']} />);
    expect(screen.queryByRole('button', { name: 'Select' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    const selected = screen.getByRole('option', { name: /Angelo Allen/ });
    expect(selected).toHaveAttribute('aria-selected', 'true');
  });

  it('closes on Escape and restores focus (non-inline)', async () => {
    render(<MultiSelect options={options} placeholder="Select" />);
    const trigger = screen.getByRole('button', { name: 'Select' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('shows meta text on options', async () => {
    render(<MultiSelect options={options} placeholder="Select" />);
    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    const option = screen.getByRole('option', { name: /Alana Barnes/ });
    expect(within(option).getByText('LID32CD')).toBeInTheDocument();
  });
});
