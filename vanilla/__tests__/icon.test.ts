import { beforeEach, describe, expect, it, vi } from "vitest";
import { createIcon } from "../src/icon";
import { BELL, callsFor, reduceMotion, resetMotion } from "./fixtures";

vi.mock("motion", async () => (await import("./fixtures")).motionModule);

beforeEach(resetMotion);

const hover = (element: Element, type: "mouseenter" | "mouseleave") =>
	element.dispatchEvent(new MouseEvent(type));

const lastRootTarget = (icon: HTMLElement) =>
	callsFor(icon.querySelector("svg") as Element).at(-1)?.values;

describe("createIcon", () => {
	it("wraps the icon in a relative inline-flex span", () => {
		const icon = createIcon(BELL);
		expect(icon.tagName).toBe("SPAN");
		expect(icon.style.position).toBe("relative");
		expect(icon.style.display).toBe("inline-flex");
		expect(icon.querySelector("svg")?.getAttribute("width")).toBe("24");
	});

	it("applies size and color", () => {
		const icon = createIcon(BELL, { size: 40, color: "tomato" });
		expect(icon.style.color).toBe("tomato");
		expect(icon.querySelector("svg")?.getAttribute("height")).toBe("40");
	});

	it("plays on hover and resets when the pointer leaves", () => {
		const icon = createIcon(BELL);
		hover(icon, "mouseenter");
		expect(lastRootTarget(icon)).toEqual({ rotate: [0, -12, 10.2, -6, 3, 0] });
		hover(icon, "mouseleave");
		expect(lastRootTarget(icon)).toEqual({ rotate: 0 });
	});

	it("ignores hover when isAnimated is false but still plays on request", () => {
		const icon = createIcon(BELL, { isAnimated: false });
		const restingCalls = callsFor(icon.querySelector("svg") as Element).length;
		hover(icon, "mouseenter");
		hover(icon, "mouseleave");
		expect(callsFor(icon.querySelector("svg") as Element)).toHaveLength(
			restingCalls,
		);
		icon.startAnimation();
		expect(lastRootTarget(icon)).toEqual({ rotate: [0, -12, 10.2, -6, 3, 0] });
		icon.stopAnimation();
		expect(lastRootTarget(icon)).toEqual({ rotate: 0 });
	});

	it("stays at rest on hover and on request with reduced motion", () => {
		reduceMotion(true);
		const icon = createIcon(BELL);
		hover(icon, "mouseenter");
		expect(lastRootTarget(icon)).toEqual({ rotate: 0 });
		icon.startAnimation();
		expect(lastRootTarget(icon)).toEqual({ rotate: 0 });
	});

	it("removes the svg and stops listening when destroyed", () => {
		const icon = createIcon(BELL);
		const svg = icon.querySelector("svg") as Element;
		icon.destroy();
		const callsAfterDestroy = callsFor(svg).length;
		hover(icon, "mouseenter");
		expect(icon.querySelector("svg")).toBeNull();
		expect(callsFor(svg)).toHaveLength(callsAfterDestroy);
	});
});
