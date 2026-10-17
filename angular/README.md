# @animateicons/angular

1170 animated SVG icons for Angular. One standalone component with signal inputs, server rendering and zoneless support. The same motion as [`@animateicons/react`](https://www.npmjs.com/package/@animateicons/react).

[![npm](https://img.shields.io/npm/v/@animateicons/angular?color=f45b48)](https://www.npmjs.com/package/@animateicons/angular)
[![license](https://img.shields.io/npm/l/@animateicons/angular?color=f45b48)](./LICENSE)

Docs: [animateicons.in/icons/docs/angular](https://animateicons.in/icons/docs/angular). Browse every icon at [animateicons.in](https://animateicons.in).

## Installation

```bash
npm i @animateicons/angular
```

Works with Angular 20, 21 and 22, with or without zone.js.

## Usage

```ts
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

Icons are data, named after the icon in PascalCase (`bell-ring` is `BellRing`), and come from the `lucide` or `huge` subpath. The icon animates on hover. Server rendering outputs the whole icon at rest.

## Playing it yourself

```ts
import { Component, viewChild } from "@angular/core";
import { AnimateIcons } from "@animateicons/angular";
import { Bell } from "@animateicons/angular/lucide";

@Component({
	selector: "app-bell-button",
	imports: [AnimateIcons],
	template: `
		<button (click)="icon()?.startAnimation()">
			<animate-icons [icon]="bell" [isAnimated]="false" />
		</button>
	`,
})
export class BellButton {
	bell = Bell;
	icon = viewChild(AnimateIcons);
}
```

`[isAnimated]="false"` turns hover off so the icon only plays when you call `startAnimation()`. The animation runs outside Angular's change detection, so hovering never re-checks your page.

## Inputs

| Input        | Type       | Default        |
| ------------ | ---------- | -------------- |
| `icon`       | `IconData` | required       |
| `size`       | `number`   | `24`           |
| `color`      | `string`   | `currentColor` |
| `duration`   | `number`   | `1`            |
| `isAnimated` | `boolean`  | `true`         |

`duration` multiplies every duration and delay. With reduced motion turned on, hover does nothing and `startAnimation()` keeps the icon at rest.

## License

MIT. The icon shapes come from Lucide and Huge Icons, see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
