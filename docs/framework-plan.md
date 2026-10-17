# Vue, Angular and vanilla plan

Today AnimateIcons ships for React only. This plan adds three more packages: plain JavaScript (vanilla), Vue and Angular. They all play the same animations as React, from the same source files, so a new icon works everywhere without extra work.

Status: built and tested on 2026-10-16, not published yet. Written 2026-10-16.

## What changed from the first draft

- Icon data uses the PascalCase icon name (`Bell`, `BellRing`, `ArrowUpRight01`), like Lucide's own packages. Lowercase names break on icons such as `package`, which is a reserved word.
- The generic component is `AnimateIcons` and the tag is `<animate-icons>`, after the brand.
- The test zone is its own small Vite app in `test-zone/` (`pnpm test-zone`), not a page in the site, so Vue and Angular never enter the site build. It drives React and the three packages from one shared frame clock, so every frame is computed at the same moment and compared exactly. Every icon, in every framework, in all three passes takes about a minute (`pnpm test:frames`), so there is no sampling and no need to pick changed icons.
- Fixed in React first: six icons whose delays or durations ignored `duration` (`baggage-claim`, `bitcoin`, `ellipsis`, `ellipsis-vertical`, `scan-qr-code`, `sliders-horizontal`), and three icons with their own state names (`guitar`, `laptop`, `piano`), now `normal` and `animate`.
- `thumbs-up` and `thumbs-down` have a stem and a thumb that never move in React, because they set their own `initial` without `animate`. The data copies what React shows, and `pnpm gen:icon-data` lists them so the owner can decide whether to make them move.
- Icons that use ids (the clip path in Lucide and Huge `mail-open`) get readable ids in the data and a unique suffix for every copy on a page, so copies never share a clip path. Vue uses `useId` for this, so it needs Vue 3.5 or newer.
- The plain player renders the resting state straight away (for example parts that start hidden or undrawn), so the first frame and server-rendered pages match React.

## The short version

1. A script reads every React icon and writes its shapes and motion out as plain data.
2. One small player, written in plain JavaScript, plays that data on an SVG using `animate()` from `motion`, which works without any framework.
3. `@animateicons/vanilla` wraps the player as a function, a custom HTML tag and a CDN script.
4. `@animateicons/vue` and `@animateicons/angular` are thin components on top of the same player.
5. The React icon files stay the only place anyone writes an icon. Nothing changes for React users.

```
icons/<library>/*-icon.tsx      (source, unchanged)
        │
        ▼  extract script, runs at build time
icon data, one file per icon
        │
        ▼
player  (plain JS + motion's animate())
   ├── @animateicons/vanilla   createIcon(), <animate-icons>, CDN script
   ├── @animateicons/vue       <BellIcon />, <AnimateIcons :icon="Bell" />
   └── @animateicons/angular   <animate-icons [icon]="bell" />
```

## Why this works

I read all 1,170 icons (669 Lucide, 501 Huge). Every one of them is data: SVG shapes plus a `normal` and an `animate` state with timings. None of them have their own logic.

- No timers, no state, no effects, no `await` chains, no springs, no `staggerChildren` or `when` orchestration.
- What moves: `scale`, `scaleX`, `scaleY`, `rotate`, `x`, `y`, `skew`, `opacity`, `strokeDashoffset`, `pathLength`, `pathOffset`, `strokeWidth`. All of these work in motion's plain `animate()`.
- Timing features used: `duration`, `delay`, `times`, named eases, 6 cubic-bezier eases, and one `repeat` loop.

Icons that need extra care:

| What                                             | Icons                               | Why it matters                                                                                                                                           |
| ------------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Variants built by a function or a `custom` index | about 307                           | A text parser would miss these. The extract method below handles them.                                                                                   |
| More than one animation controller               | `link`, `trash-2`                   | All controllers start and stop together, so they map to one start and one stop.                                                                          |
| No `m.svg`, only animated children               | `guitar`, `laptop`, `link`, `piano` | The root does not move. The data must allow that.                                                                                                        |
| `transformOrigin` set in `style`                 | 14                                  | motion/react ignores this on SVG children (see the `originX` rule in `CLAUDE.md`). The data must copy what React really renders, not what the code says. |
| Loops forever                                    | `activity`                          | `stop()` must end the loop.                                                                                                                              |
| `overflow: "visible"` on the SVG                 | 15                                  | Copy it through, or these icons get cut at the edge.                                                                                                     |

