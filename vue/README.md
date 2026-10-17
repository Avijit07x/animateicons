# @animateicons/vue

1170 animated SVG icons for Vue 3 and Nuxt. The same motion as [`@animateicons/react`](https://www.npmjs.com/package/@animateicons/react), with server rendering and typed refs.

[![npm](https://img.shields.io/npm/v/@animateicons/vue?color=f45b48)](https://www.npmjs.com/package/@animateicons/vue)
[![license](https://img.shields.io/npm/l/@animateicons/vue?color=f45b48)](./LICENSE)

Docs: [animateicons.in/icons/docs/vue](https://animateicons.in/icons/docs/vue). Browse every icon at [animateicons.in](https://animateicons.in).

## Installation

```bash
npm i @animateicons/vue
```

Needs Vue 3.5 or newer. Works in Nuxt 3 and 4.

## Usage

```vue
<script setup lang="ts">
import { BellRingIcon } from "@animateicons/vue/lucide";
</script>

<template>
	<BellRingIcon :size="32" color="tomato" />
</template>
```

The icon animates on hover. On the server it renders the whole icon at rest, so pages show it before hydration.

## Playing it yourself

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BellRingIcon } from "@animateicons/vue/lucide";

const bell = ref<InstanceType<typeof BellRingIcon>>();
</script>

<template>
	<button @click="bell?.startAnimation()">
		<BellRingIcon ref="bell" :is-animated="false" />
	</button>
</template>
```

`:is-animated="false"` turns hover off so the icon only plays when you call `startAnimation()`.

## One component for any icon

The `lucide` and `huge` subpaths also export the icon data, for the generic `AnimateIcons` component:

```vue
<script setup lang="ts">
import { AnimateIcons } from "@animateicons/vue";
import { Bell } from "@animateicons/vue/lucide";
</script>

<template>
	<AnimateIcons :icon="Bell" :size="24" />
</template>
```

## Props

| Prop          | Type      | Default        |
| ------------- | --------- | -------------- |
| `size`        | `number`  | `24`           |
| `color`       | `string`  | `currentColor` |
| `duration`    | `number`  | `1`            |
| `is-animated` | `boolean` | `true`         |

`duration` multiplies every duration and delay. With reduced motion turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

## License

MIT. The icon shapes come from Lucide and Huge Icons, see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
