---
name: animateicons
description: Add animated icons from AnimateIcons (https://animateicons.in) to React, Vue, Angular or plain JavaScript projects. Use when a user wants animated icons, an animated Lucide or Huge icon, or mentions AnimateIcons.
---

# AnimateIcons skill

> Every docs page as markdown: [llms.txt](https://animateicons.in/llms.txt). Overview: [index.md](https://animateicons.in/index.md).

AnimateIcons has 1,500 free, open source animated icons in two styles: 999 Lucide and 501 Huge. Every animation is hand-crafted and tuned to feel smooth.

## 1. Pick the package

Use the package for the user's framework:

- **React:** `@animateicons/react`. Icon components for React 18 and 19, including Next.js. Guide: https://animateicons.in/r/docs/react.md
- **Vue:** `@animateicons/vue`. Icon components for Vue 3.5 and newer, including Nuxt. Guide: https://animateicons.in/r/docs/vue.md
- **Angular:** `@animateicons/angular`. One standalone component for Angular 20, 21 and 22. Guide: https://animateicons.in/r/docs/angular.md
- **Plain JS:** `@animateicons/vanilla`. A function, a custom element and a CDN script for any page. Guide: https://animateicons.in/r/docs/vanilla.md

Plain JS also covers web components, Svelte, Solid and Astro. Each package bundles `motion`, so install only that package, for example `npm install @animateicons/react`.

## 2. Find the icon

- Icon names are kebab-case, like `bell-ring` or the Huge `arrow-up-right-0-1`.
- https://animateicons.in/r/catalog.json lists every icon with its library, category and keywords.
- With the MCP server (`npx -y @animateicons/mcp`), call `search_icons`, then `get_icon` with the `framework` argument for the install command and usage code.

## 3. Import it

Use the `lucide` or `huge` subpath for the icon's library.

- **React:** `import { BellRingIcon } from "@animateicons/react/lucide"`. The name is PascalCase plus `Icon`.
- **Next.js App Router:** import each icon from its own file: `import { BellRingIcon } from "@animateicons/react/lucide/bell-ring-icon"`.
- **Vue:** `import { BellRingIcon } from "@animateicons/vue/lucide"`.
- **Angular:** add `AnimateIcons` from `@animateicons/angular` to the component's `imports`, import the icon data with `import { BellRing } from "@animateicons/angular/lucide"`, set `bellRing = BellRing` on the component and render `<animate-icons [icon]="bellRing" />`.
- **Plain JS:** `createIcon(BellRing, { size: 32 })`, with `createIcon` from `@animateicons/vanilla` and `BellRing` from `@animateicons/vanilla/lucide`.

## 4. Control it

- Every package takes `size` (default `24`), `color` (default `currentColor`), `duration` (a speed multiplier, default `1`) and `isAnimated` (play on hover, default `true`). Vue templates and the plain JS tag write it as `is-animated`.
- To play an icon from code, for example when its button is hovered or clicked, call `startAnimation()` and `stopAnimation()` on it. In React, pass a ref typed with the icon's `*Handle` type.

## Common pitfalls

- In the Next.js App Router, importing from `@animateicons/react/lucide` loads every icon. Import each icon from its own file.
- Per-icon paths are ESM only. With `require()`, import from the main package.
- With the Reduce Motion setting on, hover does nothing and `startAnimation()` keeps the icon at rest. That is expected.
