import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dropdown, type DropdownItem } from './Dropdown';

const makeItems = (): DropdownItem[] => [
  { id: 'edit', label: 'Edit', onSelect: vi.fn() },
  { id: 'delete', label: 'Delete', onSelect: vi.fn() },
];

describe('Dropdown', () => {
  it('opens on trigger click and exposes menu semantics', async () => {
    render(<Dropdown trigger="Menu" items={makeItems()} />);
    const trigger = screen.getByRole('button', { name: /menu/i });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('fires onSelect and closes when an item is chosen', async () => {
    const onSelect = vi.fn();
    render(<Dropdown trigger="Menu" items={[{ id: 'a', label: 'Item A', onSelect }]} />);

    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Item A' }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger="Menu" items={makeItems()} />);

    await user.tab();
    expect(screen.getByRole('button', { name: /menu/i })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toHaveFocus();
  });

  it('closes when clicking outside', async () => {
    render(
      <>
        <Dropdown trigger="Menu" items={makeItems()} />
        <button type="button">outside</button>
      </>,
    );

    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('skips disabled items when navigating', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="Menu"
        items={[
          { id: 'a', label: 'First' },
          { id: 'b', label: 'Blocked', disabled: true },
          { id: 'c', label: 'Last' },
        ]}
      />,
    );

    await user.tab();
    await user.keyboard('{ArrowDown}'); // First
    await user.keyboard('{ArrowDown}'); // -> skips Blocked -> Last
    expect(screen.getByRole('menuitem', { name: 'Last' })).toHaveFocus();
  });
});
