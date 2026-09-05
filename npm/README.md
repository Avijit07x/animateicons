# @animateicons/react

542 animated SVG icons for React. Built on motion/react.

[![npm](https://img.shields.io/npm/v/@animateicons/react?color=f45b48)](https://www.npmjs.com/package/@animateicons/react)
[![bundle](https://img.shields.io/bundlephobia/minzip/@animateicons/react)](https://bundlephobia.com/package/@animateicons/react)
[![types](https://img.shields.io/npm/types/@animateicons/react?color=blue)](https://www.npmjs.com/package/@animateicons/react)
[![license](https://img.shields.io/npm/l/@animateicons/react?color=f45b48)](./LICENSE)

## Documentation

For full documentation, visit [animateicons.in/icons/docs](https://animateicons.in/icons/docs).

Browse all icons at [animateicons.in](https://animateicons.in).

## Installation

```bash
npm i @animateicons/react
```

```bash
pnpm add @animateicons/react
```

```bash
yarn add @animateicons/react
```

```bash
bun add @animateicons/react
```

## Usage

Import any icon from the `lucide` or `huge` subpath:

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";
import { HeartIcon } from "@animateicons/react/huge";

export default function Demo() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

The icon animates on hover by default.

## Bundle size

Each icon is published as its own module, so bundlers drop the ones you
don't import. Importing from the barrel is enough for Vite, Rollup, esbuild
and webpack.

**Next.js App Router is the exception.** The `lucide` / `huge` barrels carry
the `"use client"` directive, which makes them a client boundary Next cannot
tree-shake through - a barrel import pulls in the whole set. Import the icon
directly instead:

```tsx
import { BellRingIcon } from "@animateicons/react/lucide/bell-ring-icon";
import { HeartIcon } from "@animateicons/react/huge/heart-icon";
```

The subpath is the icon's file name: `BellRingIcon` -> `bell-ring-icon`.
Measured in a Next 16 production build, for one icon: 918 kB -> 71 kB of
client JS (91 kB -> 24 kB gzipped).

Deep subpaths are ESM-only. `require()` consumers should use the barrel.

## Imperative API

Trigger animation from a parent via ref:

```tsx
"use client";
import { useRef } from "react";
import {
	BellRingIcon,
	type BellRingIconHandle,
} from "@animateicons/react/lucide";

export default function Bell() {
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

## Props

| Prop         | Type      | Default        |
| ------------ | --------- | -------------- |
| `size`       | `number`  | `24`           |
| `color`      | `string`  | `currentColor` |
| `duration`   | `number`  | `1`            |
| `isAnimated` | `boolean` | `true`         |
| `className`  | `string`  | -              |

## License

MIT © [Avijit Dey](https://github.com/Avijit07x)
