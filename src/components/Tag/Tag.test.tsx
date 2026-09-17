import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders its content', () => {
    render(<Tag>only Values</Tag>);
    expect(screen.getByText('only Values')).toBeInTheDocument();
  });

  it('has no remove button by default', () => {
    render(<Tag>Plain</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRemove when the remove button is activated', async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove Alpha">
        Alpha
      </Tag>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove Alpha' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('applies the variant class', () => {
    render(<Tag variant="solid">X</Tag>);
    expect(screen.getByText('X').parentElement?.className).toMatch(/solid/);
  });
});
