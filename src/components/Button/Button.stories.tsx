import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { Button, type ButtonProps, type ButtonVariant } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Two variants — `solid` and `outlined` — each with default / hover / active / disabled states.',
        ].join('\n'),
      },
    },
  },
  args: {
    children: 'Button name',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outlined'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Loading: Story = { args: { isLoading: true } };
export const LoadingWithText: Story = {
  args: { isLoading: true, loadingText: 'Saving…', children: 'Save' },
  parameters: {
    docs: { description: { story: 'Pair `isLoading` with `loadingText`.' } },
  },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
};

/** `sm` 160px · `md` 240px · `lg` 320px minimum width. */
export const Widths: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Button {...args} size="sm">
        Solid button 160px
      </Button>
      <Button {...args} size="md">
        Solid button 240px
      </Button>
      <Button {...args} size="lg">
        Solid button 320px
      </Button>
    </div>
  ),
};

/**
 * The full design board — both variants across every interaction state.
 * Hover / active columns are forced with `storybook-addon-pseudo-states`.
 */
export const DesignBoard: Story = {
  parameters: {
    layout: 'padded',
    pseudo: { hover: ['.pseudo-hover'], active: ['.pseudo-active'] },
    controls: { include: ['size'] },
  },
  render: (args) => {
    const columns: Array<{ title: string; variant: ButtonVariant }> = [
      { title: 'Solid button', variant: 'solid' },
      { title: 'Outlined button', variant: 'outlined' },
    ];
    const states: Array<{ label: string; props: Partial<ButtonProps> }> = [
      { label: 'Default', props: {} },
      { label: 'Disabled', props: { disabled: true } },
      { label: 'Hover', props: { className: 'pseudo-hover' } },
      { label: 'Active', props: { className: 'pseudo-active' } },
    ];

    return (
      <div style={{ display: 'flex', gap: 48 }}>
        {columns.map((column) => (
          <div key={column.variant} style={{ display: 'grid', gap: 12 }}>
            <strong style={{ font: '600 12px/1 var(--engen-font-family)' }}>{column.title}</strong>
            {states.map((state) => (
              <Button key={state.label} {...args} variant={column.variant} {...state.props}>
                Button name
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const ClickInteraction: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Button name' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
