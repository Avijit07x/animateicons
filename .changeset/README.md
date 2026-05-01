# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets) — the release pipeline for `@animateicons/react`. Each user-visible change to the npm package gets a changeset entry; on release, Changesets aggregates them into the published `CHANGELOG.md`, picks the right semver bump, and updates the package version.

## When you make a change

If your PR changes anything that consumers of `@animateicons/react` would notice — a new icon, a fixed bug, a new prop, a tweaked default, a docs note that ships in the README — add a changeset:

```bash
pnpm changeset
```

It'll ask:

1. Which packages changed → pick `@animateicons/react`.
2. What kind of bump → `patch` for fixes, `minor` for additions, `major` for breaking changes.
3. A one-line summary → this becomes the `CHANGELOG.md` entry.

The command writes a small markdown file into this `.changeset/` folder. Commit it alongside your code changes.

## What you don't need a changeset for

- Site-only changes (anything outside `npm/`) — the site (`animateicons`) is in the `ignore` list.
- Internal refactors that don't change the published API.
- README typos in this repo's root README. (README changes inside `npm/` should get a changeset because the README ships to npm.)

## When releasing

Maintainer flow:

```bash
pnpm changeset:version    # consumes all pending .changeset/*.md files,
                          # updates npm/package.json version + CHANGELOG.md
git commit -am "chore: release"
git push --follow-tags    # CI publishes via npm-publish.yml
```

If there are no pending changesets, `changeset:version` is a no-op — no accidental empty releases.

## Reference

- Adding a changeset: [intro guide](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- Common questions: [FAQ](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
