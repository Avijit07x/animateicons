# Angular

`@animateicons/angular` plays the same animations as the React package, as one standalone component. It works with Angular 20, 21 and 22, with or without zone.js.

## Installation

- `npm install @animateicons/angular`
- `pnpm add @animateicons/angular`
- `yarn add @animateicons/angular`
- `bun add @animateicons/angular`

`motion` comes with it, so this is the only install.

## Usage

Add `AnimateIcons` to your component's `imports` and pass it an icon. Icons are data from the `lucide` or `huge` subpath, named after the icon in PascalCase: `bell-ring` is `BellRing`, and the Huge `arrow-up-right-0-1` is `ArrowUpRight01`.

```ts title="example.ts"
import { Component } from "@angular/core";
import { AnimateIcons } from "@animateicons/angular";
import { BellRing } from "@animateicons/angular/lucide";

@Component({
	selector: "app-example",
	imports: [AnimateIcons],
	template: `<animate-icons [icon]="bellRing" [size]="32" color="tomato" />`,
})
export class Example {
	bellRing = BellRing;
}
```

The icon plays on hover and resets when the pointer leaves.

## Inputs

Every input is a signal input.

```html title="example.html"
<animate-icons
	[icon]="bellRing"
	[size]="32"
	color="tomato"
	[duration]="1.5"
	[isAnimated]="true"
/>
```

- `icon`: the icon data. Required.
- `size`: width and height in pixels. Default `24`.
- `color`: the icon color. Default `currentColor`, so the icon follows the text color.
- `duration`: a speed multiplier for every duration and delay. `2` plays at half speed. Default `1`.
- `isAnimated`: play on hover. `false` turns hover off, while `startAnimation()` still works. Default `true`.

## Playing it yourself

Get the component with `viewChild` and call `startAnimation()` or `stopAnimation()`.

```ts title="bell-button.ts"
import { Component, viewChild } from "@angular/core";
import { AnimateIcons } from "@animateicons/angular";
import { Bell } from "@animateicons/angular/lucide";

@Component({
	selector: "app-bell-button",
	imports: [AnimateIcons],
	template: `
		<animate-icons [icon]="bell" [size]="32" [isAnimated]="false" />
		<button (click)="icon()?.startAnimation()">Ring</button>
	`,
})
export class BellButton {
	bell = Bell;
	icon = viewChild(AnimateIcons);
}
```

> **Note:** In React, passing a `ref` switches an icon to manual mode on its own. Angular cannot detect that, so manual mode means `[isAnimated]="false"` plus your own `startAnimation()` calls.

## Server rendering and change detection

With server rendering, the component outputs the whole icon at rest, so the page shows it before hydration. The animation only starts in the browser.

The animation runs outside Angular's change detection, so hovering an icon never triggers a change detection run in your app. Zoneless apps need no extra setup.

> **Note:** Animations respect the **Reduce Motion** setting. With it turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

---

Source: https://animateicons.in/icons/docs/angular
All AnimateIcons docs: https://animateicons.in/llms.txt
