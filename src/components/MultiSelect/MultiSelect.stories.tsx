import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from './MultiSelect';

const clinicians: MultiSelectOption[] = [
  { value: '32cd', label: 'Alana Barnes', meta: 'LID32CD' },
  { value: '78po', label: 'Alana Houston', meta: 'LID78PO' },
  { value: '67hn', label: 'Akela Reed', meta: 'LID67HN' },
  { value: '45jk', label: 'Angelo Allen', meta: 'LID45JK' },
  { value: '58ko', label: 'Arthur Cooper', meta: 'LID58KO' },
  { value: '11ab', label: 'Elizabeth Gibson', meta: 'LID11AB' },
  { value: '11ac', label: 'Gabriel Peterson', meta: 'LID11AC' },
  { value: '66gh', label: 'Ryder Floyd', meta: 'LID66GH' },
];

const plain: MultiSelectOption[] = Array.from({ length: 6 }, (_, i) => ({
  value: String(i + 1),
  label: `Option Name ${i + 1}`,
}));

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  args: {
    options: plain,
    placeholder: 'Select',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: ['1', '3', '5'] },
};

export const Searchable: Story = {
  args: { searchable: true, options: clinicians, placeholder: 'Search | Select' },
};

export const NoSelectAll: Story = {
  args: { showSelectAll: false },
};

/** `inline` drops the trigger — handy for filter sidebars. */
export const Inline: Story = {
  args: { inline: true, options: clinicians, defaultValue: ['32cd', '45jk'] },
};

function ControlledDemo(args: MultiSelectProps) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <MultiSelect {...args} value={value} onChange={setValue} />
      <small style={{ font: '12px var(--engen-font-family)' }}>
        {value.length ? value.join(', ') : '—'}
      </small>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
