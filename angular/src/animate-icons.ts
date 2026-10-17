import {
	afterRenderEffect,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	DOCUMENT,
	effect,
	ElementRef,
	inject,
	input,
	NgZone,
	numberAttribute,
	signal,
} from "@angular/core";
import {
	attachIcon,
	renderIcon,
	type IconControls,
	type IconData,
	type MountedIcon,
} from "@animateicons/vanilla";

@Component({
	selector: "animate-icons",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		ngSkipHydration: "true",
		"[style.position]": "'relative'",
		"[style.display]": "'inline-flex'",
		"[style.color]": "color()",
	},
})
export class AnimateIcons implements IconControls {
	readonly icon = input.required<IconData>();
	readonly size = input(24, { transform: numberAttribute });
	readonly color = input<string>();
	readonly duration = input(1, { transform: numberAttribute });
	readonly isAnimated = input(true, { transform: booleanAttribute });

	private readonly host: HTMLElement = inject(ElementRef).nativeElement;
	private readonly document = inject(DOCUMENT);
	private readonly zone = inject(NgZone);
	private readonly svg = signal<SVGSVGElement | undefined>(undefined);
	private mounted: MountedIcon | undefined;

	constructor() {
		effect(() => {
			const svg = renderIcon(this.icon(), this.size(), this.document);
			while (this.host.firstChild) this.host.removeChild(this.host.firstChild);
			this.host.appendChild(svg);
			this.svg.set(svg);
		});

		afterRenderEffect((onCleanup) => {
			const svg = this.svg();
			if (!svg) return;
			const icon = this.icon();
			const options = {
				duration: this.duration(),
				isAnimated: this.isAnimated(),
			};
			const mounted = this.zone.runOutsideAngular(() =>
				attachIcon(this.host, svg, icon, options),
			);
			this.mounted = mounted;
			onCleanup(() => {
				mounted.destroy();
				if (this.mounted === mounted) this.mounted = undefined;
			});
		});
	}

	startAnimation() {
		this.zone.runOutsideAngular(() => this.mounted?.startAnimation());
	}

	stopAnimation() {
		this.zone.runOutsideAngular(() => this.mounted?.stopAnimation());
	}
}
