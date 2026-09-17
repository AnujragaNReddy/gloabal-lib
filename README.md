# @engen/global-lib

A small, tree-shakeable React component library for Engen apps — Button,
Dropdown, Select, MultiSelect, Input, Textarea, NumberInput, DateInput,
Radio/RadioGroup, Tag, Toast and Modal.

> **What's in each version:** [`CHANGELOG.md`](./CHANGELOG.md) (also in Storybook
> under **Docs → Changelog**). Requires **React 18.2+ or 19** (peer dependency).

- **Dual output** — ESM + CJS, with hand-written-quality `.d.ts` types.
- **Tree-shakeable** — `sideEffects` is limited to CSS, React is a peer
  dependency, and there are zero runtime dependencies.
- **One stylesheet** — every component is authored with CSS Modules and bundled
  into a single `styles.css` you import once.
- **Themeable** — all visual values are CSS custom properties (`--engen-*`);
  dark mode is a `data-theme="dark"` attribute.
- **Accessible** — keyboard support, focus management and ARIA wiring built in.
- **SSR / RSC friendly** — the bundle is marked `"use client"` for the Next.js
  App Router.

---

## Install

```bash
npm install @engen/global-lib
# peers (most apps already have these)
npm install react react-dom
```

> The versions in `package.json` are indicative. To pin the latest, run
> `npx npm-check-updates -u && npm install`.

## Usage

```tsx
import { Button, Dropdown, Modal } from '@engen/global-lib';
import '@engen/global-lib/styles.css'; // once, at your app root

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>

      <Dropdown
        trigger="Actions"
        items={[
          { id: 'rename', label: 'Rename', onSelect: rename },
          { id: 'delete', label: 'Delete', destructive: true, onSelect: remove },
        ]}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm"
        description="Are you sure?"
        footer={
          <>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirm}>
              Delete
            </Button>
          </>
        }
      >
        This cannot be undone.
      </Modal>
    </>
  );
}
```

### Dark mode

```html
<html data-theme="dark"></html>
```

### Overriding tokens

Any `--engen-*` custom property can be redefined by your app (they are declared
at zero specificity):

```css
:root {
  /* Button palette — default / hover / active / disabled */
  --engen-button-solid-bg: #0066b1;
  --engen-button-solid-bg-hover: #00a2e2;
  --engen-button-solid-bg-active: #003963;
  --engen-button-disabled-bg: #6d787f;

  --engen-radius-md: 0.375rem;
  --engen-font-family: 'Inter', sans-serif;
}
```

---

## Components

### `Button`

| Prop                     | Type                                                 | Default   |
| ------------------------ | ---------------------------------------------------- | --------- |
| `variant`                | `'solid' \| 'outlined'`                              | `'solid'` |
| `size`                   | `'sm' \| 'md' \| 'lg'` — min-width 160 / 240 / 320px | `'md'`    |
| `isLoading`              | `boolean`                                            | `false`   |
| `loadingText`            | `ReactNode` — shown beside the spinner while loading | —         |
| `fullWidth`              | `boolean` — overrides `size`                         | `false`   |
| `leftIcon` / `rightIcon` | `ReactNode`                                          | —         |

Plus every native `<button>` attribute. Ref is forwarded to the `<button>`.
Default / hover / active / disabled states are pure CSS (`:hover`, `:active`,
`:disabled`) driven by `--engen-button-*` tokens, so `<Button disabled>` and a
real hover reproduce the design board exactly.

### `Dropdown`

Menu-button pattern. `ArrowDown` / `Enter` / `Space` open it; arrows + `Home` /
`End` move a roving focus; `Esc` / `Tab` / outside-click close it.

| Prop                   | Type                      | Default   |
| ---------------------- | ------------------------- | --------- |
| `trigger`              | `ReactNode`               | required  |
| `items`                | `DropdownItem[]`          | required  |
| `align`                | `'start' \| 'end'`        | `'start'` |
| `open` / `defaultOpen` | `boolean`                 | —         |
| `onOpenChange`         | `(open: boolean) => void` | —         |
| `disabled`             | `boolean`                 | `false`   |

