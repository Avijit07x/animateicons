import { vi } from "vitest";
import type { IconData } from "../src/types";

interface AnimateCall {
	element: Element;
	values: Record<string, unknown>;
	options: Record<string, unknown>;
}

interface BindCall {
	element: Element;
	values: Record<string, unknown>;
}

const calls: AnimateCall[] = [];
const bindings: BindCall[] = [];

export const motionMock = {
	calls,
	bindings,
	release: vi.fn(),
	svgEffect: vi.fn(
		(element: Element, values: Record<string, { value: unknown }>) => {
			bindings.push({
				element,
				values: Object.fromEntries(
					Object.entries(values).map(([key, { value }]) => [key, value]),
				),
			});
			return motionMock.release;
		},
	),
	animate: vi.fn(
		(
			element: Element,
			values: Record<string, unknown>,
			options: Record<string, unknown> = {},
		) => {
			calls.push({ element, values, options });
			return { stop: vi.fn() };
		},
	),
};

export const motionModule = {
	animate: motionMock.animate,
	svgEffect: motionMock.svgEffect,
	motionValue: (value: unknown) => ({ value }),
};

export const resetMotion = () => {
	motionMock.calls.length = 0;
	motionMock.bindings.length = 0;
	motionMock.animate.mockClear();
	motionMock.svgEffect.mockClear();
	motionMock.release.mockClear();
};

export const restingFor = (element: Element) =>
	motionMock.bindings.find((binding) => binding.element === element)?.values;

export const callsFor = (element: Element) =>
	motionMock.calls.filter((call) => call.element === element);

export const reduceMotion = (reduce: boolean) =>
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({ matches: reduce })),
	);

export const BELL: IconData = {
	name: "bell",
	library: "lucide",
	tag: "svg",
	attrs: {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
	},
	style: { transformOrigin: "top center" },
	normal: { rotate: 0 },
	animate: {
		rotate: [0, -12, 10.2, -6, 3, 0],
		transition: { duration: 1.1, ease: "easeInOut" },
	},
	children: [
		{
			tag: "path",
			attrs: { d: "M10.268 21a2 2 0 0 0 3.464 0" },
			normal: { x: 0 },
			animate: {
				x: [0, 1.7, -1.4, 0.8, -0.4, 0],
				transition: { duration: 1.1, delay: 0.2, ease: "easeInOut" },
			},
		},
		{ tag: "path", attrs: { d: "M3.262 15.326A1 1 0 0 0 4 17h16" } },
	],
};

export const TRASH: IconData = {
	name: "trash-2",
	library: "huge",
	tag: "svg",
	attrs: { viewBox: "0 0 24 24" },
	children: [
		{
			tag: "g",
			style: { transformBox: "view-box", originX: "3px", originY: "6px" },
			normal: { rotate: 0 },
			animate: {
				rotate: [0, -24, 0],
				transition: {
					rotate: { duration: 0.9, delay: 0.1 },
					repeatDelay: 0.3,
				},
			},
			children: [{ tag: "path", attrs: { d: "M3 6h18" } }],
		},
	],
};
