# @animateicons/react

## 0.5.0

### Minor Changes

- Icons are now tree-shakeable. The ESM build ships one module per icon instead of bundling all 542 into a single file, so bundlers can drop the ones you don't import. Previously `import { BellRingIcon }` pulled in the entire library. Measured with esbuild, one icon went from 809 kB to 72 kB raw (86 kB to 26 kB gzipped).
- Added per-icon subpath exports: `@animateicons/react/lucide/<icon-file>` and `@animateicons/react/huge/<icon-file>`, with types. Next.js App Router cannot tree-shake through the `lucide` / `huge` barrels, because the `"use client"` directive on them forms a client boundary. Importing an icon directly takes a Next 16 production build from 918 kB to 71 kB of client JS for one icon. Deep subpaths are ESM-only; `require()` consumers should keep using the barrels.
- No changes to icon markup, animation timing or the public component API. The barrel imports still work exactly as before.

### Patch Changes

- Fixed the `"use client"` banner injector, which was silently not running from tsup's `onSuccess` hook.
- CJS output is unchanged: still a single bundled file per library, since `require()` consumers do not tree-shake.

## 0.4.3

### Patch Changes

- On-demand icon loading in the gallery and updated icon counts across the docs.

## 0.4.2

### Patch Changes

- Enabled ESLint with an icon-structure rule, enforced in CI and on pre-push, and fixed all findings.

## 0.4.1

### Patch Changes

- Refined hover animations for several icons using the `transformBox: view-box` origin pattern (fixes off-pivot rotations and unreliable line draws): trash, trash-2, circle-check, house, mail, message-circle, share, shopping-bag, and wifi (+ wifi-cog, wifi-off, wifi-pen, wifi-sync).

## 0.4.0

### Minor Changes

- Icon names now match Lucide's, with bare-name aliases exported alongside the `*Icon` names.

## 0.3.5

### Patch Changes

- Added pet, daily-life and sound icons; icon count is now derived dynamically.
- Raised the single-icon size budget to 55 kB to match the full-barrel ceiling.

## 0.3.4

### Patch Changes

- New motion system for the bell, alert and navigation icons.

## 0.3.3

### Patch Changes

- 3145a37: Reduce bundle size by ~60% by switching to LazyMotion + lazy m component
