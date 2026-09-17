import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Select, type SelectOption, type SelectProps } from './Select';

const rows: SelectOption[] = [
  { value: '10', label: '10 Rows/page' },
  { value: '20', label: '20 Rows/page' },
  { value: '50', label: '50 Rows/page' },
  { value: '100', label: '100 Rows/page' },
  { value: '150', label: '150 Rows/page' },
  { value: '200', label: '200 Rows/page' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: rows,
    placeholder: 'Select',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: '50' },
};

export const Searchable: Story = {
  args: { searchable: true },
};

export const WithMeta: Story = {
  args: {
    placeholder: 'Clinician',
    searchable: true,
    options: [
      { value: 'a', label: 'Alana Barnes', meta: 'LID32CD' },
      { value: 'b', label: 'Angelo Allen', meta: 'LID45JK' },
      { value: 'c', label: 'Arthur Cooper', meta: 'LID58KO' },
      { value: 'd', label: 'Ryder Floyd', meta: 'LID66GH' },
    ],
  },
};

export const Disabled: Story = {
  args: { defaultValue: '20', disabled: true },
};

function ControlledDemo(args: SelectProps) {
  const [value, setValue] = useState('');
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <Select {...args} value={value} onChange={setValue} />
      <small style={{ font: '12px var(--engen-font-family)' }}>value: {value || '—'}</small>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
