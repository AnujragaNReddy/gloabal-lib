# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

This library is internal-only and is never published to a registry. Changesets
are used purely to automate versioning and `CHANGELOG.md`.

- Run `npm run changeset` after making a user-facing change and describe it.
- On push to `main`, a GitHub Action runs `changeset version` for you inside an
  auto-managed **"Version Packages"** PR (bumps `package.json` + updates
  `CHANGELOG.md`). Merge that PR like any other to cut a release.
- Once merged, another GitHub Action tags the commit `v<version>` and creates a
  GitHub Release with that version's changelog section — see
  [.github/workflows/](../.github/workflows/).
