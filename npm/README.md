# @animateicons/react

Animated SVG icons for React. Built on motion/react.

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

## Imperative API

Trigger animation from a parent via ref:

```tsx
"use client";
import { useRef } from "react";
import { BellRingIcon, type BellRingIconHandle } from "@animateicons/react/lucide";

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

| Prop          | Type      | Default     |
| ------------- | --------- | ----------- |
| `size`        | `number`  | `24`        |
| `color`       | `string`  | `currentColor` |
| `duration`    | `number`  | `1`         |
| `isAnimated`  | `boolean` | `true`      |
| `className`   | `string`  | —           |

## License

MIT © [Avijit Dey](https://github.com/Avijit07x)
