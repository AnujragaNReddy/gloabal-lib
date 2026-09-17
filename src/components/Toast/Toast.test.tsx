import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';

describe('Toast', () => {
  it('renders the variant with an assertive role for errors', () => {
    render(<Toast variant="error" title="Error" duration={0} />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveTextContent('Error');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses a polite status role for non-errors', () => {
    render(<Toast variant="success" title="Saved" duration={0} />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('calls onClose from the dismiss button', async () => {
    const onClose = vi.fn();
    render(<Toast title="Hi" duration={0} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  describe('auto-dismiss', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('calls onClose after `duration`', () => {
      const onClose = vi.fn();
      render(<Toast title="Hi" duration={3000} onClose={onClose} />);
      expect(onClose).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(3000));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not auto-dismiss when duration is 0', () => {
      const onClose = vi.fn();
      render(<Toast title="Hi" duration={0} onClose={onClose} />);
      act(() => vi.advanceTimersByTime(10000));
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});

describe('useToast', () => {
  it('shows and dismisses toasts imperatively', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastProvider defaultDuration={0}>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });

    let id = '';
    act(() => {
      id = result.current.success('Saved successfully');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Saved successfully');

    act(() => result.current.dismiss(id));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
