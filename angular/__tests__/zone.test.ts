import "zone.js";
import { NgZone, provideZoneChangeDetection } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import { Bell } from "@animateicons/angular/lucide";
import { mountAnimateIcons, settle } from "./harness";

let mounted: Awaited<ReturnType<typeof mountAnimateIcons>> | undefined;

afterEach(() => {
	mounted?.destroy();
	mounted = undefined;
});

describe("zone.js app", () => {
	it("plays on request outside Angular's change detection", async () => {
		mounted = await mountAnimateIcons({ icon: Bell, duration: 0.5 }, [
			provideZoneChangeDetection(),
		]);
		const svg = mounted.svg() as SVGSVGElement;
		let insideAngular: boolean | undefined;
		const observer = new MutationObserver(() => {
			insideAngular ??= NgZone.isInAngularZone();
		});
		observer.observe(svg, { attributes: true });
		mounted.component.startAnimation();
		await settle(120);
		observer.disconnect();
		expect(svg.style.transform).toMatch(/rotate\(-?\d/);
		expect(insideAngular).toBe(false);
	});
});
