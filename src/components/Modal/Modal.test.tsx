import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Hidden" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('portals a labelled, described dialog', () => {
    render(
      <Modal open onClose={vi.fn()} title="Settings" description="Manage your preferences">
        Body content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Settings');
    expect(dialog).toHaveAccessibleDescription('Manage your preferences');
    // Rendered in a portal, not inside the React root container.
    expect(document.body).toContainElement(dialog);
  });

  it('closes via Escape, the close button and the backdrop', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Closeable" />);

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(2);

    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not close on backdrop click when disabled', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Sticky" closeOnOverlayClick={false} closeOnEsc={false} />,
    );

    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await userEvent.click(overlay);
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('restores focus to the trigger after closing', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Focus test" />
        </>
      );
    }

    render(<Harness />);
    const openButton = screen.getByRole('button', { name: 'Open' });

    await userEvent.click(openButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });
});
