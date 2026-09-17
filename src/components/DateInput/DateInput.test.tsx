import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DateInput } from './DateInput';

describe('DateInput', () => {
  it('renders a native date input with a calendar button', () => {
    render(<DateInput label="Date" defaultValue="2024-04-24" />);
    const field = screen.getByLabelText('Date');
    expect(field).toHaveAttribute('type', 'date');
    expect(field).toHaveValue('2024-04-24');
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument();
  });

  it('shows the error message and marks the field invalid', () => {
    render(<DateInput label="Date" error="Field cannot be blank" />);
    expect(screen.getByLabelText('Date')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Field cannot be blank');
  });
});
