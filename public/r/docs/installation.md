# Introduction

AnimateIcons is 1335 free animated SVG icons in two styles, Lucide and Huge. Every icon ships for React, Vue, Angular and plain JavaScript, and moves the same way in each.

## Pick your framework

Each framework has its own package. Install the one for your app, then follow its guide.

- [React](https://animateicons.in/icons/docs/react): `@animateicons/react`. Icon components for React 18 and 19, including Next.js.
- [Vue](https://animateicons.in/icons/docs/vue): `@animateicons/vue`. Icon components for Vue 3.5 and newer, including Nuxt.
- [Angular](https://animateicons.in/icons/docs/angular): `@animateicons/angular`. One standalone component for Angular 20, 21 and 22.
- [Plain JS](https://animateicons.in/icons/docs/vanilla): `@animateicons/vanilla`. A function, a custom element and a CDN script for any page.

> **Tip:** Using Svelte, Solid, Astro or a plain HTML page? Use the [Plain JS](https://animateicons.in/icons/docs/vanilla) package. It works on any web page.

## What every package shares

- The same 1335 icons. Their motion is checked frame by frame against React in every framework.
- Icons play on hover out of the box and reset when the pointer leaves.
- The same options: `size`, `color`, `duration` (a speed multiplier) and `isAnimated`.
- `startAnimation()` and `stopAnimation()` to play an icon from your own code.
- The **Reduce Motion** setting is respected with no setup.
- `motion` comes inside every package, so there is nothing else to install.

## Icon names

Every icon has a name such as `bell-ring`, shown in the [gallery](https://animateicons.in/icons/lucide). React and Vue export a component named after it in PascalCase with `Icon` at the end. Angular and plain JS export the icon itself, without `Icon`.

```ts title="Imports"
// React
import { BellRingIcon } from "@animateicons/react/lucide"

// Vue
import { BellRingIcon } from "@animateicons/vue/lucide"

// Angular
import { BellRing } from "@animateicons/angular/lucide"

// Plain JS
import { BellRing } from "@animateicons/vanilla/lucide"
```

Lucide icons come from the `lucide` subpath and Huge icons from `huge`, because a few names exist in both, such as `heart` and `copy`.

## Other ways to add icons

- The [shadcn CLI](https://animateicons.in/icons/docs/shadcn) and the [animateicons CLI](https://animateicons.in/icons/docs/cli) copy a React icon into your project as an editable file, instead of installing the package.
- The [MCP server](https://animateicons.in/icons/docs/mcp) lets an AI coding agent such as Claude Code or Cursor find icons and write the code for any of the four frameworks.

---

Source: https://animateicons.in/icons/docs
All AnimateIcons docs: https://animateicons.in/llms.txt
