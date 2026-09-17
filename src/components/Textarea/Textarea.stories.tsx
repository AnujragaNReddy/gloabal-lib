import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter Data',
    label: 'Description',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'horizontal', 'both'] },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: 'Lorem ipsum dolor sit amet.' } };
export const Disabled: Story = { args: { defaultValue: 'Lorem ipsum', disabled: true } };
export const Error: Story = { args: { error: 'Field cannot be blank' } };
export const Large: Story = { args: { size: 'lg', rows: 6 } };
