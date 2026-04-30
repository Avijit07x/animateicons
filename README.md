<div align="center">

# AnimateIcons

**281 animated SVG icons for React, two ways to ship them.**
Hover and imperative triggers, configurable size, color, and duration. Built on `motion/react`.

[![npm](https://img.shields.io/npm/v/@animateicons/react?color=f45b48&label=%40animateicons%2Freact)](https://www.npmjs.com/package/@animateicons/react)
[![License](https://img.shields.io/badge/License-MIT-f45b48.svg)](./LICENSE)
[![Lucide](https://img.shields.io/badge/Lucide-248_icons-2a2a2a)](https://animateicons.in/icons/lucide)
[![Huge](https://img.shields.io/badge/Huge-33_icons-2a2a2a)](https://animateicons.in/icons/huge)
[![Next.js](https://img.shields.io/badge/Next.js-16-2a2a2a)](https://nextjs.org)
[![motion](https://img.shields.io/badge/motion%2Freact-12-2a2a2a)](https://motion.dev)

[**Browse icons →**](https://animateicons.in/icons/lucide) &nbsp;·&nbsp; [**Docs →**](https://animateicons.in/icons/docs) &nbsp;·&nbsp; [**Sponsor →**](https://github.com/sponsors/Avijit07x)

![AnimateIcons preview](./public/og.png)

</div>

---

## Two ways to install

| Distribution    | Best for                                                                 | What you get                                                              |
| --------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **npm package** | Production apps, monorepos, anywhere you want updates                    | `pnpm add @animateicons/react`, tree-shakeable imports                    |
| **shadcn CLI**  | Owning the source, customizing per-icon, smaller payload for one-off use | One file copies into `components/ui/`, no runtime dependency on this repo |

Pick whichever fits. Both ship the exact same icons, the exact same animations.

---

## Quick start

### Option A — npm package

```bash
pnpm add @animateicons/react
```

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

Full docs at [npm/README.md](./npm/README.md) and on [npmjs.com](https://www.npmjs.com/package/@animateicons/react).

### Option B — shadcn CLI

```bash
pnpm dlx shadcn@latest init                                   # if you haven't already
pnpm dlx shadcn@latest add https://animateicons.in/r/lu-bell-ring.json
```

```tsx
import { BellRingIcon } from "@/components/ui/bell-ring";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

Browse the gallery at **[animateicons.in](https://animateicons.in/icons/lucide)** — every tile has one-click copy buttons for both routes.

---

## Why AnimateIcons

Most icon libraries are static SVGs. AnimateIcons gives you the same icon coverage, but each one is a self-contained React component with motion baked in.

- **Hover animation by default.** Drop one in, it just works.
- **Imperative API.** Drive animations from refs (`startAnimation()` / `stopAnimation()`) for click, focus, scroll, or any custom trigger.
- **Accessibility automatic.** Every icon respects `prefers-reduced-motion` — no flag to set.
- **TypeScript-first.** Per-icon `*Handle` types and a shared `IconHandle` type for generic refs.
- **Themeable.** Works with `currentColor`, Tailwind utilities, and CSS variables out of the box.
- **No vendor lock-in.** Pick the npm package for convenience or the shadcn CLI to own the source. Switch any time.

---

## Props & types

```ts
interface IconProps {
	size?: number; // default 24
	color?: string; // any CSS color: hex, rgb, hsl, var(--token)
	className?: string;
	style?: React.CSSProperties;
	duration?: number; // animation speed multiplier — default 1, 0.5 = 2x faster
	isAnimated?: boolean; // default true — false disables hover trigger
	onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}
```

Each icon also exports a named handle alias (`BellRingIconHandle`, `EyeIconHandle`, etc.) for ergonomic ref typing at the call site.

---

## Examples

### Color and styling

```tsx
<EyeIcon color="#f45b48" />                            // inline color
<EyeIcon className="text-primary" />                   // Tailwind utility (uses currentColor)
<EyeIcon style={{ color: "var(--brand)" }} />          // CSS variable
```

### Animation control

```tsx
<EyeIcon size={28} />                  // default — hover to animate
<EyeIcon size={28} duration={1.5} />   // slow down
<EyeIcon size={28} isAnimated={false} /> // disable hover trigger entirely
```

### Imperative trigger

```tsx
"use client";
import { useRef } from "react";
import { EyeIcon, type EyeIconHandle } from "@/components/ui/eye";

export function FocusableEye() {
	const ref = useRef<EyeIconHandle>(null);

	return (
		<button
			onFocus={() => ref.current?.startAnimation()}
			onBlur={() => ref.current?.stopAnimation()}
		>
			<EyeIcon ref={ref} />
		</button>
	);
}
```

---

## Repository layout

```
animateicons/
├── icons/
│   ├── lucide/          248 Lucide-style icons (source of truth)
│   └── huge/            33  Huge-style icons (source of truth)
├── npm/                 @animateicons/react published package (tsup build)
├── app/
│   ├── icons/[library]/ /icons/lucide, /icons/huge gallery
│   └── icons/docs/      MDX-powered install guide
├── components/          shared UI primitives (Hero, Section, etc.)
├── hooks/               useIconFilter, useIconAnimation
├── tests/               Vitest + React Testing Library
└── scripts/             registry codegen, codemods
```

---

## Local development

```bash
git clone https://github.com/Avijit07x/animateicons.git
cd animateicons
pnpm install
pnpm dev                 # gallery at http://localhost:3000
```

### Common scripts

```bash
pnpm dev                          # gallery dev server (Turbopack)
pnpm build                        # production build
pnpm test                         # vitest run
pnpm typecheck                    # tsc --noEmit

pnpm --filter @animateicons/react build      # build the npm package
pnpm --filter @animateicons/react test:smoke # smoke-test the built dist
pnpm --filter @animateicons/react size       # enforce bundle size budgets
```

---

## Contributing new icons

PRs adding icons are welcome. Each icon is a single React component file following the same template — copy any existing icon and adapt the SVG paths and motion variants.

1. Create `icons/<library>/<name>-icon.tsx` from an existing icon as a template
2. Register it in `icons/<library>/index.ts`
3. Run `pnpm gen:icons` to regenerate the public registry
4. Open a PR against `dev`

Full workflow in **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

---

## Roadmap

- More libraries (Phosphor-style, Tabler-style)
- Animation type taxonomy (filter by spin / pulse / morph / draw)
- Per-icon detail pages with embedded playground
- Visual regression suite for icon-source changes

Open issues and PRs welcome — even a single icon is a meaningful contribution.

---

## License

[MIT](./LICENSE) — use it however you want, in any project, commercial or otherwise.

If AnimateIcons saves you time, consider [sponsoring the project](https://github.com/sponsors/Avijit07x) so it keeps growing.

---

<div align="center">

Built with [Next.js](https://nextjs.org), [motion/react](https://motion.dev), and [shadcn/ui](https://ui.shadcn.com).

**[animateicons.in](https://animateicons.in)** &nbsp;·&nbsp; [GitHub](https://github.com/Avijit07x/animateicons) &nbsp;·&nbsp; [@animateicons/react on npm](https://www.npmjs.com/package/@animateicons/react)

</div>
