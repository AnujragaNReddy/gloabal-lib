import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    children: 'only Values',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Subtle: Story = { args: { variant: 'subtle' } };
export const Solid: Story = { args: { variant: 'solid' } };
export const Removable: Story = { args: { variant: 'solid', onRemove: () => {} } };

export const Row: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag {...args} variant="subtle">
        only Values
      </Tag>
      <Tag {...args} variant="solid">
        only Values
      </Tag>
    </div>
  ),
};

function RemovableList() {
  const [tags, setTags] = useState(['Alpha', 'Beta', 'Gamma']);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((t) => (
        <Tag key={t} variant="solid" onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </div>
  );
}

export const Dismissible: Story = {
  render: () => <RemovableList />,
};
