# animateicons

Add [AnimateIcons](https://animateicons.in) - animated SVG icons for React - to your
project from the command line, without pasting registry URLs.

```bash
# Add one or more icons (writes to components/icons/ by default)
npx animateicons add bell-ring
npx animateicons add bell-ring activity user

# Search and inspect
npx animateicons search notification
npx animateicons list --library huge
npx animateicons info bell-ring
```

Prefer a short command without `npx`? Install it globally:

```bash
npm i -g animateicons
animateicons add bell-ring
```

## `browse` (interactive TUI)

Launch a terminal dashboard to search, multi-select, and add icons without leaving your shell:

```bash
npx animateicons browse
```

```
╭─ AnimateIcons ─────────────────────────────── 24/281 icons · 2 selected ─╮
│ › bell▋                       all  lucide  huge                          │
│ ──────────────────────────────────────────────────────────────────────── │
│ ◼ lu-bell           ◻ lu-bell-dot        ◻ lu-bell-minus                 │
│ ◻ lu-bell-off       ◼ lu-bell-ring       ◻ lu-bell-plus                  │
│ ──────────────────────────────────────────────────────────────────────── │
│ bell-ring · lucide · Notification                                        │
│ notification, alert, alarm, reminder                                     │
│ → animateicons add bell-ring                                             │
│ type to filter · ↑↓←→ move · space select · enter add · tab library  2/8 │
╰──────────────────────────────────────────────────────────────────────────╯
```

It's a live, fzf-style picker - just **type** to filter (no mode to toggle). Keys: `↑↓←→` move · `space` select · `Enter` add (selected, else highlighted) · `Tab` cycle library · `Esc` / `Ctrl-C` quit. Requires an interactive terminal.

## `add`

```
animateicons add <...names> [options]

  -d, --dir <dir>     Target directory (default: components/icons)
  --overwrite         Replace files that already exist
  --with-utils        Scaffold a minimal lib/utils.ts `cn` if your project has none
```

Names accept either the bare icon name (`bell-ring`) or the prefixed registry id
(`lu-bell-ring` / `hu-activity`). When a bare name exists in more than one library the
CLI asks you to pick the prefixed id.

Copied icons import `cn` from `@/lib/utils` (the shadcn convention). If a
`components.json` is present its `aliases.utils` is honored automatically; otherwise pass
`--with-utils` to scaffold one. The icons also require [`motion`](https://motion.dev) -
the CLI prints the right install command for your package manager.

## Global options

```
  --registry <url>    Registry base URL or local directory (advanced/testing)
  --cwd <dir>         Run as if in this directory
  --json              Machine-readable output
```

MIT © Avijit Dey
