import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and inert while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Go
      </Button>,
    );
    const button = screen.getByRole('button');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('shows loadingText beside the spinner while loading', () => {
    render(
      <Button isLoading loadingText="Saving…">
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Saving…');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('keeps the plain loading behaviour when loadingText is omitted', () => {
    render(<Button isLoading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(button.className).not.toMatch(/loadingWithText/);
  });

  it('forwards the ref to the underlying button', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges a custom className', () => {
    render(<Button className="custom">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('applies the variant and size classes', () => {
    render(
      <Button variant="outlined" size="lg">
        X
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/outlined/);
    expect(button.className).toMatch(/lg/);
  });

  it('defaults to the solid variant', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button').className).toMatch(/solid/);
  });
});
