import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { NumberInput, type NumberInputProps } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: {
    label: 'Amount',
    placeholder: 'Enter Value',
    prefix: '$',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: 4592.06 } };
export const Disabled: Story = { args: { defaultValue: 4592.06, disabled: true } };
export const Clamped: Story = {
  args: { defaultValue: 5, min: 0, max: 100, hint: 'Blurs back into 0–100' },
};

function ControlledDemo(args: NumberInputProps) {
  const [value, setValue] = useState<number | null>(null);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <NumberInput {...args} value={value} onChange={setValue} />
      <small style={{ font: '12px var(--engen-font-family)' }}>
        {value === null ? 'null' : String(value)}
      </small>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
