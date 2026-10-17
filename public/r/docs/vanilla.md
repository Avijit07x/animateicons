# Plain JS and web components

`@animateicons/vanilla` plays the same animations as the React package, with no framework needed. Use it in plain HTML, Svelte, Solid, Astro, server templates or any framework that has no package of its own.

## Installation

- `npm install @animateicons/vanilla`
- `pnpm add @animateicons/vanilla`
- `yarn add @animateicons/vanilla`
- `bun add @animateicons/vanilla`

`motion` is bundled, so this is the only install. No build step? Skip to the [CDN script](#cdn).

## Usage

Every icon is plain data, imported from the `lucide` or `huge` subpath. The export name is the icon name in PascalCase: `bell-ring` is `BellRing`, and the Huge `arrow-up-right-0-1` is `ArrowUpRight01`.

```js title="main.js"
import { createIcon } from "@animateicons/vanilla";
import { Bell } from "@animateicons/vanilla/lucide";

const icon = createIcon(Bell, { size: 32, color: "tomato" });
document.querySelector("#bell").append(icon);
```

`createIcon` returns a `span` element with the icon inside. It plays on hover and resets when the pointer leaves.

Each icon also has its own entry. Import from it to load only that icon, even without tree shaking:

```js title="main.js"
import { Bell } from "@animateicons/vanilla/lucide/bell";
```

## Custom element

Register the icons you use once with `defineIcons`, then write the `animate-icons` tag anywhere in your HTML, including Svelte, Solid and Astro templates.

```html title="index.html"
<script type="module">
	import { defineIcons } from "@animateicons/vanilla";
	import { Bell, Heart } from "@animateicons/vanilla/lucide";

	defineIcons({ Bell, Heart });
</script>

<animate-icons name="bell" size="32" color="tomato"></animate-icons>
<animate-icons name="heart"></animate-icons>
```

The `name` attribute is the icon's file name, such as `bell` or `bell-ring`. When Lucide and Huge both have an icon with that name, add `library="lucide"` or `library="huge"` to pick one.

The tag takes `size`, `color`, `duration` and `is-animated="false"` as attributes.

## CDN

For a page with no build step, one script registers the `animate-icons` tag and every icon of a library.

```html title="index.html"
<script src="https://cdn.jsdelivr.net/npm/@animateicons/vanilla/dist/cdn/lucide.js"></script>

<animate-icons name="bell"></animate-icons>
```

Use `dist/cdn/huge.js` for Huge icons. The script also exposes a global `AnimateIcons` object with `createIcon`, `defineIcons` and `icons`:

```js title="main.js"
const icon = AnimateIcons.createIcon(AnimateIcons.icons.Bell, { size: 32 });
document.body.append(icon);
```

> **Note:** The CDN script holds every icon of its library, about 69 kB for Lucide and 113 kB for Huge after compression. Prefer imports when you have a bundler.

## Options

`createIcon` takes the icon data and an options object:

```js title="main.js"
createIcon(Bell, {
	size: 32,
	color: "tomato",
	duration: 1.5,
	isAnimated: true,
});
```

- `size`: width and height in pixels. Default `24`.
- `color`: the icon color. Default `currentColor`, so the icon follows the text color.
- `duration`: a speed multiplier for every duration and delay. `2` plays at half speed. Default `1`.
- `isAnimated`: play on hover. `false` turns hover off, while `startAnimation()` still works. Default `true`. On the tag, write `is-animated="false"`.

## Playing it yourself

The element from `createIcon` has `startAnimation()`, `stopAnimation()` and `destroy()`. Call `destroy()` when you remove the icon, so its listeners go with it.

```js title="main.js"
const icon = createIcon(Bell, { isAnimated: false });
document.querySelector("#bell").append(icon);

document.querySelector("#ring").addEventListener("click", () => {
	icon.startAnimation();
});
```

The `animate-icons` tag has `startAnimation()` and `stopAnimation()` too, and cleans up on its own when it leaves the page:

```html title="index.html"
<button id="ring">Ring</button>
<animate-icons id="bell" name="bell" is-animated="false"></animate-icons>

<script type="module">
	document.querySelector("#ring").addEventListener("click", () => {
		document.querySelector("#bell").startAnimation();
	});
</script>
```

> **Note:** In React, passing a `ref` switches an icon to manual mode on its own. Plain JS cannot detect that, so manual mode means `isAnimated: false` (or `is-animated="false"` on the tag) plus your own `startAnimation()` calls.

## Reduced motion and server rendering

Animations respect the **Reduce Motion** setting. With it turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

`createIcon` and the custom element draw the icon in the browser. In a server-rendered page, such as Astro or SvelteKit, the `animate-icons` tag stays empty until its script runs. Using Vue or Angular? Their packages render the icon on the server, see [Vue](https://animateicons.in/icons/docs/vue) and [Angular](https://animateicons.in/icons/docs/angular).

---

Source: https://animateicons.in/icons/docs/vanilla
All AnimateIcons docs: https://animateicons.in/llms.txt
