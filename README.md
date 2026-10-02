<div align="center">

# AnimateIcons

**1132 animated SVG icons for React.** Hover & imperative triggers, configurable size, color, and duration. Built on `motion/react`.

[Browse icons](https://animateicons.in/icons/lucide) &nbsp;·&nbsp; [Docs](https://animateicons.in/icons/docs) &nbsp;·&nbsp; [MCP](https://animateicons.in/icons/docs/mcp) &nbsp;·&nbsp; [Sponsor](https://github.com/sponsors/Avijit07x)

<p>
  <a href="https://www.npmjs.com/package/@animateicons/react"><img alt="npm" src="https://shieldcn.dev/npm/v/@animateicons/react.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/stargazers"><img alt="GitHub stars" src="https://shieldcn.dev/github/stars/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/graphs/contributors"><img alt="Contributors" src="https://shieldcn.dev/github/contributors/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/commits"><img alt="Last commit" src="https://shieldcn.dev/github/last-commit/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="./LICENSE"><img alt="License MIT" src="https://shieldcn.dev/github/license/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://vercel.com/open-source-program"><img alt="Vercel OSS Program" src="https://shieldcn.dev/badge/Vercel_OSS_Program_Member.svg?variant=branded&size=xs&theme=zinc&logo=vercel" /></a>
</p>

<br />

![AnimateIcons preview](./public/og.png)

</div>

---

## Quick start

```bash
pnpm add @animateicons/react
```

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

Icons animate on hover by default, and `motion` is bundled. Import from `@animateicons/react/lucide` or `@animateicons/react/huge`.

Prefer to own the code? Copy one icon into your project with `npx animateicons add bell-ring`.

## Props

| Prop         | Type      | Default        |
| ------------ | --------- | -------------- |
| `size`       | `number`  | `24`           |
| `color`      | `string`  | `currentColor` |
| `duration`   | `number`  | `1`            |
| `isAnimated` | `boolean` | `true`         |
| `className`  | `string`  | -              |

## Hover, click or both

> [!TIP]
> Use `useIconHover` to play an icon when a user hovers or clicks the button, link or card around it.

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

## Documentation

Read the [documentation](https://animateicons.in/icons/docs) for the CLI, shadcn, MCP, styling and the full API.

## Contributing

PRs adding icons are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE). Icon shapes are based on [Lucide](https://lucide.dev) and [Hugeicons](https://hugeicons.com), see the [third-party notices](./THIRD_PARTY_NOTICES.md).
