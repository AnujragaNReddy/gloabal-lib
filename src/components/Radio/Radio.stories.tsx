import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroup, type RadioGroupProps } from './Radio';

const sizeOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'fixed', label: 'Fixed' },
];

const scaleOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Size',
    options: sizeOptions,
    defaultValue: 'auto',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoColumns: Story = {
  args: { columns: 2 },
};

export const ThreeColumns: Story = {
  args: { label: 'Size', options: scaleOptions, columns: 3, defaultValue: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'fixed' },
};

export const WithError: Story = {
  args: { defaultValue: '', error: 'Please choose an option' },
};

function ControlledDemo(args: RadioGroupProps) {
  const [value, setValue] = useState('auto');
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <RadioGroup {...args} value={value} onChange={setValue} />
      <small style={{ font: '12px var(--engen-font-family)' }}>value: {value}</small>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