## Rules every package follows

Each package behaves like the React one. Users who switch frameworks should not notice a difference.

| React                                                               | Vanilla, Vue and Angular                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `size` (24)                                                         | same name, same default                                                  |
| `color`                                                             | same                                                                     |
| `duration` (1, a multiplier)                                        | same. Every duration and delay in the data is multiplied by it.          |
| `isAnimated` (true)                                                 | same. `false` turns hover off, but `startAnimation()` still works.       |
| `startAnimation()`, `stopAnimation()`                               | same names on the element, the Vue ref and the Angular component         |
| Hover plays, leaving resets                                         | same                                                                     |
| Reduced motion: hover does nothing, `startAnimation()` goes to rest | same, read from `prefers-reduced-motion`                                 |
| Wrapper `div` with `relative inline-flex`                           | wrapper `span` with the same styles set inline, so no Tailwind is needed |

One small difference: in React, passing a `ref` switches the icon to manual mode on its own. Vue and Angular cannot tell when a ref is used. There, manual mode means `isAnimated` set to `false` plus your own calls to `startAnimation()`. The docs must say this.

The resting shape must stay identical to the React icon at every size.

## Phase 0: proof of concept

Goal: prove the plain-JS player looks the same as motion/react before building anything big.

1. ✅ Put motion on one version everywhere first (14.3). Right now the site runs 13.0, `@animateicons/react` builds with 12.38, and shadcn and CLI users get the newest (14.3). Side-by-side checks mean nothing until these match.
2. Hand-write the data for six icons that cover every hard case: `bell` (rotate with an origin), one icon that draws on with `strokeDashoffset`, one that uses `pathLength`, one with a `custom` stagger, `trash-2` (several controllers) and `activity` (loop).
3. Write a first player and a test page that shows each icon twice, React on the left and the player on the right.
4. Compare them at 23px and 64px, hovering in, hovering out halfway through, and with reduced motion on.

Go if all six match by eye and by frame comparison. If pivots or line drawing do not match, try `motion-v` for Vue before going further, and rethink the plan.

## Phase 1: icon data

Goal: every icon turned into data automatically, at build time.

How to extract: render each React icon once with a stand-in for `motion/react` that writes down the props it gets instead of animating. Function variants and `custom` indexes resolve on their own this way, so no TypeScript parsing is needed.

1. Render each icon with `duration` 1 and again with `duration` 2. Every duration and delay must exactly double and nothing else may change. If an icon fails, list it, because it uses `duration` in a way the player cannot copy.
2. Keep a list of known animated properties and transition keys. The build fails when an icon uses something not on the list, so a new icon can never break the other packages quietly.
3. Write the data to a build folder that git ignores. It is rebuilt from the React files on every build, so it never goes stale.

Data shape, using `bell` as the example:

```ts
export const Bell: IconData = {
	name: "bell",
	library: "lucide",
	svg: {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
	},
	style: { transformOrigin: "top center" },
	normal: { rotate: 0 },
	animate: {
		rotate: [0, -12, 10.2, -6, 3, 0],
		transition: { duration: 1.1, ease: "easeInOut" },
	},
	children: [
		{
			tag: "path",
			attrs: { d: "M10.268 21a2 2 0 0 0 3.464 0" },
			normal: { x: 0 },
			animate: {
				x: [0, 1.7, -1.4, 0.8, -0.4, 0],
				transition: { duration: 1.1, ease: "easeInOut" },
			},
		},
		{
			tag: "path",
			attrs: {
				d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
			},
		},
	],
};
```

Done when:

- [x] All 1,170 icons extract with no errors.
- [x] The duration check passes, or the failing icons are listed and fixed in React first.
- [x] A test in `pnpm test` runs the extract, so CI catches a broken icon.

