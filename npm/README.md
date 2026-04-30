# @animateicons/react

Animated SVG icons for React. Hover to animate, or drive animations imperatively from refs. 281 icons across two libraries, fully tree-shakeable, ESM + CJS, RSC-ready.

[![npm](https://img.shields.io/npm/v/@animateicons/react?color=f45b48)](https://www.npmjs.com/package/@animateicons/react)
[![bundle](https://img.shields.io/bundlephobia/minzip/@animateicons/react)](https://bundlephobia.com/package/@animateicons/react)
[![types](https://img.shields.io/npm/types/@animateicons/react?color=blue)](https://www.npmjs.com/package/@animateicons/react)
[![license](https://img.shields.io/npm/l/@animateicons/react?color=f45b48)](./LICENSE)

## Install

```bash
pnpm add @animateicons/react
```

`react` and `react-dom` are peer dependencies. `motion` is bundled — no separate install needed.

## Usage

Lucide and Huge icons live on separate subpath imports because their names overlap (`HeartIcon`, `CopyIcon`, etc.):

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";
import { HeartIcon } from "@animateicons/react/huge";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

Hover-to-animate works out of the box. No setup, no providers.

## Props

```ts
interface IconProps {
	size?: number; // default 24
	color?: string; // any CSS color (hex, rgb, hsl, var(--token))
	className?: string;
	style?: React.CSSProperties;
	duration?: number; // animation speed multiplier — default 1, 0.5 = 2x faster
	isAnimated?: boolean; // default true — false disables hover trigger
	// ...all standard HTMLDivElement props
}
```

## Imperative API

Every icon's ref exposes `startAnimation()` and `stopAnimation()`:

```tsx
"use client";
import { useRef } from "react";
import {
	BellRingIcon,
	type BellRingIconHandle,
} from "@animateicons/react/lucide";

export function Bell() {
	const ref = useRef<BellRingIconHandle>(null);

	return (
		<button
			onMouseEnter={() => ref.current?.startAnimation()}
			onMouseLeave={() => ref.current?.stopAnimation()}
		>
			<BellRingIcon ref={ref} size={28} />
		</button>
	);
}
```

The shared `IconHandle` type is also exported from the root for generic ref typing:

```ts
import type { IconHandle } from "@animateicons/react";
```

## Accessibility

All icons honor `prefers-reduced-motion` automatically. When the user has reduced motion enabled, hover and imperative triggers become no-ops. Nothing to configure.

## Compatibility

| Constraint       | Supported                                           |
| ---------------- | --------------------------------------------------- |
| React            | 18 or 19                                            |
| Node (tooling)   | ≥ 18.17                                             |
| Module formats   | ESM + CommonJS                                      |
| TypeScript       | strict-mode types ship with the package             |
| RSC / Next 13–16 | every icon carries a `"use client"` directive       |
| Tree-shaking     | `sideEffects: false`, ESM imports drop unused icons |

Published with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) — every release links back to the GitHub commit that built it.

## Links

- **Gallery & live playground**: [animateicons.in](https://animateicons.in/icons/lucide)
- **Documentation**: [animateicons.in/icons/docs](https://animateicons.in/icons/docs)
- **Repository**: [github.com/Avijit07x/animateicons](https://github.com/Avijit07x/animateicons)
- **Changelog**: [GitHub releases](https://github.com/Avijit07x/animateicons/releases)
- **Issues**: [github.com/Avijit07x/animateicons/issues](https://github.com/Avijit07x/animateicons/issues)

## License

MIT © [Avijit Dey](https://github.com/Avijit07x). See [LICENSE](./LICENSE).
