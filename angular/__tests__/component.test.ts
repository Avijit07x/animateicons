import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Bell, Heart } from "@animateicons/angular/lucide";
import { mountAnimateIcons } from "./harness";

const attached = vi.hoisted(
	() =>
		[] as {
			host: Element;
			svg: Element;
			options: Record<string, unknown>;
			mounted: Record<
				"startAnimation" | "stopAnimation" | "destroy",
				() => void
			>;
		}[],
);

vi.mock("@animateicons/vanilla", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@animateicons/vanilla")>();
	return {
		...actual,
		attachIcon: (
			host: Element,
			svg: Element,
			_icon: unknown,
			options: Record<string, unknown>,
		) => {
			const mounted = {
				startAnimation: vi.fn(),
				stopAnimation: vi.fn(),
				destroy: vi.fn(),
			};
			attached.push({ host, svg, options, mounted });
			return mounted;
		},
	};
});

let mounted: Awaited<ReturnType<typeof mountAnimateIcons>> | undefined;

beforeEach(() => {
	attached.length = 0;
});

afterEach(() => {
	mounted?.destroy();
	mounted = undefined;
});

describe("AnimateIcons", () => {
	it("renders the icon at 24px in a relative inline-flex host", async () => {
		mounted = await mountAnimateIcons({ icon: Bell });
		expect(mounted.host.style.position).toBe("relative");
		expect(mounted.host.style.display).toBe("inline-flex");
		expect(mounted.svg()?.getAttribute("width")).toBe("24");
		expect(mounted.svg()?.getAttribute("viewBox")).toBe("0 0 24 24");
		expect(attached.at(-1)?.options).toEqual({ duration: 1, isAnimated: true });
	});

	it("applies size, color, duration and isAnimated", async () => {
		mounted = await mountAnimateIcons({
			icon: Bell,
			size: "40",
			color: "tomato",
			duration: 2,
			isAnimated: "false",
		});
		expect(mounted.host.style.color).toBe("tomato");
		expect(mounted.svg()?.getAttribute("height")).toBe("40");
		expect(attached.at(-1)?.options).toEqual({
			duration: 2,
			isAnimated: false,
		});
	});

	it("draws a fresh svg and re-attaches when an input changes", async () => {
		mounted = await mountAnimateIcons({ icon: Bell });
		const first = attached.at(-1)!;
		mounted.update({ icon: Heart, size: 32 });
		expect(first.mounted.destroy).toHaveBeenCalledOnce();
		expect(attached.at(-1)?.svg).not.toBe(first.svg);
		expect(mounted.host.querySelectorAll("svg")).toHaveLength(1);
		expect(mounted.svg()?.getAttribute("width")).toBe("32");
	});

	it("exposes startAnimation and stopAnimation", async () => {
		mounted = await mountAnimateIcons({ icon: Bell, isAnimated: false });
		mounted.component.startAnimation();
		mounted.component.stopAnimation();
		const controls = attached.at(-1)!.mounted;
		expect(controls.startAnimation).toHaveBeenCalledOnce();
		expect(controls.stopAnimation).toHaveBeenCalledOnce();
	});

	it("cleans up when destroyed", async () => {
		mounted = await mountAnimateIcons({ icon: Bell });
		const controls = attached.at(-1)!.mounted;
		mounted.destroy();
		mounted = undefined;
		expect(controls.destroy).toHaveBeenCalledOnce();
	});
});
