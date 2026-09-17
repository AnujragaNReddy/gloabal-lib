import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter Data',
    label: 'Field label',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: 'Lorem Ipsum' } };
export const Disabled: Story = { args: { defaultValue: 'Lorem Ipsum', disabled: true } };
export const Error: Story = {
  args: { defaultValue: '', error: 'This field cannot be blank' },
};
export const WithHint: Story = {
  args: { hint: 'We never share this.' },
};

export const States: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 336 }}>
      <Input {...args} label={undefined} aria-label="Empty" placeholder="Enter Data" />
      <Input {...args} label={undefined} aria-label="Filled" defaultValue="Lorem Ipsum" />
      <Input {...args} label={undefined} aria-label="Disabled" defaultValue="Lorem Ipsum" disabled />
      <Input
        {...args}
        label={undefined}
        aria-label="Error"
        defaultValue="Lorem Ipsum"
        error="Field cannot be blank"
      />
    </div>
  ),
};
