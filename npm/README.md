# @animateicons/react

1132 animated SVG icons for React. Built on motion/react.

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

## Hover, click or both

Every icon has `startAnimation()` and `stopAnimation()`. `useIconHover` calls them for you when a user hovers or clicks:

```tsx
"use client";
import { useIconHover } from "@animateicons/react";
import { BellRingIcon } from "@animateicons/react/lucide";

export default function Bell() {
	const { ref, triggerProps } = useIconHover(); // hover (default)
	// const { ref, triggerProps } = useIconHover({ trigger: "click" }); // click only
	// const { ref, triggerProps } = useIconHover({ trigger: "both" }); // hover and click
	// const { icon: { bell, bookmark }, trigger } = useIconHover({ trigger: [{ icon: "bell", trigger: "click" }, { icon: "bookmark", trigger: "hover" }] }); // multiple icons: <Icon {...bell} />, <Icon {...bookmark} />

	return (
		<button {...triggerProps}>
			<BellRingIcon ref={ref} size={28} />
		</button>
	);
}
```

More examples in the [hover helper docs](https://animateicons.in/icons/docs/examples/hover-helper).

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

Icon shapes are based on [Lucide](https://lucide.dev) and [Hugeicons](https://hugeicons.com), see the [third-party notices](./THIRD_PARTY_NOTICES.md).
