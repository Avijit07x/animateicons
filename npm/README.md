# @animateicons/react

281 animated SVG icons for React. Hover and imperative triggers, configurable size, color, and duration. Built on `motion/react`.

[![npm](https://img.shields.io/npm/v/@animateicons/react?color=f45b48)](https://www.npmjs.com/package/@animateicons/react)
[![bundle](https://img.shields.io/bundlephobia/minzip/@animateicons/react)](https://bundlephobia.com/package/@animateicons/react)
[![types](https://img.shields.io/npm/types/@animateicons/react?color=blue)](https://www.npmjs.com/package/@animateicons/react)
[![license](https://img.shields.io/npm/l/@animateicons/react?color=f45b48)](./LICENSE)

[**Browse icons →**](https://animateicons.in/icons/lucide) &nbsp;·&nbsp; [**Docs →**](https://animateicons.in/icons/docs)

## Install

`react` and `react-dom` are peer dependencies. `motion` is bundled — no separate install needed.

```bash
pnpm add @animateicons/react
```

## Usage

Lucide and Huge are exposed as scoped subpaths because some icon names overlap (`HeartIcon`, `CopyIcon`, etc.).

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";
import { HeartIcon } from "@animateicons/react/huge";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

That's it — the icon animates on hover by default.

## Styling

Every icon strokes `currentColor`, so it inherits the surrounding text color. You can also pass `color`, `className`, or use the `duration` and `isAnimated` props to control playback.

```tsx
// Color — sets currentColor inline
<BellRingIcon color="#f45b48" />

// Tailwind utility — works because icons stroke="currentColor"
<BellRingIcon className="text-primary" />

// Speed — duration is a multiplier (lower = faster)
<BellRingIcon duration={0.6} />

// Disable hover animation
<BellRingIcon isAnimated={false} />
```

## Imperative API

Need to trigger an animation from a parent — on click, on focus, or programmatically? Pass a ref. Each icon exports its own `*Handle` type.

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

## Compatibility

| Requirement    | Supported                                     |
| -------------- | --------------------------------------------- |
| React          | 18 or 19                                      |
| Module formats | ESM + CommonJS                                |
| TypeScript     | strict-mode types ship with the package       |
| Next.js        | every icon carries a `"use client"` directive |

## Links

- **Gallery**: [animateicons.in](https://animateicons.in/icons/lucide)
- **Docs**: [animateicons.in/icons/docs](https://animateicons.in/icons/docs)
- **Repository**: [github.com/Avijit07x/animateicons](https://github.com/Avijit07x/animateicons)
- **Issues**: [github.com/Avijit07x/animateicons/issues](https://github.com/Avijit07x/animateicons/issues)

## License

MIT © [Avijit Dey](https://github.com/Avijit07x).
