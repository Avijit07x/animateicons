# AnimateIcons

![AnimateIcons Preview](./app/opengraph-image.png)

Free and open-source animated SVG icons for React, built for smooth micro-interactions, easy customization, and lightweight performance.

---

## Installation

You can install any icon directly into your project using the **shadcn** CLI:

### npm example

```
npx shadcn@latest add "https://animateicons.in/r/lu-bell.json"
```

### bun example

```
bunx --bun shadcn@latest add "https://animateicons.in/r/lu-bell.json"
```

Replace `lu-bell.json` with any icon name from our gallery.
View all icons → **[animateicons.in](https://animateicons.in)**

---

## Usage

After installing an icon, import it into your component:

```tsx
"use client";
import { AtomIcon } from "@/components/atom-icon";

export default function Page() {
	return <AtomIcon size={28} duration={1} isAnimated={true} />;
}
```

### Bell Icon Example

```tsx
"use client";
import { useRef } from "react";
import { BellRingIcon, BellRingIconHandle } from "@/components/bell-ring-icon";

export default function Page() {
	const bellRef = useRef<BellRingIconHandle>(null);

	return (
		<>
			{/* Default hover animation */}
			<BellRingIcon size={28} duration={1} />

			{/* Programmatic control */}
			<button onClick={() => bellRef.current?.startAnimation()}>Start</button>
			<button onClick={() => bellRef.current?.stopAnimation()}>Stop</button>
			<BellRingIcon ref={bellRef} size={28} duration={1} isAnimated={true} />
		</>
	);
}
```

---

## Features

- Smooth, purposeful animations out-of-the-box
- Lightweight & built with `motion/react`
- 200+ customizable SVG icons
- Works with React & Next.js
- Optimized for performance

---

## Notes

> **Note:** This project is a work in progress — new animated icons are added regularly.
> We’d love your feedback and contributions as the project evolves!
