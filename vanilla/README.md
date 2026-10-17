# @animateicons/vanilla

1170 animated SVG icons for plain JavaScript, web components and every framework without its own package (Svelte, Solid, Astro, server templates). The same motion as [`@animateicons/react`](https://www.npmjs.com/package/@animateicons/react), with no framework needed.

[![npm](https://img.shields.io/npm/v/@animateicons/vanilla?color=f45b48)](https://www.npmjs.com/package/@animateicons/vanilla)
[![license](https://img.shields.io/npm/l/@animateicons/vanilla?color=f45b48)](./LICENSE)

Docs: [animateicons.in/icons/docs/vanilla](https://animateicons.in/icons/docs/vanilla). Browse every icon at [animateicons.in](https://animateicons.in).

## Installation

```bash
npm i @animateicons/vanilla
```

## Usage

Every icon is plain data, imported from the `lucide` or `huge` subpath. Names are the icon name in PascalCase: `bell-ring` is `BellRing`.

```js
import { createIcon } from "@animateicons/vanilla";
import { BellRing } from "@animateicons/vanilla/lucide";

const icon = createIcon(BellRing, { size: 32, color: "tomato" });
document.querySelector("#bell").append(icon);
```

The icon animates on hover. Call `icon.startAnimation()` and `icon.stopAnimation()` to play it yourself, and `icon.destroy()` when you remove it.

## Custom element

Register the icons you use once, then write the tag anywhere, including inside Svelte, Solid or Astro pages:

```html
<script type="module">
	import { defineIcons } from "@animateicons/vanilla";
	import { Bell, Heart } from "@animateicons/vanilla/lucide";

	defineIcons({ Bell, Heart });
</script>

<animate-icons name="bell" size="32" color="tomato"></animate-icons>
```

Attributes: `name`, `library` (`lucide` or `huge`, only needed when both have the name), `size`, `color`, `duration` and `is-animated`. The element has `startAnimation()` and `stopAnimation()`.

## CDN

For pages with no build step, one script registers every icon of a library:

```html
<script src="https://cdn.jsdelivr.net/npm/@animateicons/vanilla/dist/cdn/lucide.js"></script>

<animate-icons name="bell"></animate-icons>
```

Use `dist/cdn/huge.js` for Huge icons. The script also exposes `AnimateIcons.createIcon`, `AnimateIcons.defineIcons` and `AnimateIcons.icons`. It holds every icon of the library (about 69 kB for Lucide and 113 kB for Huge, compressed), so prefer imports when you have a bundler.

## Options

| Option       | Type      | Default        |
| ------------ | --------- | -------------- |
| `size`       | `number`  | `24`           |
| `color`      | `string`  | `currentColor` |
| `duration`   | `number`  | `1`            |
| `isAnimated` | `boolean` | `true`         |

`duration` multiplies every duration and delay, so `2` plays at half speed. `isAnimated: false` turns hover off, while `startAnimation()` still works. With reduced motion turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

## License

MIT. The icon shapes come from Lucide and Huge Icons, see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
