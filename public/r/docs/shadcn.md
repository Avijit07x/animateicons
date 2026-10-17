# shadcn CLI

Use this if you want each React icon copied into your codebase as a single file you can edit.

> **Note:** The shadcn CLI copies React components. For Vue, Angular or plain JS, install the package for your framework from the [Introduction](https://animateicons.in/icons/docs).

#### 1. Set up shadcn

If your project doesn't have shadcn yet, follow the [shadcn installation guide](https://ui.shadcn.com/docs/installation) first.

#### 2. Add an icon

Browse the [Lucide](https://animateicons.in/icons/lucide) or [Huge](https://animateicons.in/icons/huge) gallery, click any tile to copy its install command, or replace `lu-eye` below with the icon you want.

- `npx shadcn@latest add @animateicons/lu-eye`
- `pnpm dlx shadcn@latest add @animateicons/lu-eye`
- `bunx --bun shadcn@latest add @animateicons/lu-eye`

The icon lands at `components/ui/<name>-icon.tsx`.

#### 3. Import and use

```tsx title="Example.tsx"
import { EyeIcon } from "@/components/ui/eye-icon"

export default function Example() {
	return <EyeIcon size={24} color="#f45b48" />
}
```

---

Source: https://animateicons.in/icons/docs/shadcn
All AnimateIcons docs: https://animateicons.in/llms.txt