## Phase 2: the player

Goal: one small function that plays the data on a real SVG.

- `play(svg, data, { duration })` returns `start()`, `stop()` and `destroy()`.
- `start()` sends every animated element to its `animate` state, and `stop()` sends it back to `normal`. Stopping halfway animates back from where it is, the way React does.
- If `normal` has `transition: { duration: 0 }`, the player keeps it, so full spins do not run backwards on mouse leave.
- It uses `animate()` from `motion`, not `motion/mini`. The mini version cannot do SVG pivots or `pathLength`.
- It lives in the vanilla package and is exported from there, so Vue and Angular use the exact same code.

## Library plan: vanilla

Package: `@animateicons/vanilla`. For plain HTML sites and every framework without its own package (Svelte, Solid, Astro, server templates).

Three ways to use it:

```js
import { createIcon } from "@animateicons/vanilla";
import { Bell } from "@animateicons/vanilla/lucide";

const icon = createIcon(Bell, { size: 32, color: "tomato" });
document.querySelector("#bell").append(icon);
icon.startAnimation();
```

```html
<script type="module">
	import { defineIcons } from "@animateicons/vanilla";
	import { Bell, Heart } from "@animateicons/vanilla/lucide";
	defineIcons({ Bell, Heart });
</script>

<animate-icons name="bell" size="32"></animate-icons>
```

```html
<script src="https://cdn.jsdelivr.net/npm/@animateicons/vanilla/dist/cdn/lucide.js"></script>
<animate-icons name="bell"></animate-icons>
```

Build:

- tsup, copied from `npm/tsup.config.ts`, with one entry per icon so bundlers only ship the icons someone imports.
- A separate CDN build per library with every icon in it, for sites with no build step. It is big, so the docs say to use imports when possible.
- motion goes inside the bundle, same as the React package, so users install one thing.

Done when:

- [x] `createIcon`, `<animate-icons>` and the CDN script work in a plain HTML page.
- [ ] The custom tag works inside a Svelte page with no extra setup.
- [x] Size budgets for one icon, and for each CDN file, are set in `size-limit` after measuring.
- [x] Every rule in "Rules every package follows" has a test.
- [x] Docs page and package README.

## Library plan: Vue

Package: `@animateicons/vue`. Vue 3.5 or newer (for `useId`, which keeps icon ids stable between the server and the browser), which also covers Nuxt 3 and 4.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BellIcon } from "@animateicons/vue/lucide";

const bell = ref<InstanceType<typeof BellIcon>>();
</script>

<template>
	<BellIcon :size="32" color="tomato" />
	<BellIcon ref="bell" :is-animated="false" @click="bell?.startAnimation()" />
</template>
```

Build:

- One shared component, `AnimateIcons`, written as a plain TypeScript render function (`defineComponent` and `h`). That way tsup builds it and no `.vue` compiler is needed.
- Each icon is a generated one-line file: `export const BellIcon = defineIcon(bell)`. One entry per icon, like React, so unused icons are dropped.
- `@animateicons/vanilla` is a dependency, so the player and motion exist once in a user's app.

Server rendering: the component renders the full SVG on the server, so Nuxt pages show the icon at rest with no flash. The player attaches in `onMounted` and is removed in `onBeforeUnmount`.

Done when:

- [ ] Works in a Vite Vue app and in a Nuxt app with server rendering on.
- [x] `startAnimation` and `stopAnimation` are exposed on the ref, with types.
- [x] Props are typed, so editors autocomplete `size`, `color`, `duration` and `isAnimated`.
- [x] Size budget, docs page and package README.

Later, if people ask: a Nuxt module that auto-imports icons, and a shadcn-vue registry so the CLI copy-paste flow works for Vue too.

## Library plan: Angular

Package: `@animateicons/angular`. Standalone components only. Support the Angular versions that are still maintained when work starts (likely 20 and newer).

```ts
import { Component, viewChild } from "@angular/core";
import { AnimateIcons } from "@animateicons/angular";
import { Bell } from "@animateicons/angular/lucide";

