# Contributing to AnimateIcons

Thank you for your interest in contributing!
AnimateIcons is a library of **beautiful animated SVG icons** built with [React](https://react.dev/), [motion/react](https://motion.dev/), and [Lucide](https://lucide.dev/).

We welcome contributions of **new icons, bug fixes, and improvements**.  
Please follow the guide below to keep the codebase clean and consistent.

---

## Getting Started

1. **Fork** the repo and clone it:

   ```bash
   git clone https://github.com/avijit07x/animateicons.git
   ```

2. Navigate to the project directory:

   ```bash
   cd animateicons
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

This will run the docs playground where you can preview your icon.

---

## Adding a New Icon

All icons live inside the `src/icons/` directory.
Each icon is a **React component** (with animation support via `motion/react`), and all icons are registered in `src/icons/index.ts` through the `ICON_LIST` array.

---

### 1. Create Your Icon File

- Go to `src/icons/`
- Copy the template below into a new file, e.g. `DashboardIcon.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface DashboardIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface DashboardIconProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const DashboardIcon = forwardRef<DashboardIconHandle, DashboardIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const iconVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.05, 0.95, 1],
				rotate: [0, -2, 2, 0],
				transition: { duration: 1.3, ease: "easeInOut", repeat: 0 },
			},
		};

		const tileVariants: Variants = {
			normal: { opacity: 1, scale: 1, y: 0 },
			animate: (i: number) => ({
				opacity: [0.5, 1, 0.8, 1],
				scale: [0.9, 1.1, 1],
				y: [2, -2, 0],
				transition: {
					duration: 1.2,
					ease: "easeInOut",
					repeat: 0,
					delay: i * 0.2,
				},
			}),
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					animate={controls}
					initial="normal"
					variants={iconVariants}
				>
					<motion.rect
						width="7"
						height="9"
						x="3"
						y="3"
						rx="1"
						variants={tileVariants}
						custom={0}
						initial="normal"
						animate={controls}
					/>
					<motion.rect
						width="7"
						height="5"
						x="14"
						y="3"
						rx="1"
						variants={tileVariants}
						custom={1}
						initial="normal"
						animate={controls}
					/>
					<motion.rect
						width="7"
						height="9"
						x="14"
						y="12"
						rx="1"
						variants={tileVariants}
						custom={2}
						initial="normal"
						animate={controls}
					/>
					<motion.rect
						width="7"
						height="5"
						x="3"
						y="16"
						rx="1"
						variants={tileVariants}
						custom={3}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

DashboardIcon.displayName = "DashboardIcon";
export { DashboardIcon };
```

---

### 2. Add the Icon to `index.ts`

Open `src/icons/index.ts` and:

1.  **Import your icon** at the top:

```ts
import { DashboardIcon } from "./DashboardIcon";
```

2.  **Add it inside the `ICON_LIST` array** with a unique name and keywords:

```ts
{
	name: "dashboard",
	icon: DashboardIcon,
	keywords: ["masonry", "brick", "panel", "grid", "widgets", "layout"],
},
```

---

### 3. Test Your Icon

- Run the dev playground with `npm run dev`
- Make sure animation works on **hover** and with **programmatic control**.

---

## Commit & PR Guidelines

1. Create a new branch:

```bash
git checkout -b feat/new-icon-name
```

2. Commit message style:
   - `feat: add DashboardIcon`
   - `fix: fix bug in DashboardIcon`

3. Push and open a Pull Request to the `dev` branch:

   ```bash
   git push origin feat/new-icon-name
   ```

---

## PR Checklist

Before submitting a PR, make sure:

- [ ] Icon follows the template
- [ ] Icon is based on [Lucide](https://lucide.dev/) (no custom/random SVGs)
- [ ] Animations implemented using [motion/react](https://motion.dev/) (correct import pattern followed)
- [ ] Icon added and registered in src/icons/index.ts (import at top + entry in ICON_LIST with unique name & keywords)
- [ ] Tested locally in playground
- [ ] PR should target `dev` branch only. Maintainers will merge `dev` → `main` during release.

---

## Tips

- Use **Lucide icons** as a base whenever possible for consistency.
- Keep animations subtle and smooth (0.3s – 0.8s).
- Follow the existing **naming convention**: `SomethingIcon.tsx`

---

Thanks for contributing!
Together, we’re making AnimateIcons better for everyone.
