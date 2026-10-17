import { afterEach, describe, expect, it } from "vitest";
import { Bell } from "@animateicons/angular/lucide";
import { mountAnimateIcons, settle } from "./harness";

let mounted: Awaited<ReturnType<typeof mountAnimateIcons>> | undefined;

afterEach(() => {
	mounted?.destroy();
	mounted = undefined;
});

describe("zoneless app with the real player", () => {
	it("rotates the bell on hover and returns it to rest", async () => {
		mounted = await mountAnimateIcons({ icon: Bell, duration: 0.5 });
		const svg = mounted.svg() as SVGSVGElement;
		mounted.host.dispatchEvent(new MouseEvent("mouseenter"));
		await settle(120);
		expect(svg.style.transform).toMatch(/rotate\(-?\d/);
		mounted.host.dispatchEvent(new MouseEvent("mouseleave"));
		await settle(900);
		expect(svg.style.transform).toBe("none");
	});
});
