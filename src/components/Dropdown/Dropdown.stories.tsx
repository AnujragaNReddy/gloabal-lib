import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { Dropdown } from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    trigger: 'Options',
    items: [
      { id: 'edit', label: 'Edit' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'archive', label: 'Archive', separatorBefore: true },
      { id: 'delete', label: 'Delete', destructive: true },
    ],
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlignEnd: Story = {
  args: { align: 'end' },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { id: 'a', label: 'Available' },
      { id: 'b', label: 'Unavailable', disabled: true },
      { id: 'c', label: 'Also available' },
    ],
  },
};

export const OpensOnClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /options/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('menu')).toBeInTheDocument();
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(4);
  },
};
