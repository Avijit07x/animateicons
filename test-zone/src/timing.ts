import type { IconNode, MotionValues } from "@animateicons/vanilla";

const DEFAULT_DURATION = 0.8;

const isTransition = (value: unknown): value is MotionValues =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const valueSeconds = (
	transition: MotionValues | undefined,
	root: MotionValues | undefined,
) => {
	const options = transition ?? root ?? {};
	const delay = Number(options.delay ?? root?.delay ?? 0);
	const duration = Number(options.duration ?? DEFAULT_DURATION);
	const repeat = Number(options.repeat ?? 0);
	const cycles = Number.isFinite(repeat) ? repeat + 1 : 1;
	const pauses = (cycles - 1) * Number(options.repeatDelay ?? 0);
	return delay + cycles * duration + pauses;
};

export function animationSeconds(node: IconNode): number {
	const root = node.animate?.transition;
	const own = Object.keys(node.animate ?? {})
		.filter((key) => key !== "transition")
		.map((key) => {
			const perValue = root?.[key];
			return valueSeconds(isTransition(perValue) ? perValue : undefined, root);
		});
	return Math.max(0, ...own, ...(node.children ?? []).map(animationSeconds));
}
