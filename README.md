<div align="center">

# AnimateIcons

**281 animated SVG icons for React.** Hover and imperative triggers, configurable size, color, and duration. Built on `motion/react`.

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

## Installation

Pick one of the two paths below. Both ship the same icons and the same API — the only difference is whether you depend on the package or own the source.

### npm package

Recommended for most apps. One install, all 281 icons available.

**1. Install the package** — `motion` is bundled.

```bash
pnpm add @animateicons/react
```

**2. Import an icon** — Lucide and Huge are exposed as scoped subpaths because some icon names overlap (`HeartIcon`, `CopyIcon`, etc.).

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

That's it — the icon animates on hover by default.

### shadcn CLI

Use this if you want each icon copied into your codebase as a single file you can edit.

**1. Set up shadcn** — if your project doesn't have it yet, follow the [shadcn installation guide](https://ui.shadcn.com/docs/installation).

**2. Add an icon** — browse the [Lucide](https://animateicons.in/icons/lucide) or [Huge](https://animateicons.in/icons/huge) gallery, click any tile to copy its install command, or replace `lu-bell-ring` below with the icon you want.

```bash
pnpm dlx shadcn@latest add https://animateicons.in/r/lu-bell-ring.json
```

The icon lands at `components/ui/<name>.tsx`.

**3. Import and use**

```tsx
import { BellRingIcon } from "@/components/ui/bell-ring";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

---

## Styling

Every icon strokes `currentColor`, so it inherits the surrounding text color. You can also pass `color`, `className`, or use the `duration` and `isAnimated` props to control playback.

```tsx
// Color — sets currentColor inline
<EyeIcon color="#f45b48" />

// Tailwind utility — works because icons stroke="currentColor"
<EyeIcon className="text-primary" />

// Speed — duration is a multiplier (lower = faster)
<EyeIcon duration={0.6} />

// Disable hover animation
<EyeIcon isAnimated={false} />
```

---

## Imperative API

Need to trigger an animation from a parent — on click, on focus, or programmatically? Pass a ref. Each icon exports its own `*Handle` type.

```tsx
"use client";
import { useRef } from "react";
import { EyeIcon, type EyeIconHandle } from "@/components/ui/eye";

export function Demo() {
	const ref = useRef<EyeIconHandle>(null);

	return (
		<button
			onMouseEnter={() => ref.current?.startAnimation()}
			onMouseLeave={() => ref.current?.stopAnimation()}
		>
			<EyeIcon ref={ref} size={28} />
		</button>
	);
}
```

---

## Props & types

```ts
interface IconProps {
	size?: number;
	color?: string;
	className?: string;
	duration?: number;
	isAnimated?: boolean;
	onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
	style?: React.CSSProperties;
}

interface IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}
```

Animations respect the OS-level **Reduce Motion** preference — no extra setup required.

---

## Repository layout

```
animateicons/
├── icons/
│   ├── lucide/          248 Lucide-style icons
│   └── huge/             33 Huge-style icons
├── npm/                 @animateicons/react published package
├── app/
│   ├── icons/[library]/ gallery routes
│   └── icons/docs/      install guide (MDX)
├── components/          shared UI (Hero, Section, etc.)
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
pnpm dev
```

Common scripts:

```bash
pnpm dev          # gallery dev server (Turbopack)
pnpm build        # production build
pnpm test         # vitest run
pnpm typecheck    # tsc --noEmit

pnpm --filter @animateicons/react build       # build the npm package
pnpm --filter @animateicons/react test:smoke  # smoke-test the built dist
```

---

## Contributing

PRs adding icons are welcome. Each icon is a single React component file — copy any existing one as a template.

1. Create `icons/<library>/<name>-icon.tsx` from an existing icon
2. Register it in `icons/<library>/index.ts`
3. Run `pnpm gen:icons` to regenerate the public registry
4. Open a PR against `dev`

Full workflow in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE).

If AnimateIcons saves you time, consider [sponsoring the project](https://github.com/sponsors/Avijit07x).

---

<div align="center">

Built with [Next.js](https://nextjs.org), [motion/react](https://motion.dev), and [shadcn/ui](https://ui.shadcn.com).

**[animateicons.in](https://animateicons.in)** &nbsp;·&nbsp; [GitHub](https://github.com/Avijit07x/animateicons) &nbsp;·&nbsp; [@animateicons/react on npm](https://www.npmjs.com/package/@animateicons/react)

</div>
