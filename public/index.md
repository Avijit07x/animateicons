# AnimateIcons

> 1,500 free, open source animated icons for React, Vue, Angular and plain JavaScript, in Lucide and Huge styles. Every animation is hand-crafted and tuned to feel smooth, and plays the same in every framework.

Website: https://animateicons.in. Every docs page as markdown: [llms.txt](https://animateicons.in/llms.txt). Guide for AI agents: [skill.md](https://animateicons.in/skill.md).

## Icons

- 999 Lucide-style icons: https://animateicons.in/icons/lucide
- 501 Huge-style icons: https://animateicons.in/icons/huge
- Every icon with its library, category and keywords: https://animateicons.in/r/catalog.json

## Why AnimateIcons

- **Hand-crafted motion.** Every icon has its own animation, tuned to feel smooth.
- **Same motion in every framework.** The Vue, Angular and plain JS packages are checked frame by frame against React.
- **Lightweight.** One React icon, with the motion runtime it needs, is under 28.5 kB minified and brotli-compressed. Five icons stay under 29 kB. CI fails any change that goes over. React itself is not counted.
- **Hover or code.** Icons play on hover, or from your own code with `startAnimation()` and `stopAnimation()`.
- **Accessible.** The Reduce Motion setting is respected with no setup.
- **Free and open source.** MIT licensed, for personal and commercial use.

## Packages

- **React:** `@animateicons/react`. Icon components for React 18 and 19, including Next.js. Guide: https://animateicons.in/r/docs/react.md
- **Vue:** `@animateicons/vue`. Icon components for Vue 3.5 and newer, including Nuxt. Guide: https://animateicons.in/r/docs/vue.md
- **Angular:** `@animateicons/angular`. One standalone component for Angular 20, 21 and 22. Guide: https://animateicons.in/r/docs/angular.md
- **Plain JS:** `@animateicons/vanilla`. A function, a custom element and a CDN script for any page. Guide: https://animateicons.in/r/docs/vanilla.md

Plain JS also covers web components, Svelte, Solid and Astro. Each package bundles `motion`, so it is the only install.

## Usage

Install the package for your framework, for example `npm install @animateicons/react`. Then:

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";

export default function Example() {
	return <BellRingIcon size={32} color="tomato" />;
}
```

The name is the icon name in PascalCase plus `Icon`: `bell-ring` is `BellRingIcon`. In the Next.js App Router, import each icon from its own file, such as `@animateicons/react/lucide/bell-ring-icon`.

## Other ways to add icons

- **shadcn CLI:** `npx shadcn@latest add @animateicons/lu-eye` copies one React icon into your project as a file you can edit.
- **CLI:** `npx animateicons add eye` does the same from the terminal.
- **MCP server:** `npx -y @animateicons/mcp` lets AI agents search icons, read the docs and add icons.

## Links

- GitHub: https://github.com/Avijit07x/animateicons
- npm: https://www.npmjs.com/package/@animateicons/react
- License: MIT
- Author: Avijit Dey (https://github.com/Avijit07x)
