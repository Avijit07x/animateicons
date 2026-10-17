# Vue

`@animateicons/vue` plays the same animations as the React package, as Vue components. It needs Vue 3.5 or newer and works in Nuxt 3 and 4.

## Installation

- `npm install @animateicons/vue`
- `pnpm add @animateicons/vue`
- `yarn add @animateicons/vue`
- `bun add @animateicons/vue`

`motion` comes with it, so this is the only install.

## Usage

Import any icon component from the `lucide` or `huge` subpath. The name is the icon name in PascalCase plus `Icon`: `bell-ring` is `BellRingIcon`, and the Huge `arrow-up-right-0-1` is `ArrowUpRight01Icon`.

```vue title="Example.vue"
<script setup lang="ts">
import { BellRingIcon } from "@animateicons/vue/lucide";
</script>

<template>
	<BellRingIcon :size="32" color="tomato" />
</template>
```

The icon plays on hover and resets when the pointer leaves.

## Props

```vue title="Example.vue"
<BellRingIcon
	:size="32"
	color="tomato"
	:duration="1.5"
	:is-animated="true"
/>
```

- `size`: width and height in pixels. Default `24`.
- `color`: the icon color. Default `currentColor`, so the icon follows the text color.
- `duration`: a speed multiplier for every duration and delay. `2` plays at half speed. Default `1`.
- `is-animated`: play on hover. `false` turns hover off, while `startAnimation()` still works. Default `true`.

## Playing it yourself

Every icon exposes `startAnimation()` and `stopAnimation()` on its ref, with types.

```vue title="RingButton.vue"
<script setup lang="ts">
import { ref } from "vue";
import { BellIcon } from "@animateicons/vue/lucide";

const bell = ref<InstanceType<typeof BellIcon>>();
</script>

<template>
	<button @click="bell?.startAnimation()">
		<BellIcon ref="bell" :is-animated="false" />
	</button>
</template>
```

> **Note:** In React, passing a `ref` switches an icon to manual mode on its own. Vue cannot detect that, so manual mode means `:is-animated="false"` plus your own `startAnimation()` calls.

## One component for any icon

The `lucide` and `huge` subpaths also export the icon data, named without the `Icon` suffix. Pass it to the generic `AnimateIcons` component, for example when the icon comes from a prop or a list.

```vue title="Example.vue"
<script setup lang="ts">
import { AnimateIcons } from "@animateicons/vue";
import { Bell } from "@animateicons/vue/lucide";
</script>

<template>
	<AnimateIcons :icon="Bell" :size="32" />
</template>
```

`AnimateIcons` takes the same props as the icon components, plus `icon`.

## Nuxt and server rendering

On the server the component renders the whole icon at rest, so pages show it before hydration with no flash. The animation attaches after the component mounts in the browser.

> **Note:** Animations respect the **Reduce Motion** setting. With it turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

---

Source: https://animateicons.in/icons/docs/vue
All AnimateIcons docs: https://animateicons.in/llms.txt
