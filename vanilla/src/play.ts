import {
	animate,
	motionValue,
	svgEffect,
	type AnimationOptions,
	type AnimationPlaybackControls,
	type DOMKeyframesDefinition,
} from "motion";
import { hasOrigin, hasTransform } from "./motion-properties";
import type { IconData, IconNode, MotionTarget, MotionValues } from "./types";

export interface IconPlayer {
	start: () => void;
	stop: () => void;
	destroy: () => void;
}

const TIMING_OPTIONS = new Set(["duration", "delay", "repeatDelay"]);
const CENTER = { originX: "50%", originY: "50%" };
const NO_PROPS = {};

export const prefersReducedMotion = () =>
	typeof matchMedia === "function" &&
	matchMedia("(prefers-reduced-motion: reduce)").matches;

const scaleTiming = (
	transition: MotionValues | undefined,
	factor: number,
): MotionValues | undefined =>
	transition &&
	Object.fromEntries(
		Object.entries(transition).map(([key, value]) => [
			key,
			TIMING_OPTIONS.has(key) && typeof value === "number"
				? value * factor
				: typeof value === "object" && value !== null && !Array.isArray(value)
					? scaleTiming(value as MotionValues, factor)
					: value,
		]),
	);

const withoutTransition = (target: MotionTarget | undefined) => {
	const values = { ...target };
	delete values.transition;
	return values;
};

const finalValue = (value: unknown) =>
	Array.isArray(value) ? value[value.length - 1] : value;

const bindResting = (element: Element, node: IconNode, isRoot: boolean) => {
	const centered = !isRoot && hasTransform(node) && !hasOrigin(node);
	const resting = {
		...(centered && CENTER),
		...node.style,
		...withoutTransition(node.normal),
	};
	const owner = { current: element, getProps: () => NO_PROPS };
	return svgEffect(
		element,
		Object.fromEntries(
			Object.entries(resting).map(([key, value]) => [
				key,
				motionValue(finalValue(value), { owner }),
			]),
		),
	);
};

const collectAnimated = (
	element: Element,
	node: IconNode,
	parts: [Element, IconNode][],
) => {
	if (node.normal || node.animate) parts.push([element, node]);
	node.children?.forEach((child, index) => {
		const childElement = element.children[index];
		if (childElement) collectAnimated(childElement, child, parts);
	});
	return parts;
};

export function play(
	svg: SVGSVGElement,
	data: IconData,
	{ duration = 1 }: { duration?: number } = {},
): IconPlayer {
	const parts = collectAnimated(svg, data, []);
	const unbind = parts.map(([element, node]) =>
		bindResting(element, node, element === svg),
	);
	let running: AnimationPlaybackControls[] = [];

	const goTo = (state: "normal" | "animate") => {
		running = parts.flatMap(([element, node]) => {
			const target = node[state];
			if (!target) return [];
			return animate(
				element,
				withoutTransition(target) as DOMKeyframesDefinition,
				scaleTiming(target.transition, duration) as AnimationOptions,
			);
		});
	};

	return {
		start: () => goTo(prefersReducedMotion() ? "normal" : "animate"),
		stop: () => goTo("normal"),
		destroy: () => {
			for (const animation of running) animation.stop();
			running = [];
			for (const release of unbind) release();
		},
	};
}
