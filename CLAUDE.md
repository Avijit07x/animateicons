@AGENTS.md

# AnimateIcons

Animated SVG icon library for React, built on `motion/react`. Two icon libraries live side by side: `icons/lucide/` (Lucide-style) and `icons/huge/` (Huge-style). The same source feeds the Next.js gallery, the `@animateicons/react` npm package, the shadcn registry, the `animateicons` CLI and the `@animateicons/mcp` server.

## Layout

- `icons/lucide/`, `icons/huge/`: one `<name>-icon.tsx` per icon, plus generated `index.ts` and `meta.ts`.
- `data/lucide-icons.json`, `data/huge-icons.json`: the manifests. Source of truth for what exists.
- `app/`: Next.js 16 App Router (gallery at `app/icons/[library]`, docs as MDX under `app/icons/docs`).
- `components/`: site UI. The homepage sections in `components/home/` share `SpecimenFrame` (crop marks and hairline borders).
- `npm/`, `core/`, `cli/`, `mcp/`: pnpm workspace packages. `npm/` is the published `@animateicons/react`.
- `scripts/`: registry, catalog and index codegen plus the checks. `eslint-rules/icon-structure.mjs`: the icon lint rule.

## Commands

Use pnpm, never npm or yarn.

- `pnpm dev`: runs `gen:icons` and `check:all` first (which includes `prettier --write .`), then starts Next with Turbopack. It also writes `AGENTS.md` and `CLAUDE.md` stubs.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`: run all three before calling work done.
- `pnpm gen:icons`: regenerates barrels, `registry.json`, `public/r/*.json`, `public/r/catalog.json`, `public/r/docs.json` and `lib/icon-count.generated.ts`. Never edit these by hand.
- `pnpm gen:docs`: rebuilds `public/r/docs.json` from the docs MDX pages, which is what the MCP `get_docs` tool reads. Run it after editing a docs page (`tests/scripts/docs-markdown.test.ts` fails when it is stale). A new MDX component in a docs page needs a rule in `scripts/docs-markdown.ts`, or the build fails and says which tag.
- `pnpm check:icons`, `pnpm check:registry`, `pnpm check:readme`: duplicate names, registry sync, README counts.
- `pnpm verify`: everything CI runs, including the npm package size budget.

The `.githooks/pre-push` hook runs `pnpm lint` and `pnpm check:readme`. Enable it with `pnpm hooks:install`.

## Adding an icon

Library-specific walkthroughs, including where the shapes come from: `docs/adding-lucide-icons.md` and `docs/adding-huge-icons.md`. What to add next, in order: `docs/huge-roadmap.md` for Huge and `docs/lucide-roadmap.md` for Lucide. Always ship the whole family: if you add an icon, add its opposites and directional variants too (up/down, left/right, on/off, add/remove), because anyone who needs `thumbs-up` needs `thumbs-down`.

1. Copy the structure of an existing icon in the same folder. Do not invent a new component shape.
   - `"use client"`, `forwardRef`, `useImperativeHandle` exposing `startAnimation` and `stopAnimation`, `LazyMotion` with `domMin`, and `onMouseEnter` and `onMouseLeave`.
   - No comments in icon files. The lint rule rejects them.
   - Names must match: `foo-bar-icon.tsx` exports `FooBarIcon`, `FooBarIconHandle`, `FooBarIconProps`. `tests/icons/naming.test.ts` enforces this.
2. Add an entry to the matching JSON manifest: `name` (filename without `-icon`), `addedAt` (`YYYY-MM-DD`), `category` and `keywords`. Reuse existing categories.
   - Where the entry sits in the manifest does not matter. Gallery order is generated for both libraries: `pnpm gen:icons` groups icons into families (the shared first word of the name, plus the merges in `FAMILY_ALIASES` in `scripts/icon-order.ts`) with the base icon first, so `bell`, `bell-ring` and `notification` sit together. Do not reorder the manifests by hand. If a new family lands apart from its relatives, add the merge to `FAMILY_ALIASES`. `tests/scripts/icon-order.test.ts` fails when the generated order is stale.
3. Run `pnpm exec prettier --write` on the new files and the manifest, then `pnpm gen:icons`. The registry embeds the source, so generating before formatting ships unformatted code.
4. Update the icon counts in `README.md` and `npm/README.md` (`pnpm check:readme` tells you the expected numbers).
5. Run `pnpm lint`, `pnpm typecheck` and `pnpm test`.

Before picking icons from `lucide-react`, check they are not duplicates. Compare geometry against existing icons, not just names, because Lucide has aliases (for example `fingerprint` is `fingerprint-pattern`) and near twins (`gamepad-2` is `gamepad`, `share-2` is `share`). Skip look-alikes.

### Animation rules

- Aim for 0.3s to 0.8s, visible but not distracting. Scale every duration by the `duration` prop. If a motion is barely noticeable at 24px, make it bigger.
- Put `animate={controls} initial="normal"` on the `m.svg` and give child elements only `variants`. Every variant set needs `normal` and `animate`.
- For scale or rotate, set `style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}` (use the icon's real pivot).
- If an animation ends on a visually identical state that is not its rest value (a full spin, a 180 degree turn of a symmetric shape), give `normal` `transition: { duration: 0 }` so mouse leave does not spin backwards.
- Draw-on effects use `strokeDasharray` plus a `strokeDashoffset` variant.
- Keep the shape identical to the Lucide source at rest.

## Publishing the npm package

- Add a `## x.y.z` entry to `npm/CHANGELOG.md` and bump `npm/package.json`.
- Pushing a `v*` tag runs `.github/workflows/npm-publish.yml` (uses the `NPM_TOKEN` secret, with provenance).
- Bundle size budgets live under `size-limit` in `npm/package.json` and CI enforces them.

## Site conventions

- The homepage and gallery use the "hairline specimen" look: mono uppercase labels, thin `border-border/60` rules, crop-marked frames via `SpecimenFrame`, no rounded card chrome. Match it when adding UI.
- Tailwind v4 with project tokens (`text-textMuted`, `bg-bgDark`, `border-border`, `text-primary`). Prefer tokens over raw colors.
- Write user-facing copy without em dashes. Use a full stop or a comma.
- When a change leaves code, styles or components unused, delete them in the same change.
- Commit messages follow `feat:`, `fix:`, `perf:`, `chore:`. PRs target `main`.
