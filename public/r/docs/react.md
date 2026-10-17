# React

`@animateicons/react` gives you every icon as a React component. It works with React 18 and 19, including Next.js.

## Installation

- `npm install @animateicons/react`
- `pnpm add @animateicons/react`
- `yarn add @animateicons/react`
- `bun add @animateicons/react`

`motion` is bundled, so this is the only install.

## Usage

Import any icon component from the `lucide` or `huge` subpath. The name is the icon name in PascalCase plus `Icon`: `bell-ring` is `BellRingIcon`, and the Huge `arrow-up-right-0-1` is `ArrowUpRight01Icon`.

```tsx title="Example.tsx"
import { BellRingIcon } from "@animateicons/react/lucide"

export default function Example() {
	return <BellRingIcon size={32} color="tomato" />
}
```

The icon plays on hover and resets when the pointer leaves.

## Next.js

In the App Router, import each icon from its own file. Importing from the main package loads every icon: 918 kB of client JavaScript, compared with 71 kB for one icon.

```tsx title="Example.tsx"
import { BellRingIcon } from "@animateicons/react/lucide/bell-ring-icon"
import { HeartIcon } from "@animateicons/react/huge/heart-icon"
```

The path is the icon's file name, so `BellRingIcon` becomes `bell-ring-icon`. These paths only work with ESM imports. If you use `require()`, import from the main package.

## Props

```tsx title="Example.tsx"
<BellRingIcon
	size={32}
	color="tomato"
	className="text-primary"
	duration={1.5}
	isAnimated={true}
/>
```

- `size`: width and height in pixels. Default `24`.
- `color`: the icon color. Default `currentColor`, so the icon follows the text color.
- `className`: classes for the icon wrapper, such as a Tailwind `text-*` color.
- `duration`: a speed multiplier for every duration and delay. `2` plays at half speed. Default `1`.
- `isAnimated`: play on hover. `false` turns hover off. Default `true`.

## Playing it yourself

Pass a ref to play an icon from your own code, for example when its button is hovered, clicked or focused. Every icon exports a `*Handle` type for its ref.

```tsx title="RingButton.tsx"
"use client"

import { useRef } from "react"
import { BellIcon, type BellIconHandle } from "@animateicons/react/lucide"

export function RingButton() {
	const bell = useRef<BellIconHandle>(null)

    return (
    	<button
    		onMouseEnter={() => bell.current?.startAnimation()}
    		onMouseLeave={() => bell.current?.stopAnimation()}
    	>
    		<BellIcon ref={bell} />
    		Notifications
    	</button>
    )

}
```

Once an icon has a ref, it no longer plays on its own hover, so you decide when it moves. Its `onMouseEnter` and `onMouseLeave` props still fire.

> **Tip:** Use the `useIconHover` hook to play icons on hover or click without writing the handlers yourself. See the [Hover helper](https://animateicons.in/icons/docs/examples/hover-helper).

## Server Components

Icons render inside Server Components when you pass plain props such as `size`, `color` and `duration`. A ref or an event handler needs a Client Component, so add `"use client"` to the file that uses one.

## Types

```ts title="Types"
interface IconProps {
	size?: number
	color?: string
	className?: string
	duration?: number
	isAnimated?: boolean
	onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
	onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
	style?: React.CSSProperties
}

interface IconHandle {
startAnimation: () => void
stopAnimation: () => void
}
```

> **Note:** Animations respect the **Reduce Motion** setting. With it turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

## Copy the source instead

Prefer to own the icon files? The [shadcn CLI](https://animateicons.in/icons/docs/shadcn) and the [animateicons CLI](https://animateicons.in/icons/docs/cli) copy an icon into your project as one editable file. Copied icons take the same props and ref, so everything on this page still applies.

---

Source: https://animateicons.in/icons/docs/react
All AnimateIcons docs: https://animateicons.in/llms.txt
