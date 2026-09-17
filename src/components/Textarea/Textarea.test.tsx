import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('links label, accepts input and honours rows', async () => {
    render(<Textarea label="Notes" rows={5} />);
    const field = screen.getByLabelText('Notes');
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).toHaveAttribute('rows', '5');
    await userEvent.type(field, 'hello');
    expect(field).toHaveValue('hello');
  });

  it('surfaces the error message', () => {
    render(<Textarea label="Notes" error="Field cannot be blank" />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Field cannot be blank');
  });

  it('applies the resize style', () => {
    render(<Textarea label="Notes" resize="none" />);
    expect(screen.getByLabelText('Notes')).toHaveStyle({ resize: 'none' });
  });
});
