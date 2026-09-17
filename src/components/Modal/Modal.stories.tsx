import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    open: false,
    onClose: () => undefined,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'fullscreen'] },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

function ModalDemo(args: Partial<ModalProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        title={args.title ?? 'Delete project'}
        description={
          args.description ??
          'This action cannot be undone. All associated data will be permanently removed.'
        }
        footer={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Type the project name to confirm you want to delete it.</p>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
};

export const Small: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: { size: 'sm' },
};

export const WithoutCloseButton: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: { showCloseButton: false, closeOnOverlayClick: false },
};