@Component({
	selector: "app-bell-button",
	imports: [AnimateIcons],
	template: `
		<animate-icons [icon]="bell" [size]="32" color="tomato" />
		<button (click)="icon()?.startAnimation()">Ring</button>
	`,
})
export class BellButton {
	bell = Bell;
	icon = viewChild(AnimateIcons);
}
```

Build:

- One component, `AnimateIcons`, and the icon data as plain imports. Generating 1,170 Angular components would make the build very slow, and lucide-angular shows the single-component style works well.
- Angular libraries must be built with `ng-packagr`, Angular's own library builder, not tsup. This is the biggest new tool in the plan.
- `@animateicons/vanilla` is a dependency, same as Vue.

Angular details:

- Run the animation outside Angular's change detection (`NgZone.runOutsideAngular`), so a hover does not re-check the whole page on every frame. Apps without zone.js are fine too.
- Server rendering renders the SVG at rest. The player starts in `afterNextRender`, which only runs in the browser.

Done when:

- [ ] Works in a new Angular app, with and without server rendering, with and without zone.js.
- [x] Signal inputs for `size`, `color`, `duration` and `isAnimated`, with types.
- [x] Size budget, docs page and package README.

Later, if people ask: generated per-icon components such as `<bell-icon />`.

## Site, docs and tools

- New docs pages under `app/icons/docs/`: vanilla, Vue and Angular. Run `pnpm gen:docs` after, and add a rule to `scripts/docs-markdown.ts` for any new MDX component.
- A framework switcher on the icon page and in the playground, so the copy button gives React, Vue, Angular or HTML code.
- Update copy that says the library is React only: the hero, the footer, `README.md` and `npm/README.md`.
- MCP server: `get_icon` takes a `framework` argument and returns usage for that framework.
- CLI: stays React only for now. The packages cover the other frameworks.

## Release and CI

- One publish workflow per package, each with its own tag prefix: `vanilla-v*`, `vue-v*`, `angular-v*`. The current `v*` tag stays for React.
- Each package gets its own `CHANGELOG.md` and starts at `0.1.0`.
- Add the new packages to `pnpm-workspace.yaml` and to `pnpm verify`.
- The frame comparison from Phase 0 runs in CI for a fixed sample of icons, at least one from every family.

## Order

| Step | What                           | Size   | Needs   |
| ---- | ------------------------------ | ------ | ------- |
| 0    | Align motion, proof of concept | Small  | nothing |
| 1    | Icon data extract              | Medium | 0       |
| 2    | Player                         | Small  | 1       |
| 3    | `@animateicons/vanilla` 0.1.0  | Medium | 2       |
| 4    | `@animateicons/vue` 0.1.0      | Small  | 3       |
| 5    | `@animateicons/angular` 0.1.0  | Medium | 3       |
| 6    | Site, docs, MCP                | Medium | 3       |

Steps 4, 5 and 6 can run side by side once vanilla is out.

## Risks

- Looks off: the plain player might not match React on pivots or line drawing. Phase 0 exists to find this early.
- motion moves fast: it went from 12 to 14 in about two months. Pin one version, upgrade all packages together and rerun the comparison.
- More to maintain: four packages instead of one. Icons are generated, so the extra work is the wrappers and the release steps, not each new icon.
- Angular tooling: `ng-packagr` and Angular version support add work every Angular release.

## Decisions needed

| Question                                | Recommendation                                                        |
| --------------------------------------- | --------------------------------------------------------------------- |
| Package names                           | `@animateicons/vanilla`, `@animateicons/vue`, `@animateicons/angular` |
| Custom tag name                         | `<animate-icons>`                                                     |
| Lowest Angular version                  | Only versions Angular still maintains                                 |
| Vue 2 support                           | No. Vue 2 reached end of life in 2023.                                |
| CLI and shadcn-vue in the first release | No, packages first                                                    |

## Not in this plan

- Native Svelte, Solid or Qwik packages. The vanilla custom tag already works there.
- React Native.
- Changing how icons are written. The React files stay the source.
