# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

- Run `npm run changeset` after making a user-facing change and describe it.
- CI (or a maintainer) runs `npm run version-packages` to consume changesets, bump
  the version and update `CHANGELOG.md`.
- `npm run release` builds and publishes to the registry.