`DropdownItem`: `{ id, label, onSelect?, href?, disabled?, icon?, separatorBefore?, destructive? }`.

`Dropdown` is an **action menu** ("⋯" menu). For choosing a value use `Select` /
`MultiSelect` below. Positioning is plain CSS (no auto-flip) — wrap with
[Floating UI](https://floating-ui.com/) if you need collision handling.

### `Select`

Single-value picker (ARIA listbox). The trigger turns solid blue once a value is
chosen. `↑`/`↓`/`Home`/`End` move, `Enter`/`Space` choose, `Esc` closes.

| Prop                     | Type                                            | Default    |
| ------------------------ | ----------------------------------------------- | ---------- |
| `options`                | `SelectOption[]`                                | required   |
| `value` / `defaultValue` | `string`                                        | `''`       |
| `onChange`               | `(value: string) => void`                       | —          |
| `placeholder`            | `string`                                        | `'Select'` |
| `searchable`             | `boolean`                                       | `false`    |
| `size`                   | `'sm' \| 'md' \| 'lg'` — min-width 160/240/320  | `'md'`     |
| `fullWidth` / `disabled` | `boolean`                                       | `false`    |
| `name`                   | `string` — renders a hidden `<input>` for forms | —          |

`SelectOption`: `{ value, label, meta?, disabled? }` — `meta` is right-aligned text (e.g. an ID).

### `MultiSelect`

Multi-value picker with checkbox rows (ARIA multi-select listbox). Optional
search and a "Select All" / "Deselect All" toggle; the trigger shows `"n Selected"`.
`↑`/`↓`/`Home`/`End` move, `Space`/`Enter` toggle, `Esc` closes.

| Prop                              | Type                                         | Default               |
| --------------------------------- | -------------------------------------------- | --------------------- |
| `options`                         | `MultiSelectOption[]`                        | required              |
| `value` / `defaultValue`          | `string[]`                                   | `[]`                  |
| `onChange`                        | `(value: string[]) => void`                  | —                     |
| `placeholder`                     | `string`                                     | `'Select'`            |
| `searchable`                      | `boolean`                                    | `false`               |
| `showSelectAll`                   | `boolean`                                    | `true`                |
| `formatTriggerLabel`              | `(count: number) => ReactNode`               | `` `${n} Selected` `` |
| `inline`                          | `boolean` — render just the list, no trigger | `false`               |
| `size` / `fullWidth` / `disabled` | —                                            | —                     |

`MultiSelectOption`: `{ value, label, meta?, disabled? }`.

### Text fields — `Input`, `Textarea`, `NumberInput`, `DateInput`

All share `label`, `hint`, `error` (`true` or a message), `size`
(`sm`/`md`/`lg` → 204/280/336px), `fullWidth` and the state model
(empty · filled · focus · disabled · error) via `--engen-input-*` tokens.

| Component     | Notable props                                                                                |
| ------------- | -------------------------------------------------------------------------------------------- |
| `Input`       | `startAdornment`, `endAdornment`                                                             |
| `Textarea`    | `rows`, `resize` (`none`/`vertical`/`horizontal`/`both`)                                     |
| `NumberInput` | `value: number \| null`, `onChange(number \| null)`, `min`, `max`, `prefix` (clamps on blur) |
| `DateInput`   | native `type="date"` + a calendar button that calls `showPicker()`                           |

### `Radio` / `RadioGroup`

`RadioGroup` manages the selected value and lays options out in `columns`.

| Prop (`RadioGroup`)                   | Type                                         | Default |
| ------------------------------------- | -------------------------------------------- | ------- |
| `options`                             | `RadioOption[]` — or pass `<Radio>` children | —       |
| `value` / `defaultValue` / `onChange` | `string` / `(v: string) => void`             | —       |
| `columns`                             | `number`                                     | `1`     |
| `label` / `error` / `disabled`        | —                                            | —       |

### `Tag`

Compact chip. `variant` `'subtle'` (grey) \| `'solid'` (blue), `size` `'sm'`/`'md'`,
optional `icon` and `onRemove` (adds a × button).

### `Toast` / `ToastProvider` / `useToast`

Flash messages with `success` \| `error` \| `progress` variants, an icon and a
countdown bar. Wrap the app once in `<ToastProvider position="top-right">`, then:

```tsx
const toast = useToast();
toast.success('Saved successfully');
toast.error('Something went wrong', { description: 'Try again.' });
const id = toast.progress('Download in Progress', { duration: 8000 });
toast.dismiss(id);
```

`<Toast>` can also be rendered on its own. `ToastProvider` props: `position`
(6 corners/edges), `max` (default 4), `defaultDuration` (default 4000ms).

### `Modal`

Portalled dialog with a focus trap, focus restoration, body-scroll lock, and
Escape / backdrop close. Pass a `title` **or** an `aria-label`.

| Prop                    | Type                                   | Default         |
| ----------------------- | -------------------------------------- | --------------- |
| `open`                  | `boolean`                              | required        |
| `onClose`               | `() => void`                           | required        |
| `title` / `description` | `ReactNode`                            | —               |
| `footer`                | `ReactNode`                            | —               |
| `size`                  | `'sm' \| 'md' \| 'lg' \| 'fullscreen'` | `'md'`          |
| `closeOnOverlayClick`   | `boolean`                              | `true`          |
| `closeOnEsc`            | `boolean`                              | `true`          |
| `showCloseButton`       | `boolean`                              | `true`          |
| `container`             | `Element \| null`                      | `document.body` |
| `initialFocusRef`       | `RefObject<HTMLElement>`               | first focusable |

The library also exports the primitives it is built from: `cn`, `mergeRefs`,
`useControllableState`, `useOnClickOutside`, `useLockBodyScroll`,
`useIsomorphicLayoutEffect`.

---

## Local development

```bash
npm install
npm run dev            # Storybook on http://localhost:6006
npm test               # Vitest (jsdom + Testing Library)
npm run test:watch
npm run lint
npm run typecheck
npm run build          # -> dist/  (index.js, index.cjs, index.d.ts, styles.css)
npm run validate       # typecheck + lint + test + build
```

This folder is not a git repo yet:

```bash
git init && git add -A && git commit -m "chore: scaffold component library"
```

## Adding a component

1. `src/components/Xxx/` with `Xxx.tsx`, `Xxx.module.css`, `Xxx.stories.tsx`,
   `Xxx.test.tsx`, `index.ts`.
2. Use `--engen-*` tokens in the CSS Module — no hard-coded colors or spacing.
3. Re-export it from `src/components/index.ts`.
4. `npm run validate`.

## Versioning & releases

- **What changed in which version:** [`CHANGELOG.md`](./CHANGELOG.md), also
  rendered in Storybook under **Docs → Changelog**. Every entry is written for
  consumers and grouped **Added / Changed / Breaking / Fixed**.
- **Policy:** [Semantic Versioning](https://semver.org/). New optional props,
  new variants and new components are **minor**; bug fixes are **patch**;
  renames / removals / default changes are **major**. While the version is
  `0.x`, a **minor may contain breaking changes** — always listed under a
  **Breaking** heading with a one-line migration note.
- **Per-feature markers:** new props carry `@since x.y.z` in their JSDoc (shown
  in the Storybook props table); new stories note the version they landed in.

### Cutting a release

```bash
npm run changeset          # 1. after each user-facing change: pick bump + write a summary
npm run version-packages    # 2. consumes .changeset/*.md → bumps version + appends to CHANGELOG.md
#                             then tidy the appended section into the Added/Changed/Breaking
#                             grouping and drop the commit-sha prefixes
npm run release            # 3. build + `changeset publish` (+ push tags)
```

Multiple PRs merged between releases stack their `.changeset/*.md`; one
`version-packages` folds them into a single dated section.

## Build output

| File              | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `dist/index.js`   | ESM entry (`import`)                     |
| `dist/index.cjs`  | CommonJS entry (`require`)               |
| `dist/index.d.ts` | Type definitions                         |
| `dist/styles.css` | The single stylesheet (`import` it once) |

## License

MIT © Engen
