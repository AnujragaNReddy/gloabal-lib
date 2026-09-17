# Changelog

All notable changes to **`@engen/global-lib`** are recorded here for consumers.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versioning: [Semantic Versioning](https://semver.org/). Breaking changes are
  always listed under a **Breaking** heading with a one-line migration note.
- This file is the source for the Storybook **Docs → Changelog** page.

## [Unreleased]

_Nothing yet. Run `npm run changeset` after a user-facing change to add an entry;
`npm run version-packages` moves it into a dated section below._

---

## [1.0.0] — 2026-09-10

First public release. Installing `@engen/global-lib` gives you everything below.

### Added — components

| Component | Summary |
| --- | --- |
| **Button** | `solid` / `outlined` variants; `sm` / `md` / `lg` min-widths (160 / 240 / 320 px); `isLoading`; `loadingText` (text beside the spinner); `fullWidth`; `leftIcon` / `rightIcon`. Ref forwarded. |
| **Dropdown** | Action menu ("⋯"). Roving keyboard focus, `align`, controlled/uncontrolled `open`. |
| **Select** | Single-value picker (ARIA listbox). Optional in-panel search, right-aligned option `meta` text, hidden `<input name>` for forms. Trigger turns solid blue once a value is chosen. |
| **MultiSelect** | Checkbox rows (ARIA multi-select listbox). Optional search, "Select All" / "Deselect All", `"n Selected"` trigger label, `inline` mode (list only, no trigger). |
| **Input** | Single-line field with `label` / `hint` / `error`, `size` (204 / 280 / 336 px), `startAdornment` / `endAdornment`. |
| **Textarea** | Multi-line field with `rows` and `resize`. |
| **NumberInput** | Numeric field on `Input`; emits `number \| null`, clamps to `min` / `max` on blur, optional `prefix`. |
| **DateInput** | Native `type="date"` with a calendar button (`showPicker()`) and shared error styling. |
| **Radio** / **RadioGroup** | Controlled/uncontrolled group from `options` or `<Radio>` children, `columns` grid. |
| **Tag** | `subtle` / `solid` chip with optional icon and a remove button. |
| **Toast** / **ToastProvider** / **useToast()** | Portalled flash-message stack — `success` / `error` / `progress`, countdown bar, six screen positions. |
| **Modal** | Portalled dialog: focus trap, focus restore, scroll lock, Escape / backdrop close. |

### Added — API surface

- Hooks: `useControllableState`, `useOnClickOutside`, `useLockBodyScroll`, `useIsomorphicLayoutEffect`.
- Utils: `cn`, `mergeRefs`.
- Design tokens: every visual value is an `--engen-*` CSS custom property; dark mode via `data-theme="dark"`.
- One stylesheet: `import '@engen/global-lib/styles.css'` once at the app root.

### Packaging

- Dual **ESM + CJS** output with hand-checked `.d.ts` types.
- `react` / `react-dom` are **peer dependencies** (`^18.2 || ^19`); zero runtime dependencies.
- `"use client"` banner on the bundle for the Next.js App Router.

### Notes for early adopters

If you tried a pre-release build with `Button variant="primary" | "secondary" |
"ghost" | "danger"`, those were consolidated before this release:
`variant="primary"` → `"solid"`, `variant="outline"` → `"outlined"`; the other
values were removed. Build semantic variants from `--engen-button-*` tokens.
