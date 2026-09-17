import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    title: 'Success',
    duration: 0,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['success', 'error', 'progress'] },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { variant: 'success', title: 'Success' } };
export const Error: Story = { args: { variant: 'error', title: 'Error' } };
export const DownloadInProgress: Story = {
  args: { variant: 'progress', title: 'Download in Progress' },
};
export const WithDescription: Story = {
  args: {
    variant: 'success',
    title: 'Saved',
    description: 'Your changes have been stored.',
  },
};
export const Countdown: Story = {
  args: { variant: 'success', title: 'Auto-dismiss in 6s', duration: 6000 },
};

function ToastDemo() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast.success('Success')}>Success</Button>
      <Button variant="outlined" onClick={() => toast.error('Error')}>
        Error
      </Button>
      <Button
        variant="outlined"
        onClick={() => toast.progress('Download in Progress', { duration: 8000 })}
      >
        Progress
      </Button>
    </div>
  );
}

export const Imperative: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <ToastProvider position="top-right">
      <ToastDemo />
    </ToastProvider>
  ),
};
