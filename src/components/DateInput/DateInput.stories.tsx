import type { Meta, StoryObj } from '@storybook/react';

import { DateInput } from './DateInput';

const meta = {
  title: 'Components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  args: {
    label: 'Date',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: '2024-04-24' } };
export const Disabled: Story = { args: { defaultValue: '2024-04-24', disabled: true } };
export const Error: Story = { args: { error: 'Field cannot be blank' } };
